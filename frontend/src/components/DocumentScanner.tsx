"use client";

import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { jsPDF } from "jspdf";

interface ScannedPage {
  id: string;
  imageData: string;
}

interface DocumentScannerProps {
  onPdfGenerated?: (pdfBlob: Blob) => void;
  onClose?: () => void;
}

export default function DocumentScanner({
  onPdfGenerated,
  onClose,
}: DocumentScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [scanning, setScanning] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [scanMode, setScanMode] = useState<"single" | "multi">("single");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );

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

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const newPage: ScannedPage = {
          id: Date.now().toString(),
          imageData: imageSrc,
        };

        if (scanMode === "single") {
          setPages([newPage]);
        } else {
          setPages((prev) => [...prev, newPage]);
        }
      }
    }
  }, [scanMode]);

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

        const img = new Image();
        img.src = pages[i].imageData;

        await new Promise<void>((resolve) => {
          img.onload = () => {
            const imgRatio = img.width / img.height;
            const pageRatio = pageWidth / pageHeight;

            let drawWidth = pageWidth;
            let drawHeight = pageHeight;
            let x = 0;
            let y = 0;

            if (imgRatio > pageRatio) {
              // Image is wider
              drawHeight = pageWidth / imgRatio;
              y = (pageHeight - drawHeight) / 2;
            } else {
              // Image is taller
              drawWidth = pageHeight * imgRatio;
              x = (pageWidth - drawWidth) / 2;
            }

            pdf.addImage(
              pages[i].imageData,
              "JPEG",
              x,
              y,
              drawWidth,
              drawHeight
            );
            resolve();
          };
        });
      }

      const pdfBlob = pdf.output("blob");

      if (onPdfGenerated) {
        onPdfGenerated(pdfBlob);
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

  return (
    <div className="scanner-modal">
      <div className="scanner-header">
        <h3>📷 Document Scanner</h3>
        <button onClick={onClose} className="btn-close">
          ✕
        </button>
      </div>

      {/* Camera Error */}
      {cameraError && (
        <div className="alert alert-danger">
          <span>❌</span>
          <span>{cameraError}</span>
        </div>
      )}

      {/* Mode Toggle */}
      <div className="scan-mode-toggle">
        <button
          type="button"
          className={`mode-btn ${scanMode === "single" ? "active" : ""}`}
          onClick={() => setScanMode("single")}
        >
          📄 Single Page
        </button>
        <button
          type="button"
          className={`mode-btn ${scanMode === "multi" ? "active" : ""}`}
          onClick={() => setScanMode("multi")}
        >
          📚 Multi Page
        </button>
      </div>

      {/* Camera View */}
      <div className="scanner-container">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.9}
          videoConstraints={videoConstraints}
          onUserMediaError={handleUserMediaError}
          className="scanner-video"
        />
        <div className="scanner-overlay">
          <div className="scanner-frame"></div>
        </div>
      </div>

      {/* Camera Controls */}
      <div className="scanner-controls">
        <button
          type="button"
          onClick={toggleCamera}
          className="btn btn-secondary"
        >
          🔄 Flip
        </button>
        <button
          type="button"
          onClick={capture}
          className="btn btn-primary capture-btn"
          disabled={scanning}
        >
          📸 Capture
        </button>
        {pages.length > 0 && (
          <button
            type="button"
            onClick={generatePdf}
            className="btn btn-success"
            disabled={generating}
          >
            {generating ? "⏳" : "📄"} PDF ({pages.length})
          </button>
        )}
      </div>

      {/* Preview Pages */}
      {pages.length > 0 && (
        <div className="scanned-pages">
          <h4>Scanned Pages ({pages.length})</h4>
          <div className="page-grid">
            {pages.map((page, index) => (
              <div key={page.id} className="page-thumbnail">
                <span className="page-number">{index + 1}</span>
                <img src={page.imageData} alt={`Page ${index + 1}`} />
                <button
                  type="button"
                  onClick={() => deletePage(page.id)}
                  className="delete-page"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
