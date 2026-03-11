'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', form);
      login(data.token, data.user);
      toast.success('Welcome back! 🌍');
      router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      margin: '0 -16px',
    }}>
      {/* LEFT PANEL */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '60px 48px',
        background: 'white',
      }}>
        {/* Logo */}
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            textDecoration: 'none', marginBottom: '48px',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px',
            }}>🌍</div>
            <span style={{ fontSize: '22px', fontWeight: '900', color: '#1e1b4b' }}>
              Wander<span style={{ color: '#7c3aed' }}>Share</span>
            </span>
          </Link>

          <h1 style={{
            fontSize: '36px', fontWeight: '900', color: '#1e1b4b',
            marginBottom: '8px', lineHeight: '1.1',
          }}>
            Welcome back 👋
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '40px' }}>
            Sign in to continue your journey
          </p>

          {/* Social login buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
            {/* Google */}
            <button style={{
              flex: 1, padding: '12px', borderRadius: '12px',
              border: '2px solid #e5e7eb', background: 'white',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '10px',
              fontSize: '14px', fontWeight: '600', color: '#374151',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.background = '#fafaff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = 'white'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            {/* Apple */}
            <button style={{
              flex: 1, padding: '12px', borderRadius: '12px',
              border: '2px solid #e5e7eb', background: 'white',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '10px',
              fontSize: '14px', fontWeight: '600', color: '#374151',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.background = '#fafaff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = 'white'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#000">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.18 1.27-2.16 3.8.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.37 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '500' }}>or continue with email</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email */}
            <div>
              <label style={{ fontSize: '14px', fontWeight: '700', color: '#374151', marginBottom: '8px', display: 'block' }}>
                Email address
              </label>
              <div style={{
                position: 'relative',
                border: `2px solid ${focused === 'email' ? '#7c3aed' : '#e5e7eb'}`,
                borderRadius: '14px', background: focused === 'email' ? '#fafaff' : '#f9fafb',
                transition: 'all 0.2s',
              }}>
                <Mail size={16} style={{
                  position: 'absolute', left: '16px', top: '50%',
                  transform: 'translateY(-50%)',
                  color: focused === 'email' ? '#7c3aed' : '#9ca3af',
                  transition: 'color 0.2s',
                }} />
                <input
                  type="email" placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  style={{
                    width: '100%', padding: '14px 16px 14px 44px',
                    border: 'none', outline: 'none', background: 'transparent',
                    fontSize: '15px', borderRadius: '14px', boxSizing: 'border-box',
                    color: '#1e1b4b',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '700', color: '#374151' }}>
                  Password
                </label>
                <span style={{ fontSize: '13px', color: '#7c3aed', cursor: 'pointer', fontWeight: '600' }}>
                  Forgot password?
                </span>
              </div>
              <div style={{
                position: 'relative',
                border: `2px solid ${focused === 'password' ? '#7c3aed' : '#e5e7eb'}`,
                borderRadius: '14px', background: focused === 'password' ? '#fafaff' : '#f9fafb',
                transition: 'all 0.2s',
              }}>
                <Lock size={16} style={{
                  position: 'absolute', left: '16px', top: '50%',
                  transform: 'translateY(-50%)',
                  color: focused === 'password' ? '#7c3aed' : '#9ca3af',
                  transition: 'color 0.2s',
                }} />
                <input
                  type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  style={{
                    width: '100%', padding: '14px 44px 14px 44px',
                    border: 'none', outline: 'none', background: 'transparent',
                    fontSize: '15px', borderRadius: '14px', boxSizing: 'border-box',
                    color: '#1e1b4b',
                  }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: '16px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0,
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} disabled={loading} style={{
              background: loading
                ? '#9ca3af'
                : 'linear-gradient(135deg, #1e1b4b 0%, #7c3aed 100%)',
              color: 'white', padding: '15px 24px', borderRadius: '14px',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px', fontWeight: '800',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(124,58,237,0.4)',
              transition: 'all 0.3s',
              marginTop: '8px',
            }}
              onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {loading ? (
                <>⏳ Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '32px' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: '#7c3aed', fontWeight: '800', textDecoration: 'none' }}>
              Create one free →
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        flex: 1, position: 'relative', overflow: 'hidden',
        display: 'none',
      }}
        ref={el => {
          if (el) {
            if (window.innerWidth >= 768) el.style.display = 'block';
          }
        }}
      >
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(30,27,75,0.85), rgba(124,58,237,0.7))',
        }} />

        {/* Content */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          padding: '48px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>✈️</div>
          <h2 style={{
            color: 'white', fontSize: '36px', fontWeight: '900',
            marginBottom: '16px', lineHeight: '1.2',
          }}>
            Your Next Adventure<br />
            <span style={{ color: '#fbbf24' }}>Awaits You</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', lineHeight: '1.7', maxWidth: '320px' }}>
            Join thousands of travelers sharing authentic experiences from around the world
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: '32px', marginTop: '48px',
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px', padding: '24px 32px',
          }}>
            {[['500+', 'Experiences'], ['120+', 'Destinations'], ['1K+', 'Travelers']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ color: '#fbbf24', fontSize: '24px', fontWeight: '900' }}>{num}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div style={{
            marginTop: '32px', background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px', padding: '24px', maxWidth: '340px', textAlign: 'left',
          }}>
            <p style={{ color: 'white', fontSize: '14px', lineHeight: '1.7', marginBottom: '16px', fontStyle: 'italic' }}>
              "WanderShare helped me discover hidden gems I never would have found on my own. Absolutely life-changing!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#1e1b4b', fontWeight: '800',
              }}>S</div>
              <div>
                <div style={{ color: 'white', fontWeight: '700', fontSize: '13px' }}>Sarah K.</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Traveler from UK ⭐⭐⭐⭐⭐</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}