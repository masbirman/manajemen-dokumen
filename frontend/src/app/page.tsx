"use client";

import { useState, useEffect } from "react";
import DocumentForm from "@/components/DocumentForm";
import DataTable from "@/components/DataTable";
import LoginForm from "@/components/LoginForm";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface User {
  id: number;
  name: string;
  username: string;
  avatar_url: string | null;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"form" | "table">("form");
  const [refreshKey, setRefreshKey] = useState(0);
  const [petunjuk, setPetunjuk] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleFormSuccess = () => {
    setRefreshKey((k) => k + 1);
  };

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // Load petunjuk from API
  useEffect(() => {
    const loadPetunjuk = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/petunjuk`);
        const data = await response.json();
        setPetunjuk(data.content || "");
      } catch (error) {
        console.error("Failed to load petunjuk:", error);
      }
    };
    loadPetunjuk();
  }, []);

  const handleLoginSuccess = (loggedInUser: User, token: string) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Memuat...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return (
      <div className="app">
        <header className="header">
          <div className="container">
            <div className="header-content">
              <h1>📄 Document Scanner - Portal Data</h1>
            </div>
          </div>
        </header>

        <main className="container">
          <div className="card" style={{ marginTop: "2rem" }}>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </div>
        </main>

        <footer className="footer">
          <div className="container">
            <p>&copy; 2025 Document Scanner - Portal Data</p>
          </div>
        </footer>
      </div>
    );
  }

  // Main app after login
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1>📄 Document Scanner - Portal Data</h1>
            <div className="user-info">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="user-avatar" />
              ) : (
                <span className="user-avatar-placeholder">👤</span>
              )}
              <span className="user-name">{user.name}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "form" ? "active" : ""}`}
            onClick={() => setActiveTab("form")}
          >
            <span>📝</span>
            Input Data
          </button>
          <button
            className={`tab ${activeTab === "table" ? "active" : ""}`}
            onClick={() => setActiveTab("table")}
          >
            <span>📊</span>
            Daftar Data
          </button>
        </div>

        {/* Content */}
        <div className="card">
          {activeTab === "form" ? (
            <>
              <div className="card-header">
                <span>📝</span>
                <h2 className="card-title">Form Input Data Dokumen</h2>
              </div>
              <DocumentForm onSuccess={handleFormSuccess} />
            </>
          ) : (
            <>
              <div className="card-header">
                <span>📊</span>
                <h2 className="card-title">Daftar Data Dokumen</h2>
              </div>
              <DataTable key={refreshKey} />
            </>
          )}
        </div>

        {/* Petunjuk Card - Only on Input Data tab */}
        {activeTab === "form" && (
          <div className="card info-card" style={{ marginTop: "1.5rem" }}>
            <div className="card-header">
              <span>ℹ️</span>
              <h3 className="card-title">Petunjuk</h3>
            </div>
            <div 
              className="petunjuk-content"
              dangerouslySetInnerHTML={{ __html: petunjuk }}
            />
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Document Scanner - Portal Data</p>
        </div>
      </footer>
    </div>
  );
}
