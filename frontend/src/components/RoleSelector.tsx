"use client";

interface RoleSelectorProps {
  userName: string;
  onSelectFrontend: () => void;
  onSelectAdmin: () => void;
  onLogout: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function RoleSelector({ 
  userName, 
  onSelectFrontend, 
  onSelectAdmin,
  onLogout 
}: RoleSelectorProps) {
  
  const handleAdminClick = () => {
    // Get token and redirect to admin auto-login
    const token = localStorage.getItem('auth_token');
    if (token) {
      window.location.href = `${API_BASE_URL}/auto-login?token=${encodeURIComponent(token)}`;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#f5f5f4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '2.5rem',
        maxWidth: '450px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2rem'
          }}>
            ✓
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1c1917',
            marginBottom: '0.5rem'
          }}>
            Selamat Datang, {userName}!
          </h2>
          <p style={{
            color: '#78716c',
            fontSize: '0.875rem'
          }}>
            Anda memiliki akses sebagai Administrator. Pilih halaman yang ingin Anda buka:
          </p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {/* Frontend Button */}
          <button
            onClick={onSelectFrontend}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.25rem',
              border: '2px solid #e7e5e4',
              borderRadius: '12px',
              background: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.background = '#eff6ff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e7e5e4';
              e.currentTarget.style.background = 'white';
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: '#dbeafe',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0
            }}>
              📄
            </div>
            <div>
              <div style={{
                fontWeight: '600',
                color: '#1c1917',
                marginBottom: '0.25rem'
              }}>
                Input Dokumen
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#78716c'
              }}>
                Input dan kelola data dokumen pertanggungjawaban
              </div>
            </div>
          </button>

          {/* Admin Panel Button */}
          <button
            onClick={handleAdminClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.25rem',
              border: '2px solid #e7e5e4',
              borderRadius: '12px',
              background: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#f59e0b';
              e.currentTarget.style.background = '#fffbeb';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e7e5e4';
              e.currentTarget.style.background = 'white';
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: '#fef3c7',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0
            }}>
              ⚙️
            </div>
            <div>
              <div style={{
                fontWeight: '600',
                color: '#1c1917',
                marginBottom: '0.25rem'
              }}>
                Panel Admin
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#78716c'
              }}>
                Kelola master data, user, dan pengaturan sistem
              </div>
            </div>
          </button>
        </div>

        {/* Logout Link */}
        <button
          onClick={onLogout}
          style={{
            marginTop: '1.5rem',
            background: 'none',
            border: 'none',
            color: '#78716c',
            fontSize: '0.875rem',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
