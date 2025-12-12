"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

interface Record {
  id: number;
  unit: { id: number; name: string } | null;
  type: { id: number; name: string } | null;
  pptk: { id: number; name: string } | null;
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

export default function DataTable() {
  const [records, setRecords] = useState<Record[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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
    <div className="data-table-container">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Unit</th>
              <th>Jenis</th>
              <th>PPTK</th>
              <th>Nilai</th>
              <th>Uraian</th>
              <th>PDF</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-state">
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
                      <a
                        href={record.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-icon"
                        title="Download PDF"
                      >
                        📥
                      </a>
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
  );
}
