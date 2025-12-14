"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import api from "../lib/api";

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

interface UserWithRoles {
  id: number;
  name: string;
  username: string;
  roles: string[];
  unit?: { id: number; name: string } | null;
  pptk?: { id: number; name: string } | null;
}

interface DocumentRecord {
  id: number;
  unit: { id: number; name: string } | null;
  type: { id: number; name: string } | null;
  pptk: { id: number; name: string } | null;
  creator: { id: number; name: string; username: string } | null;
  created_by?: number;
  nilai: number;
  uraian: string | null;
  pdf_path: string | null;
  pdf_url: string | null;
  created_at: string;
}

interface DocumentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  user?: UserWithRoles | null;
  initialData?: DocumentRecord | null;
}

export default function DocumentForm({ onSuccess, onCancel, user, initialData }: DocumentFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if user is operator (only Operator role, not Admin or Super Admin)
  const isOperator = user?.roles?.includes('Operator') && 
    !user?.roles?.includes('Admin') && 
    !user?.roles?.includes('Super Admin');

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

  // Populate form when initialData changes (Edit Mode)
  useEffect(() => {
    if (initialData) {
      if (initialData.unit) setUnitId(initialData.unit.id);
      if (initialData.type) setTypeId(initialData.type.id);
      if (initialData.pptk) setPptkId(initialData.pptk.id);
      setNilai(initialData.nilai.toString());
      setUraian(initialData.uraian || "");
      if (initialData.pdf_url) {
        // We can't set blob for existing file, but we can show name
        const filename = initialData.pdf_url.split('/').pop() || "Existing Document.pdf";
        setPdfName(filename);
        // Note: pdfBlob remains null unless user uploads a NEW file
      } else {
        setPdfName(null);
      }
    } else {
      // Reset form if initialData is cleared
      if (isOperator && user?.unit?.id) {
         setUnitId(user.unit.id);
      } else {
         setUnitId("");
      }
      
      if (isOperator && user?.pptk?.id) {
         setPptkId(user.pptk.id);
      } else {
         setPptkId("");
      }

      setTypeId("");
      setNilai("");
      setUraian("");
      setPdfBlob(null);
      setPdfName(null);
    }
  }, [initialData, isOperator, user]);

  // Auto-set Unit and PPTK for operator (Only if NOT editing or if creating new)
  useEffect(() => {
    // Only auto-set if creating new (no initialData)
    if (!initialData) {
      if (isOperator && user?.unit?.id) {
        setUnitId(user.unit.id);
      }
      if (isOperator && user?.pptk?.id) {
        setPptkId(user.pptk.id);
      }
    }
  }, [isOperator, user, initialData]);

  // Filter PPTK by selected Unit (cascade dropdown)
  const filteredPptks = useCallback(() => {
    if (!unitId) return [];
    return pptks.filter((p: Pptk) => p.unit_id === unitId);
  }, [unitId, pptks]);

  // Reset PPTK when Unit changes (only if not operator AND not setting initial data)
  useEffect(() => {
    if (!isOperator && unitId !== "") {
      // If we are editing, we don't want to reset PPTK immediately when unit is set via initialData
      // But if user manually changes unit, we should reset.
      // Simple logic: if current pptk's unit doesn't match selected unit, reset.
      // However, we track this by dependency. 
      // To simplify: if editing, initial load sets both. If user changes unit, this runs.
      if (initialData?.unit?.id === unitId && initialData?.pptk?.id === pptkId) {
        // Matches initial data, do nothing
      } else {
         // Check if current PPTK belongs to new unit. If not, reset.
         const currentPptk = pptks.find(p => p.id === pptkId);
         if (currentPptk && currentPptk.unit_id !== unitId) {
            setPptkId("");
         }
      }
    }
  }, [unitId, isOperator, initialData, pptks, pptkId]);

  // Format number with thousand separators
  const formatNumber = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleNilaiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setNilai(raw);
  };

  const handlePdfGenerated = (blob: Blob, fileName: string) => {
    setPdfBlob(blob);
    setPdfName(fileName);
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
      
      // Upload PDF only if it's a new blob
      if (pdfBlob && pdfName) {
        formData.append("pdf", pdfBlob, pdfName);
      }

      if (initialData) {
        // Update existing record
        await api.updateRecord(initialData.id, formData);
        setSuccess("Data berhasil diperbarui!");
      } else {
        // Create new record
        await api.createRecord(formData);
        setSuccess("Data berhasil disimpan!");
        // Reset form only on create
        if (!isOperator) setUnitId("");
        setTypeId("");
        if (!isOperator) setPptkId("");
        setNilai("");
        setUraian("");
        setPdfBlob(null);
        setPdfName(null);
      }

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
        nilai={nilai}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="document-form">
      {initialData && (
        <div className="alert alert-info" style={{marginBottom: '1rem'}}>
          <span>✏️</span>
          <span>Sedang mengedit data. <a href="#" onClick={(e) => { e.preventDefault(); if(onCancel) onCancel(); }}>Batalkan edit</a></span>
        </div>
      )}

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
        {/* Unit Dropdown / Display */}
        <div className="form-group">
          <label htmlFor="unit_id" className="form-label">
            Unit <span className="required">*</span>
          </label>
          {isOperator && user?.unit ? (
            // Operator: show unit name as readonly text
            <div className="form-input" style={{ 
              backgroundColor: '#f1f5f9', 
              cursor: 'not-allowed',
              display: 'flex',
              alignItems: 'center'
            }}>
              {user.unit.name}
            </div>
          ) : (
            // Admin/Super Admin: show dropdown
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
          )}
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

        {/* PPTK Dropdown */}
        <div className="form-group">
          <label htmlFor="pptk_id" className="form-label">
            PPTK <span className="required">*</span>
          </label>
          {isOperator && user?.pptk ? (
            // Operator with assigned PPTK: show as readonly
            <div className="form-input" style={{ 
              backgroundColor: '#f1f5f9', 
              cursor: 'not-allowed',
              display: 'flex',
              alignItems: 'center'
            }}>
              {user.pptk.name}
            </div>
          ) : (
            // Show dropdown for selection
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
          )}
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

      {/* Document Scanner/Upload */}
      <div className="form-group">
        <label className="form-label">Dokumen</label>
        
        {isMobile ? (
          // Mobile: Scanner
          <>
            {pdfBlob || (initialData && !pdfBlob && pdfName) ? (
              <div className="scanned-result">
                <div className="scanned-success">
                  <span>✅</span>
                  <span>{pdfBlob ? `Dokumen telah di-scan: ${pdfName}` : `Dokumen saat ini: ${pdfName}`}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPdfBlob(null);
                    setPdfName(null);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  {pdfBlob || pdfName ? '🗑️ Hapus / Ganti' : ''}
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
          // Desktop: PDF Upload AND Scanner notice
          <>
            {pdfBlob || (initialData && !pdfBlob && pdfName) ? (
              <div className="scanned-result">
                <div className="scanned-success">
                  <span>✅</span>
                  <span>{pdfBlob ? `Dokumen terupload: ${pdfName}` : `Dokumen saat ini: ${pdfName}`}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPdfBlob(null);
                    setPdfName(null);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  🗑️ Ganti
                </button>
              </div>
            ) : (
              <div className="desktop-doc-options">
                {/* Upload PDF Option */}
                <div className="upload-area">
                  <input
                    type="file"
                    id="pdf-upload"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Check file size (max 300KB)
                        const maxSize = 300 * 1024; // 300KB in bytes
                        if (file.size > maxSize) {
                          setError(`Ukuran file terlalu besar. Maksimal 300KB, file Anda: ${(file.size / 1024).toFixed(1)}KB`);
                          e.target.value = '';
                          return;
                        }
                        
                        // Check file type
                        if (file.type !== 'application/pdf') {
                          setError('Hanya file PDF yang diperbolehkan');
                          e.target.value = '';
                          return;
                        }

                        // Clear any previous error
                        setError(null);
                        
                        // Read file as blob
                        const reader = new FileReader();
                        reader.onload = () => {
                          const blob = new Blob([reader.result as ArrayBuffer], { type: 'application/pdf' });
                          setPdfBlob(blob);
                          setPdfName(file.name);
                        };
                        reader.readAsArrayBuffer(file);
                      }
                    }}
                    className="upload-input"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="pdf-upload" className="upload-label">
                    <div className="upload-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <path d="M10 12l-2 4h4l-2 4"/>
                        <text x="7" y="18" fontSize="6" fill="#dc2626" stroke="none" fontWeight="bold">PDF</text>
                      </svg>
                    </div>
                    <div className="upload-text">
                      <span className="upload-title">Upload Dokumen PDF</span>
                      <span className="upload-hint">Klik untuk memilih file (Maks. 300KB)</span>
                    </div>
                  </label>
                </div>

                {/* Scanner Notice for Desktop */}
                <div className="desktop-notice">
                  <span>📱</span>
                  <span>Fitur scan dokumen hanya tersedia di perangkat mobile. Buka halaman ini di HP untuk scan dokumen.</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Submit Button */}
      <div className="form-actions">
        {initialData && onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={submitting}
            style={{marginRight: '1rem'}}
          >
            Batal
          </button>
        )}
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
              {initialData ? "Update Data" : "Simpan Data"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
