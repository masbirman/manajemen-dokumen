"use client";

import { useState, useEffect } from "react";
import DocumentForm from "../components/DocumentForm";
import DataTable, { Record as DocumentRecord } from "../components/DataTable";
import LoginForm from "../components/LoginForm";
import RoleSelector from "../components/RoleSelector";
import { api } from "../lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Unit {
  id: number;
  name: string;
}

interface Pptk {
  id: number;
  name: string;
  unit_id: number;
}

interface User {
  id: number;
  name: string;
  username: string;
  avatar_url: string | null;
  roles: string[];
  permissions: string[];
  unit?: Unit | null;
  pptk?: Pptk | null;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"form" | "table">("form");
  const [refreshKey, setRefreshKey] = useState(0);
  const [petunjuk, setPetunjuk] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const [editingRecord, setEditingRecord] = useState<DocumentRecord | null>(null);

  const handleFormSuccess = () => {
    setRefreshKey((k) => k + 1);
    setEditingRecord(null); 
    if (editingRecord) {
      setActiveTab("table");
    }
  };
  
  const handleEdit = (record: DocumentRecord) => {
    setEditingRecord(record);
    setActiveTab("form");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
    setActiveTab("table");
  };

  // Check if user is logged in & refresh profile
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('user');
        
        if (token) {
          // If we have saved user, show it immediately for speed
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch {
              // invalid json
            }
          }

          // Then fetch fresh data in background
          try {
            const freshUser = await api.getUser();
            setUser(freshUser);
            localStorage.setItem('user', JSON.stringify(freshUser));
          } catch (err) {
            console.error("Failed to refresh user data", err);
            // If token is invalid (401), logout
            // We can check error message or status if available
            // For now, if we had a token but failed to get user, we might want to stay logged in if it's just a network error, 
            // but if it's 401 we should logout. 
            // api.getUser() throws Error(message). 
            // Let's rely on api.ts throwing "Unauthenticated." if 401 (assuming backend sends that)
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

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    // Check if user is Admin/Super Admin, show role selector
    const isAdminUser = userData.roles?.includes('Admin') || userData.roles?.includes('Super Admin');
    if (isAdminUser) {
      setShowRoleSelector(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setShowRoleSelector(false);
  };

  // Helper to check role
  const hasRole = (role: string) => user?.roles?.includes(role) ?? false;
  const isOperator = hasRole('Operator') && !hasRole('Admin') && !hasRole('Super Admin');
  const isAdmin = hasRole('Admin') || hasRole('Super Admin');

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

  // Show role selector for Admin/Super Admin
  if (user && isAdmin && showRoleSelector) {
    return (
      <RoleSelector
        userName={user.name}
        onSelectFrontend={() => setShowRoleSelector(false)}
        onSelectAdmin={() => {
          // Will be handled by RoleSelector component itself
        }}
        onLogout={handleLogout}
      />
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
        <div className="login-card-container">
          {/* Left Side - Illustration */}
          <div className="login-image-section">
            <img 
              src="/login.webp" 
              alt="Document Scanner Illustration" 
              className="login-illustration-img"
            />
          </div>

          {/* Right Side - Login Form */}
          <div className="login-form-section">
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
            <h1>📄 Manajemen Dokumen Pertanggungjawaban</h1>
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
            {editingRecord ? "Edit Data" : "Input Data"}
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
        {activeTab === "form" ? (
          // Side by side layout for Input Data tab
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            {/* Petunjuk Card - Left Side */}
            <div className="card info-card" style={{ 
              flex: '0 0 280px', 
              position: 'sticky', 
              top: '1rem',
              alignSelf: 'flex-start'
            }}>
              <div className="card-header">
                <span>ℹ️</span>
                <h3 className="card-title">Petunjuk</h3>
              </div>
              <div 
                className="petunjuk-content"
                dangerouslySetInnerHTML={{ __html: petunjuk }}
              />
            </div>

            {/* Form Card - Right Side */}
            <div className="card" style={{ flex: '1' }}>
              <div className="card-header">
                <span>📝</span>
                <h2 className="card-title">{editingRecord ? "Form Edit Data Dokumen" : "Form Input Data Dokumen"}</h2>
              </div>
              <DocumentForm 
                onSuccess={handleFormSuccess} 
                onCancel={handleCancelEdit}
                user={user} 
                initialData={editingRecord}
              />
            </div>
          </div>
        ) : (
          // Full width for Data Table tab
          <div className="card">
            <div className="card-header">
              <span>📊</span>
              <h2 className="card-title">Daftar Data Dokumen</h2>
            </div>
            <DataTable 
              user={user} 
              onEdit={handleEdit}
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
