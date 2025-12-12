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
      try {
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
      } catch (e) {
        console.error("Auth check failed", e);
      } finally {
        setIsLoading(false);
      }
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
        <div className="loading-screen" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh', 
          flexDirection: 'column', 
          gap: '1rem' 
        }}>
          <div className="loading-spinner" style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ fontFamily: 'sans-serif', color: '#666' }}>Memuat...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div className="login-card-container" style={{
          display: 'flex',
          width: '100%',
          maxWidth: '850px',
          height: '480px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden' // Ensure overflow hidden for border radius
        }}>
          {/* Left Side - Illustration */}
          <div className="login-image-section" style={{
            width: '450px',
            backgroundColor: '#f8fafc',
            position: 'relative',
            height: '100%',
            display: 'flex'
          }}>
            <img 
              src="/login.webp" 
              alt="Document Scanner Illustration" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
          </div>

          {/* Right Side - Login Form */}
          <div className="login-form-section" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '2.5rem',
            backgroundColor: '#ffffff',
            height: '100%'
          }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#0f172a',
                marginBottom: '0.5rem'
              }}>
                Login
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                Masuk untuk mengakses data
              </p>
            </div>

            <LoginForm onLoginSuccess={handleLoginSuccess} />
            
            <p style={{
              marginTop: 'auto',
              paddingTop: '1.5rem',
              textAlign: 'center',
              color: '#cbd5e1',
              fontSize: '0.75rem'
            }}>&copy; 2025 Portal Data - Disdik Sulteng</p>
          </div>
        </div>
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
