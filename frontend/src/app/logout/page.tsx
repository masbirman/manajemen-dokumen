"use client";

import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    // Clear all auth data from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    window.location.href = '/';
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem',
      backgroundColor: '#f5f5f4'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #e7e5e4',
        borderTopColor: '#10b981',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ color: '#78716c' }}>Logging out...</p>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
