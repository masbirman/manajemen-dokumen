"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { jsPDF } from "jspdf";

// Declare OpenCV type
declare global {
  interface Window {
    cv: any;
    Module: any;
  }
}

interface ScannedPage {
  id: string;
  originalData: string;
  processedData: string;
}

interface DocumentScannerProps {
  onPdfGenerated?: (pdfBlob: Blob, fileName: string) => void;
  onClose?: () => void;
  nilai?: string;
}

interface Point {
  x: number;
  y: number;
}

export default function DocumentScanner({
  onPdfGenerated,
  onClose,
  nilai,
}: DocumentScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const processingCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [scanning, setScanning] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [scanMode, setScanMode] = useState<"single" | "multi">("single");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [documentDetected, setDocumentDetected] = useState(false);
  const [corners, setCorners] = useState<Point[]>([]);
  const [cvReady, setCvReady] = useState(false);
  const [cvLoading, setCvLoading] = useState(true);
  
  const animationRef = useRef<number>();
  const detectionStableCount = useRef(0);
  const lastCorners = useRef<Point[]>([]);

  const videoConstraints = {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    facingMode: facingMode,
  };

  // Load OpenCV.js from CDN
  useEffect(() => {
    const loadOpenCV = async () => {
      if (window.cv && window.cv.Mat) {
        setCvReady(true);
        setCvLoading(false);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://docs.opencv.org/4.9.0/opencv.js";
      script.async = true;
      
      script.onload = () => {
        // OpenCV.js uses Module pattern - wait for it to be ready
        const checkReady = () => {
          if (window.cv && window.cv.Mat) {
            setCvReady(true);
            setCvLoading(false);
          } else {
            setTimeout(checkReady, 100);
          }
        };
        checkReady();
      };
      
      script.onerror = () => {
        console.error("Failed to load OpenCV.js");
        setCvLoading(false);
      };
      
      document.head.appendChild(script);
    };

    loadOpenCV();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleUserMediaError = useCallback((error: string | DOMException) => {
    console.error("Camera error:", error);
    if (typeof error === "string") {
      setCameraError(error);
    } else {
      setCameraError(error.message || "Tidak dapat mengakses kamera");
    }
  }, []);

  // Order points: top-left, top-right, bottom-right, bottom-left
  const orderPoints = useCallback((pts: Point[]): Point[] => {
    if (pts.length !== 4) return pts;
    
    // Sort by y first to get top/bottom pairs
    const sorted = [...pts].sort((a, b) => a.y - b.y);
    const top = sorted.slice(0, 2).sort((a, b) => a.x - b.x);
    const bottom = sorted.slice(2, 4).sort((a, b) => a.x - b.x);
    
    return [top[0], top[1], bottom[1], bottom[0]];
  }, []);

  // Calculate distance between two points
  const distance = (p1: Point, p2: Point): number => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  };

  // Check if corners are stable (not jumping around)
  const cornersAreStable = useCallback((newCorners: Point[]): boolean => {
    if (lastCorners.current.length !== 4 || newCorners.length !== 4) {
      lastCorners.current = newCorners;
      return false;
    }

    const threshold = 10; // pixels
    let stable = true;
    
    for (let i = 0; i < 4; i++) {
      if (distance(lastCorners.current[i], newCorners[i]) > threshold) {
        stable = false;
        break;
      }
    }
    
    lastCorners.current = newCorners;
    return stable;
  }, []);

  // OpenCV-based document detection
  const detectDocument = useCallback(() => {
    if (!cvReady || !window.cv) {
      animationRef.current = requestAnimationFrame(detectDocument);
      return;
    }

    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || video.readyState !== 4) {
      animationRef.current = requestAnimationFrame(detectDocument);
      return;
    }

    const cv = window.cv;

    try {
      // Set canvas size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(video, 0, 0);

      // Read image from canvas
      const src = cv.imread(canvas);
      const gray = new cv.Mat();
      const blurred = new cv.Mat();
      const edges = new cv.Mat();
      
      // Convert to grayscale
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      
      // Apply Gaussian blur
      cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
      
      // Canny edge detection
      cv.Canny(blurred, edges, 50, 150);
      
      // Dilate to close gaps
      const kernel = cv.Mat.ones(3, 3, cv.CV_8U);
      cv.dilate(edges, edges, kernel);
      
      // Find contours
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();
      cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
      
      let maxArea = 0;
      let bestContour: any = null;
      
      // Find largest quadrilateral
      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const area = cv.contourArea(contour);
        
        if (area > maxArea && area > (canvas.width * canvas.height * 0.1)) {
          const peri = cv.arcLength(contour, true);
          const approx = new cv.Mat();
          cv.approxPolyDP(contour, approx, 0.02 * peri, true);
          
          if (approx.rows === 4) {
            maxArea = area;
            if (bestContour) bestContour.delete();
            bestContour = approx;
          } else {
            approx.delete();
          }
        }
      }
      
      if (bestContour && bestContour.rows === 4) {
        // Extract corner points
        const pts: Point[] = [];
        for (let i = 0; i < 4; i++) {
          pts.push({
            x: bestContour.data32S[i * 2],
            y: bestContour.data32S[i * 2 + 1],
          });
        }
        
        const orderedPts = orderPoints(pts);
        
        // Check stability
        if (cornersAreStable(orderedPts)) {
          detectionStableCount.current++;
        } else {
          detectionStableCount.current = 0;
        }
        
        // Update state if stable for a few frames
        if (detectionStableCount.current >= 3) {
          setDocumentDetected(true);
          setCorners(orderedPts);
        }
        
        bestContour.delete();
      } else {
        detectionStableCount.current = 0;
        setDocumentDetected(false);
        setCorners([]);
      }
      
      // Cleanup
      src.delete();
      gray.delete();
      blurred.delete();
      edges.delete();
      kernel.delete();
      contours.delete();
      hierarchy.delete();
      
    } catch (error) {
      console.error("Detection error:", error);
    }

    animationRef.current = requestAnimationFrame(detectDocument);
  }, [cvReady, orderPoints, cornersAreStable]);

  // Start detection when camera and OpenCV are ready
  useEffect(() => {
    if (cvReady) {
      animationRef.current = requestAnimationFrame(detectDocument);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [cvReady, detectDocument]);

  // Perspective transform and process image
  const processCapture = useCallback(async (imageSrc: string, docCorners: Point[]): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const cv = window.cv;
        
        if (!cv || docCorners.length !== 4) {
          // Fallback: just enhance the image
          resolve(enhanceImage(imageSrc));
          return;
        }

        try {
          // Create canvas and draw image
          const canvas = processingCanvasRef.current || document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          
          // Read image
          const src = cv.imread(canvas);
          
          // Calculate output dimensions (A4 ratio at reasonable resolution)
          const orderedCorners = docCorners;
          const widthTop = distance(orderedCorners[0], orderedCorners[1]);
          const widthBottom = distance(orderedCorners[3], orderedCorners[2]);
          const heightLeft = distance(orderedCorners[0], orderedCorners[3]);
          const heightRight = distance(orderedCorners[1], orderedCorners[2]);
          
          const maxWidth = Math.max(widthTop, widthBottom);
          const maxHeight = Math.max(heightLeft, heightRight);
          
          // Target: max 1200px width for good quality but reasonable size
          const scale = Math.min(1200 / maxWidth, 1600 / maxHeight, 1);
          const outWidth = Math.round(maxWidth * scale);
          const outHeight = Math.round(maxHeight * scale);
          
          // Source points
          const srcPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
            orderedCorners[0].x, orderedCorners[0].y,
            orderedCorners[1].x, orderedCorners[1].y,
            orderedCorners[2].x, orderedCorners[2].y,
            orderedCorners[3].x, orderedCorners[3].y,
          ]);
          
          // Destination points
          const dstPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
            0, 0,
            outWidth, 0,
            outWidth, outHeight,
            0, outHeight,
          ]);
          
          // Get perspective transform matrix
          const M = cv.getPerspectiveTransform(srcPts, dstPts);
          
          // Apply transform
          const dst = new cv.Mat();
          cv.warpPerspective(src, dst, M, new cv.Size(outWidth, outHeight));
          
          // Convert to grayscale for document
          const gray = new cv.Mat();
          cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY);
          
          // Apply adaptive threshold for clean black/white text
          const binary = new cv.Mat();
          cv.adaptiveThreshold(
            gray, binary, 255,
            cv.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv.THRESH_BINARY,
            21, 10
          );
          
          // Convert back to color for PDF
          const result = new cv.Mat();
          cv.cvtColor(binary, result, cv.COLOR_GRAY2RGBA);
          
          // Output to canvas
          const outCanvas = document.createElement("canvas");
          outCanvas.width = outWidth;
          outCanvas.height = outHeight;
          cv.imshow(outCanvas, result);
          
          // Cleanup
          src.delete();
          dst.delete();
          gray.delete();
          binary.delete();
          result.delete();
          srcPts.delete();
          dstPts.delete();
          M.delete();
          
          // Get data URL with good quality
          resolve(outCanvas.toDataURL("image/jpeg", 0.85));
          
        } catch (error) {
          console.error("Processing error:", error);
          resolve(enhanceImage(imageSrc));
        }
      };
      img.src = imageSrc;
    });
  }, []);

  // Fallback image enhancement without OpenCV
  const enhanceImage = (imageSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 1200;
        const scale = Math.min(maxWidth / img.width, 1);
        
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Apply simple grayscale + contrast
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          // Grayscale
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          
          // High contrast threshold for text
          const threshold = gray > 140 ? 255 : 0;
          
          data[i] = threshold;
          data[i + 1] = threshold;
          data[i + 2] = threshold;
        }
        
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = imageSrc;
    });
  };

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      setScanning(true);
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (imageSrc) {
        let processedImage: string;
        
        if (documentDetected && corners.length === 4 && cvReady) {
          // Process with perspective transform
          processedImage = await processCapture(imageSrc, corners);
        } else {
          // Fallback processing
          processedImage = await enhanceImage(imageSrc);
        }
        
        const newPage: ScannedPage = {
          id: Date.now().toString(),
          originalData: imageSrc,
          processedData: processedImage,
        };

        if (scanMode === "single") {
          setPages([newPage]);
        } else {
          setPages((prev) => [...prev, newPage]);
        }
      }
      setScanning(false);
    }
  }, [scanMode, documentDetected, corners, cvReady, processCapture]);

  const deletePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  // Compress image to target size
  const compressToSize = async (imageData: string, maxSizeKB: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let quality = 0.85;
        let width = img.width;
        let height = img.height;
        let result = imageData;
        
        const compress = () => {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d")!;
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          
          result = canvas.toDataURL("image/jpeg", quality);
          const sizeKB = (result.length * 0.75) / 1024;
          
          if (sizeKB > maxSizeKB) {
            if (quality > 0.5) {
              quality -= 0.1;
              compress();
            } else if (width > 800) {
              // Reduce dimensions
              width = Math.round(width * 0.85);
              height = Math.round(height * 0.85);
              quality = 0.85;
              compress();
            } else {
              resolve(result);
            }
          } else {
            resolve(result);
          }
        };
        
        compress();
      };
      img.src = imageData;
    });
  };

  const generatePdf = async () => {
    if (pages.length === 0) return;

    setGenerating(true);

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Target ~250KB per page to stay under 300KB total for single page
      const targetSizePerPage = 250;

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        // Compress to target size
        const imgData = await compressToSize(pages[i].processedData, targetSizePerPage);

        const img = new Image();
        img.src = imgData;

        await new Promise<void>((resolve) => {
          img.onload = () => {
            const imgRatio = img.width / img.height;
            const pageRatio = pageWidth / pageHeight;

            let drawWidth = pageWidth;
            let drawHeight = pageHeight;
            let x = 0;
            let y = 0;

            if (imgRatio > pageRatio) {
              drawHeight = pageWidth / imgRatio;
              y = (pageHeight - drawHeight) / 2;
            } else {
              drawWidth = pageHeight * imgRatio;
              x = (pageWidth - drawWidth) / 2;
            }

            pdf.addImage(imgData, "JPEG", x, y, drawWidth, drawHeight);
            resolve();
          };
        });
      }

      const pdfBlob = pdf.output("blob");
      
      // Generate filename
      const nilaiClean = nilai?.replace(/\D/g, "") || Date.now().toString();
      const fileName = `SPJ_${nilaiClean}.pdf`;

      if (onPdfGenerated) {
        onPdfGenerated(pdfBlob, fileName);
      }

      setPages([]);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setGenerating(false);
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  // Calculate SVG polygon points for overlay
  const getPolygonPoints = (): string => {
    if (corners.length !== 4) return "";
    
    const video = webcamRef.current?.video;
    if (!video) return "";
    
    const scaleX = video.clientWidth / video.videoWidth;
    const scaleY = video.clientHeight / video.videoHeight;
    
    return corners
      .map((c) => `${c.x * scaleX},${c.y * scaleY}`)
      .join(" ");
  };

  return (
    <div className="scanner-modal-dark">
      {/* Header */}
      <div className="scanner-header-dark">
        <button onClick={onClose} className="scanner-close-btn">
          ✕
        </button>
        <span className="scanner-title">Document Scanner</span>
        <span className={`scanner-auto-badge ${documentDetected ? "active" : ""}`}>
          {cvLoading ? "⏳" : documentDetected ? "✓ AUTO" : "AUTO"}
        </span>
      </div>

      {/* Camera Error */}
      {cameraError && (
        <div className="scanner-error">
          <span>❌</span>
          <span>{cameraError}</span>
        </div>
      )}

      {/* OpenCV Loading */}
      {cvLoading && (
        <div className="scanner-loading">
          <span>Memuat scanner...</span>
        </div>
      )}

      {/* Camera View */}
      <div className="scanner-camera-container">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.95}
          videoConstraints={videoConstraints}
          onUserMediaError={handleUserMediaError}
          className="scanner-video-dark"
        />
        
        {/* Hidden canvas for detection */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <canvas ref={processingCanvasRef} style={{ display: "none" }} />
        
        {/* Document detection polygon overlay */}
        {documentDetected && corners.length === 4 && (
          <svg className="scanner-polygon-overlay">
            <polygon
              points={getPolygonPoints()}
              fill="rgba(37, 99, 235, 0.2)"
              stroke="#2563eb"
              strokeWidth="3"
            />
            {corners.map((corner, i) => {
              const video = webcamRef.current?.video;
              if (!video) return null;
              const scaleX = video.clientWidth / video.videoWidth;
              const scaleY = video.clientHeight / video.videoHeight;
              return (
                <circle
                  key={i}
                  cx={corner.x * scaleX}
                  cy={corner.y * scaleY}
                  r="8"
                  fill="#2563eb"
                />
              );
            })}
          </svg>
        )}
      </div>

      {/* Guidance text */}
      <div className="scanner-guidance">
        {cvLoading 
          ? "⏳ Memuat OpenCV..."
          : documentDetected 
            ? "📄 Dokumen terdeteksi! Tekan tombol untuk capture."
            : "Arahkan kamera ke dokumen"}
      </div>

      {/* Bottom Controls */}
      <div className="scanner-controls-dark">
        {/* Mode toggle */}
        <button
          type="button"
          className={`scanner-mode-btn ${scanMode === "single" ? "active" : ""}`}
          onClick={() => setScanMode("single")}
        >
          <span>📄</span>
          <span>Single</span>
        </button>

        {/* Capture button */}
        <button
          type="button"
          onClick={capture}
          className="scanner-capture-btn"
          disabled={scanning || cvLoading}
        >
          <div className="capture-btn-inner">
            {scanning ? "⏳" : ""}
          </div>
        </button>

        {/* Multi mode */}
        <button
          type="button"
          className={`scanner-mode-btn ${scanMode === "multi" ? "active" : ""}`}
          onClick={() => setScanMode("multi")}
        >
          <span>📚</span>
          <span>Multi</span>
        </button>
      </div>

      {/* Scanned pages preview */}
      {pages.length > 0 && (
        <div className="scanner-pages-preview">
          <div className="pages-header">
            <span>Scanned ({pages.length})</span>
            <button
              type="button"
              onClick={generatePdf}
              className="scanner-generate-btn"
              disabled={generating}
            >
              {generating ? "⏳ Generating..." : "✓ Generate PDF"}
            </button>
          </div>
          <div className="pages-grid">
            {pages.map((page, index) => (
              <div key={page.id} className="page-thumb">
                <img src={page.processedData} alt={`Page ${index + 1}`} />
                <span className="page-num">{index + 1}</span>
                <button
                  type="button"
                  onClick={() => deletePage(page.id)}
                  className="page-delete"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flip camera button */}
      <button
        type="button"
        onClick={toggleCamera}
        className="scanner-flip-btn"
      >
        🔄
      </button>
    </div>
  );
}
