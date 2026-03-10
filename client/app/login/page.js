'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Globe } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
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
      minHeight: '90vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px',
    }}>
      <div style={{
        background: 'white', borderRadius: '24px',
        padding: '48px 40px', width: '100%', maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #0f4c35, #1a7a52)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Globe size={32} color="white" />
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#1a202c', marginBottom: '6px' }}>
            Welcome Back
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Login to your WanderShare account
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#9ca3af' }} />
            <input
              type="email" placeholder="Email address"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              style={{
                width: '100%', padding: '13px 14px 13px 40px',
                border: '2px solid #e5e7eb', borderRadius: '12px',
                fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#1a7a52'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#9ca3af' }} />
            <input
              type="password" placeholder="Password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              style={{
                width: '100%', padding: '13px 14px 13px 40px',
                border: '2px solid #e5e7eb', borderRadius: '12px',
                fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#1a7a52'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <button onClick={handleSubmit} disabled={loading} style={{
            background: 'linear-gradient(135deg, #0f4c35, #1a7a52)',
            color: 'white', padding: '14px', borderRadius: '12px',
            border: 'none', cursor: 'pointer', fontSize: '15px',
            fontWeight: '700', marginTop: '8px',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 4px 15px rgba(15,76,53,0.3)',
          }}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '24px' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: '#1a7a52', fontWeight: '700', textDecoration: 'none' }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}