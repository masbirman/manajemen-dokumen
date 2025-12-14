"use client";

import { useState, useEffect } from "react";
import api from "../lib/api";

export interface Record {
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

interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface User {
  id: number;
  name: string;
  username: string;
  roles?: string[];
}

interface DataTableProps {
  user: User | null;
  onEdit?: (record: Record) => void;
}

export default function DataTable({ user, onEdit }: DataTableProps) {

  const [records, setRecords] = useState<Record[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadRecords = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await api.getRecords({ page, per_page: 10 });
      setRecords(response.data);
      setMeta(response.meta);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords(currentPage);
  }, [currentPage]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openPreview = (url: string) => {
    setPreviewUrl(url);
  };

  const closePreview = () => {
    setPreviewUrl(null);
  };

  const isOwner = (record: Record): boolean => {
    if (!user) return false;
    // Check by creator.id or created_by
    return record.creator?.id === user.id || record.created_by === user.id;
  };

  const handleDeleteClick = (recordId: number) => {
    setDeleteConfirm(recordId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    
    setDeleting(true);
    try {
      await api.deleteRecord(deleteConfirm);
      setDeleteConfirm(null);
      // Reload records
      loadRecords(currentPage);
    } catch (err: any) {
      setError(err.message || "Gagal menghapus data");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  if (loading && records.length === 0) {
    return (
      <div className="card">
        <div className="loading-spinner"></div>
        <p style={{ textAlign: "center", color: "var(--gray-600)" }}>
          Memuat data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <span>❌</span>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <>
      <div className="data-table-container full-width">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Operator</th>
                <th>Unit</th>
                <th>Jenis</th>
                <th>PPTK</th>
                <th>Nilai</th>
                <th>Uraian</th>
                <th>PDF</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={10} className="empty-state">
                    <span className="empty-icon">📋</span>
                    <p>Belum ada data</p>
                  </td>
                </tr>
              ) : (
                records.map((record, index) => (
                  <tr key={record.id}>
                    <td className="cell-number">
                      {((meta?.current_page || 1) - 1) * (meta?.per_page || 10) +
                        index +
                        1}
                    </td>
                    <td className="cell-date">{formatDate(record.created_at)}</td>
                    <td className="cell-operator">
                      {record.creator?.name || record.creator?.username || "-"}
                    </td>
                    <td>{record.unit?.name || "-"}</td>
                    <td>{record.type?.name || "-"}</td>
                    <td>{record.pptk?.name || "-"}</td>
                    <td className="cell-currency">
                      {formatCurrency(record.nilai)}
                    </td>
                    <td className="cell-uraian">
                      {record.uraian
                        ? record.uraian.length > 50
                          ? record.uraian.substring(0, 50) + "..."
                          : record.uraian
                        : "-"}
                    </td>
                    <td className="cell-action">
                      {record.pdf_url ? (
                        <div className="action-buttons">
                          <button
                            onClick={() => openPreview(record.pdf_url!)}
                            className="btn-icon btn-preview"
                            title="Preview PDF"
                          >
                            👁️
                          </button>
                          <a
                            href={record.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-icon btn-download"
                            title="Download PDF"
                          >
                            📥
                          </a>
                        </div>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td className="cell-action">
                      {isOwner(record) ? (
                        <div className="action-buttons">
                          <button
                            onClick={() => onEdit?.(record)}
                            className="btn-icon btn-edit"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteClick(record.id)}
                            className="btn-icon btn-delete"
                            title="Hapus"
                          >
                            🗑️
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={meta.current_page === 1}
              className="pagination-btn"
            >
              ← Sebelumnya
            </button>

            <div className="pagination-info">
              Halaman {meta.current_page} dari {meta.last_page} ({meta.total}{" "}
              data)
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(meta.last_page, p + 1))}
              disabled={meta.current_page === meta.last_page}
              className="pagination-btn"
            >
              Selanjutnya →
            </button>
          </div>
        )}
      </div>

      {/* PDF Preview Modal */}
      {previewUrl && (
        <div className="modal-overlay" onClick={closePreview}>
          <div className="modal-content pdf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Preview Dokumen</h3>
              <button className="btn-close" onClick={closePreview}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <iframe
                src={previewUrl}
                className="pdf-iframe"
                title="PDF Preview"
              />
            </div>
            <div className="modal-footer">
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                📥 Download
              </a>
              <button className="btn btn-secondary" onClick={closePreview}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header modal-header-danger">
              <h3>Konfirmasi Hapus</h3>
              <button className="btn-close" onClick={handleDeleteCancel}>
                ✕
              </button>
            </div>
            <div className="modal-body confirm-body">
              <p>Apakah Anda yakin ingin menghapus data ini?</p>
              <p className="text-muted">Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-danger" 
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? "Menghapus..." : "🗑️ Hapus"}
              </button>
              <button className="btn btn-secondary" onClick={handleDeleteCancel}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
