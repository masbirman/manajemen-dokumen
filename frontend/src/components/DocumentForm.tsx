"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import api from "@/lib/api";

// Dynamically import scanner to avoid SSR issues with webcam
const DocumentScanner = dynamic(() => import("./DocumentScanner"), {
  ssr: false,
});

interface Unit {
  id: number;
  name: string;
  code: string | null;
}

interface Type {
  id: number;
  name: string;
  code: string | null;
}

interface Pptk {
  id: number;
  name: string;
  nip: string | null;
  unit_id?: number;
}

interface DocumentFormProps {
  onSuccess?: () => void;
}

export default function DocumentForm({ onSuccess }: DocumentFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Options
  const [units, setUnits] = useState<Unit[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [pptks, setPptks] = useState<Pptk[]>([]);

  // Form values
  const [unitId, setUnitId] = useState<number | "">("");
  const [typeId, setTypeId] = useState<number | "">("");
  const [pptkId, setPptkId] = useState<number | "">("");
  const [nilai, setNilai] = useState("");
  const [uraian, setUraian] = useState("");
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load dropdown options
  useEffect(() => {
    const loadOptions = async () => {
      setLoading(true);
      try {
        const options = await api.getOptions();
        setUnits(options.units);
        setTypes(options.types);
        setPptks(options.pptks);
      } catch (err: any) {
        setError("Gagal memuat data dropdown: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    loadOptions();
  }, []);

  // Filter PPTK by selected Unit (cascade dropdown)
  const filteredPptks = useCallback(() => {
    if (!unitId) return [];
    return pptks.filter((p: Pptk) => p.unit_id === unitId);
  }, [unitId, pptks]);

  // Reset PPTK when Unit changes
  useEffect(() => {
    setPptkId("");
  }, [unitId]);

  // Format number with thousand separators
  const formatNumber = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleNilaiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setNilai(raw);
  };

  const handlePdfGenerated = (blob: Blob) => {
    setPdfBlob(blob);
    setPdfName(`scan_${Date.now()}.pdf`);
    setShowScanner(false);
    setSuccess("Dokumen berhasil di-scan!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!unitId || !typeId || !pptkId || !nilai) {
      setError("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("unit_id", unitId.toString());
      formData.append("type_id", typeId.toString());
      formData.append("pptk_id", pptkId.toString());
      formData.append("nilai", nilai);
      if (uraian) formData.append("uraian", uraian);
      if (pdfBlob && pdfName) {
        formData.append("pdf", pdfBlob, pdfName);
      }

      await api.createRecord(formData);

      setSuccess("Data berhasil disimpan!");
      // Reset form
      setUnitId("");
      setTypeId("");
      setPptkId("");
      setNilai("");
      setUraian("");
      setPdfBlob(null);
      setPdfName(null);

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading-spinner"></div>
        <p style={{ textAlign: "center", color: "var(--gray-600)" }}>
          Memuat data...
        </p>
      </div>
    );
  }

  // Show scanner modal
  if (showScanner) {
    return (
      <DocumentScanner
        onPdfGenerated={handlePdfGenerated}
        onClose={() => setShowScanner(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="document-form">
      {error && (
        <div className="alert alert-danger">
          <span>❌</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span>✅</span>
          <span>{success}</span>
        </div>
      )}

      <div className="form-grid">
        {/* Unit Dropdown */}
        <div className="form-group">
          <label htmlFor="unit_id" className="form-label">
            Unit <span className="required">*</span>
          </label>
          <select
            id="unit_id"
            value={unitId}
            onChange={(e) => setUnitId(e.target.value ? Number(e.target.value) : "")}
            className="form-select"
            required
          >
            <option value="">-- Pilih Unit --</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type Dropdown */}
        <div className="form-group">
          <label htmlFor="type_id" className="form-label">
            Jenis <span className="required">*</span>
          </label>
          <select
            id="type_id"
            value={typeId}
            onChange={(e) => setTypeId(e.target.value ? Number(e.target.value) : "")}
            className="form-select"
            required
          >
            <option value="">-- Pilih Jenis --</option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* PPTK Dropdown (cascade) */}
        <div className="form-group">
          <label htmlFor="pptk_id" className="form-label">
            PPTK <span className="required">*</span>
          </label>
          <select
            id="pptk_id"
            value={pptkId}
            onChange={(e) => setPptkId(e.target.value ? Number(e.target.value) : "")}
            className="form-select"
            required
            disabled={!unitId}
          >
            <option value="">
              {unitId ? "-- Pilih PPTK --" : "-- Pilih Unit terlebih dahulu --"}
            </option>
            {filteredPptks().map((pptk) => (
              <option key={pptk.id} value={pptk.id}>
                {pptk.name} {pptk.nip ? `(${pptk.nip})` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Nilai Input */}
        <div className="form-group">
          <label htmlFor="nilai" className="form-label">
            Nilai <span className="required">*</span>
          </label>
          <div className="input-group">
            <span className="input-prefix">Rp</span>
            <input
              type="text"
              id="nilai"
              value={formatNumber(nilai)}
              onChange={handleNilaiChange}
              className="form-input"
              placeholder="0"
              required
            />
          </div>
        </div>
      </div>

      {/* Uraian Textarea */}
      <div className="form-group">
        <label htmlFor="uraian" className="form-label">
          Uraian
        </label>
        <textarea
          id="uraian"
          value={uraian}
          onChange={(e) => setUraian(e.target.value)}
          className="form-textarea"
          rows={4}
          placeholder="Masukkan uraian/keterangan..."
        />
      </div>

      {/* Document Scanner - Only on Mobile */}
      <div className="form-group">
        <label className="form-label">Dokumen</label>
        
        {isMobile ? (
          <>
            {pdfBlob ? (
              <div className="scanned-result">
                <div className="scanned-success">
                  <span>✅</span>
                  <span>Dokumen telah di-scan: {pdfName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPdfBlob(null);
                    setPdfName(null);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  🗑️ Hapus
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="scanner-trigger"
              >
                <span className="scanner-icon">📷</span>
                <span>Scan Dokumen</span>
              </button>
            )}
          </>
        ) : (
          <div className="desktop-notice">
            <span>📱</span>
            <span>Fitur scan dokumen hanya tersedia di perangkat mobile. Buka halaman ini di HP untuk scan dokumen.</span>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="spinner"></span>
              Menyimpan...
            </>
          ) : (
            <>
              <span>💾</span>
              Simpan Data
            </>
          )}
        </button>
      </div>
    </form>
  );
}
