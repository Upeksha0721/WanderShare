'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '../../../lib/api';
import Cookies from 'js-cookie';
import { Lock, Mail, Shield } from 'lucide-react';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/admin/login', form);
      Cookies.set('adminToken', data.token, { expires: 7 });
      toast.success('Welcome Admin! 👑');
      router.push('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)',
    }}>
      <div style={{
        background: 'white', borderRadius: '24px',
        padding: '48px 40px', width: '100%', maxWidth: '420px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
          }}>
            <Shield size={36} color="white" />
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#1a202c', marginBottom: '6px' }}>
            Admin Portal
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            WanderShare Administration
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#9ca3af' }} />
            <input
              type="email" placeholder="Admin Email"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              style={{
                width: '100%', padding: '13px 14px 13px 40px',
                border: '2px solid #e5e7eb', borderRadius: '12px',
                fontSize: '14px', outline: 'none', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
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
              }}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <button onClick={handleSubmit} disabled={loading} style={{
            background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
            color: 'white', padding: '14px', borderRadius: '12px',
            border: 'none', cursor: 'pointer', fontSize: '15px',
            fontWeight: '700', marginTop: '8px',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 4px 15px rgba(124,58,237,0.3)',
          }}>
            {loading ? 'Logging in...' : '🔐 Login to Dashboard'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '24px' }}>
          🔒 Restricted access — Authorized personnel only
        </p>
      </div>
    </div>
  );
}