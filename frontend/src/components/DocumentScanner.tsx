"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { jsPDF } from "jspdf";

interface ScannedPage {
  id: string;
  imageData: string;
  processedData?: string;
}

interface DocumentScannerProps {
  onPdfGenerated?: (pdfBlob: Blob, fileName: string) => void;
  onClose?: () => void;
  nilai?: string; // For PDF naming
}

// Canvas-based image processing utilities
const processImage = async (
  imageData: string,
  cropArea?: { x: number; y: number; width: number; height: number }
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Determine crop dimensions or use full image
      const srcX = cropArea?.x ?? 0;
      const srcY = cropArea?.y ?? 0;
      const srcWidth = cropArea?.width ?? img.width;
      const srcHeight = cropArea?.height ?? img.height;
      
      // Use A4 aspect ratio for output (210:297)
      const a4Ratio = 210 / 297;
      let destWidth = srcWidth;
      let destHeight = srcHeight;
      
      // Adjust to maintain reasonable size (max 1200px width)
      if (destWidth > 1200) {
        destWidth = 1200;
        destHeight = destWidth / (srcWidth / srcHeight);
      }
      
      const canvas = document.createElement("canvas");
      canvas.width = destWidth;
      canvas.height = destHeight;
      const ctx = canvas.getContext("2d")!;

      // Draw cropped region
      ctx.drawImage(
        img, 
        srcX, srcY, srcWidth, srcHeight,  // Source rectangle
        0, 0, destWidth, destHeight       // Destination rectangle
      );

      // Get image data for processing
      const canvasData = ctx.getImageData(0, 0, destWidth, destHeight);
      const data = canvasData.data;

      // Process each pixel: Grayscale + Contrast enhancement
      for (let i = 0; i < data.length; i += 4) {
        // Convert to grayscale
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        
        // Apply contrast enhancement (factor 1.4 for document clarity)
        const factor = 1.4;
        const enhanced = Math.min(255, Math.max(0, factor * (gray - 128) + 128));
        
        data[i] = enhanced;     // R
        data[i + 1] = enhanced; // G
        data[i + 2] = enhanced; // B
        // Alpha stays the same
      }

      // Put processed data back
      ctx.putImageData(canvasData, 0, 0);

      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = imageData;
  });
};

// Compress image to target size
const compressImage = async (
  imageData: string,
  maxSizeKB: number
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let quality = 0.8;
      let result = imageData;
      
      const compress = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        
        // If quality is too low, start reducing dimensions
        if (quality < 0.4) {
          const scale = 0.8;
          width = Math.floor(width * scale);
          height = Math.floor(height * scale);
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        
        result = canvas.toDataURL("image/jpeg", quality);
        
        // Check size (base64 is ~37% larger than binary)
        const sizeKB = (result.length * 0.75) / 1024;
        
        if (sizeKB > maxSizeKB && quality > 0.3) {
          quality -= 0.1;
          compress();
        } else {
          resolve(result);
        }
      };
      
      compress();
    };
    img.src = imageData;
  });
};

export default function DocumentScanner({
  onPdfGenerated,
  onClose,
  nilai,
}: DocumentScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [scanning, setScanning] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [scanMode, setScanMode] = useState<"single" | "multi">("single");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [documentDetected, setDocumentDetected] = useState(false);
  const [corners, setCorners] = useState<{ x: number; y: number }[]>([]);
  const animationRef = useRef<number>();

  const videoConstraints = {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    facingMode: facingMode,
  };

  const handleUserMediaError = useCallback((error: string | DOMException) => {
    console.error("Camera error:", error);
    if (typeof error === "string") {
      setCameraError(error);
    } else {
      setCameraError(error.message || "Tidak dapat mengakses kamera");
    }
  }, []);

  // Improved edge detection using contour-based approach
  const detectDocumentEdges = useCallback(() => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || video.readyState !== 4) {
      animationRef.current = requestAnimationFrame(detectDocumentEdges);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match video (scaled down for performance)
    const scale = 0.25; // Process at 1/4 resolution
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;

    // Draw current frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    // Convert to grayscale and apply Gaussian blur (simplified)
    const gray: number[] = [];
    for (let i = 0; i < data.length; i += 4) {
      gray.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    }

    // Simple edge detection using Sobel-like gradient
    const edges: number[] = new Array(gray.length).fill(0);
    const threshold = 30; // Edge threshold

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        
        // Calculate gradient (simplified Sobel)
        const gx = Math.abs(gray[idx + 1] - gray[idx - 1]);
        const gy = Math.abs(gray[idx + width] - gray[idx - width]);
        const gradient = Math.sqrt(gx * gx + gy * gy);
        
        if (gradient > threshold) {
          edges[idx] = 255;
        }
      }
    }

    // Find bounding box of edges (indicating document edges)
    let minX = width, minY = height, maxX = 0, maxY = 0;
    let edgeCount = 0;

    // Focus on center region where document is likely to be
    const marginX = Math.floor(width * 0.05);
    const marginY = Math.floor(height * 0.05);

    for (let y = marginY; y < height - marginY; y++) {
      for (let x = marginX; x < width - marginX; x++) {
        const idx = y * width + x;
        if (edges[idx] > 0) {
          edgeCount++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    // Scale back to video dimensions
    const scaleBack = 1 / scale;
    minX = Math.floor(minX * scaleBack);
    maxX = Math.floor(maxX * scaleBack);
    minY = Math.floor(minY * scaleBack);
    maxY = Math.floor(maxY * scaleBack);

    // Check if we have a reasonable document-sized area
    const docWidth = maxX - minX;
    const docHeight = maxY - minY;
    const aspectRatio = docWidth / docHeight;
    
    // A4-ish aspect ratio is around 0.707 (210/297), allow some tolerance
    const validAspect = aspectRatio > 0.5 && aspectRatio < 1.5;
    
    // Document should have significant edge count and reasonable size
    const minDocSize = Math.min(video.videoWidth, video.videoHeight) * 0.2;
    const validSize = docWidth > minDocSize && docHeight > minDocSize;
    
    // Need enough edges to form a rectangle
    const hasEnoughEdges = edgeCount > 100;

    if (validSize && validAspect && hasEnoughEdges) {
      setDocumentDetected(true);
      // Add some padding
      const padX = docWidth * 0.02;
      const padY = docHeight * 0.02;
      setCorners([
        { x: Math.max(0, minX - padX), y: Math.max(0, minY - padY) },
        { x: Math.min(video.videoWidth, maxX + padX), y: Math.max(0, minY - padY) },
        { x: Math.min(video.videoWidth, maxX + padX), y: Math.min(video.videoHeight, maxY + padY) },
        { x: Math.max(0, minX - padX), y: Math.min(video.videoHeight, maxY + padY) },
      ]);
    } else {
      setDocumentDetected(false);
      setCorners([]);
    }

    animationRef.current = requestAnimationFrame(detectDocumentEdges);
  }, []);

  // Start edge detection when camera is ready
  useEffect(() => {
    animationRef.current = requestAnimationFrame(detectDocumentEdges);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [detectDocumentEdges]);

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      setScanning(true);
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (imageSrc) {
        let processedImage: string;
        
        // Get video dimensions for coordinate scaling
        const video = webcamRef.current.video;
        
        // If document detected with corners, crop to document
        if (documentDetected && corners.length === 4 && video) {
          // Calculate crop area from corners
          // Corners are in video coordinates, screenshot is at video resolution
          const minX = Math.min(corners[0].x, corners[3].x);
          const maxX = Math.max(corners[1].x, corners[2].x);
          const minY = Math.min(corners[0].y, corners[1].y);
          const maxY = Math.max(corners[2].y, corners[3].y);
          
          const cropArea = {
            x: Math.max(0, minX),
            y: Math.max(0, minY),
            width: maxX - minX,
            height: maxY - minY,
          };
          
          // Process with crop
          processedImage = await processImage(imageSrc, cropArea);
        } else {
          // No detection - process full image
          processedImage = await processImage(imageSrc);
        }
        
        const newPage: ScannedPage = {
          id: Date.now().toString(),
          imageData: imageSrc,
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
  }, [scanMode, documentDetected, corners]);

  const deletePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
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

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        // Use processed (grayscale + enhanced) image
        let imgData = pages[i].processedData || pages[i].imageData;
        
        // Compress if needed
        imgData = await compressImage(imgData, 250); // Target 250KB per page to ensure PDF stays under 300KB

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
      
      // Generate filename from nilai
      const nilaiClean = nilai?.replace(/\D/g, "") || Date.now().toString();
      const fileName = `SPJ_${nilaiClean}.pdf`;

      if (onPdfGenerated) {
        onPdfGenerated(pdfBlob, fileName);
      }

      // Reset pages after generating
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

  // Calculate overlay dimensions
  const getOverlayStyle = () => {
    if (corners.length !== 4) return {};
    
    const video = webcamRef.current?.video;
    if (!video) return {};
    
    const scaleX = video.clientWidth / video.videoWidth;
    const scaleY = video.clientHeight / video.videoHeight;
    
    return {
      left: corners[0].x * scaleX,
      top: corners[0].y * scaleY,
      width: (corners[1].x - corners[0].x) * scaleX,
      height: (corners[3].y - corners[0].y) * scaleY,
    };
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
          {documentDetected ? "✓ AUTO" : "AUTO"}
        </span>
      </div>

      {/* Camera Error */}
      {cameraError && (
        <div className="scanner-error">
          <span>❌</span>
          <span>{cameraError}</span>
        </div>
      )}

      {/* Camera View */}
      <div className="scanner-camera-container">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.92}
          videoConstraints={videoConstraints}
          onUserMediaError={handleUserMediaError}
          className="scanner-video-dark"
        />
        
        {/* Hidden canvas for edge detection */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
        
        {/* Document detection overlay */}
        {documentDetected && corners.length === 4 && (
          <div 
            className="scanner-detection-overlay"
            style={getOverlayStyle()}
          />
        )}
        
        {/* Corner indicators */}
        {documentDetected && (
          <div className="scanner-corners">
            <div className="corner corner-tl" />
            <div className="corner corner-tr" />
            <div className="corner corner-bl" />
            <div className="corner corner-br" />
          </div>
        )}
      </div>

      {/* Guidance text */}
      <div className="scanner-guidance">
        {documentDetected 
          ? "📄 Dokumen terdeteksi. Tekan tombol untuk capture."
          : "Arahkan kamera ke dokumen kertas putih"}
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
          disabled={scanning}
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
                <img src={page.processedData || page.imageData} alt={`Page ${index + 1}`} />
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
