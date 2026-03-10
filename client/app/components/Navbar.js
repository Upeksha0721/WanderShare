'use client';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Plus, LogOut, Globe } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const handleLogout = () => { logout(); router.push('/'); };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
      padding: '0 32px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
      borderBottom: '1px solid rgba(167,139,250,0.2)',
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(251,191,36,0.4)',
        }}>
          <Globe size={20} color="#1e1b4b" />
        </div>
        <span style={{
          color: 'white', fontSize: '20px', fontWeight: '800',
          letterSpacing: '-0.5px',
        }}>
          Wander<span style={{ color: '#fbbf24' }}>Share</span>
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {user ? (
          <>
            <span style={{
              color: 'rgba(255,255,255,0.7)', fontSize: '14px',
              padding: '6px 12px',
            }}>
              👋 Hi, <strong style={{ color: '#a78bfa' }}>{user.name}</strong>
            </span>
            <Link href="/listings/new" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              color: '#1e1b4b', padding: '8px 18px', borderRadius: '50px',
              textDecoration: 'none', fontWeight: '800', fontSize: '14px',
              boxShadow: '0 4px 15px rgba(251,191,36,0.35)',
            }}>
              <Plus size={15} /> New Listing
            </Link>
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.8)',
              padding: '8px 16px', borderRadius: '50px',
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: 'pointer', fontSize: '14px',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <LogOut size={14} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{
              color: 'rgba(255,255,255,0.8)', textDecoration: 'none',
              fontSize: '14px', fontWeight: '600', padding: '8px 16px',
              borderRadius: '50px', transition: 'all 0.2s',
            }}>
              Login
            </Link>
            <Link href="/register" style={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              color: '#1e1b4b', padding: '8px 20px', borderRadius: '50px',
              textDecoration: 'none', fontWeight: '800', fontSize: '14px',
              boxShadow: '0 4px 15px rgba(251,191,36,0.35)',
            }}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}