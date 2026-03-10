'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Shield, Trash2, Ban, ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const adminApi = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });
  adminApi.interceptors.request.use(config => {
    const token = Cookies.get('adminToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  useEffect(() => {
    const token = Cookies.get('adminToken');
    if (!token) { router.push('/admin/login'); return; }
    fetchUsers();
  }, []);

  useEffect(() => {
    setFiltered(users.filter(u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get('/api/admin/users');
      setUsers(data);
      setFiltered(data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await adminApi.delete(`/api/admin/users/${id}`);
      toast.success('User deleted');
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleBan = async (id) => {
    try {
      const { data } = await adminApi.patch(`/api/admin/users/${id}/ban`);
      toast.success(data.message);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isBanned: data.isBanned } : u));
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', margin: '0', padding: '0' }}>

      {/* Navbar */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        padding: '0 32px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 20px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={20} color="#1e1b4b" />
          </div>
          <span style={{ color: 'white', fontSize: '18px', fontWeight: '800' }}>
            Wander<span style={{ color: '#fbbf24' }}>Share</span>
            <span style={{ color: '#a78bfa', fontSize: '13px', marginLeft: '8px' }}>Admin</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href="/admin/dashboard" style={{
            color: 'rgba(255,255,255,0.8)', textDecoration: 'none',
            padding: '8px 16px', borderRadius: '8px', fontSize: '14px',
            background: 'rgba(255,255,255,0.1)',
          }}>Dashboard</Link>
          <Link href="/admin/listings" style={{
            color: 'rgba(255,255,255,0.8)', textDecoration: 'none',
            padding: '8px 16px', borderRadius: '8px', fontSize: '14px',
            background: 'rgba(255,255,255,0.1)',
          }}>Listings</Link>
        </div>
      </div>

      <div style={{ padding: '40px 32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1e1b4b', marginBottom: '4px' }}>
              User Management 👥
            </h1>
            <p style={{ color: '#6b7280' }}>{users.length} total users registered</p>
          </div>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search users..."
              style={{
                padding: '11px 16px 11px 36px', border: '2px solid #e5e7eb',
                borderRadius: '12px', fontSize: '14px', outline: 'none', width: '260px',
              }}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {/* Table Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 120px',
            padding: '16px 24px', background: '#f8faff',
            borderBottom: '1px solid #e5e7eb', fontWeight: '700',
            color: '#374151', fontSize: '13px',
          }}>
            <span>NAME</span>
            <span>EMAIL</span>
            <span>STATUS</span>
            <span>JOINED</span>
            <span>ACTIONS</span>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Loading users...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No users found</div>
          ) : (
            filtered.map((user, i) => (
              <div key={user._id} style={{
                display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 120px',
                padding: '16px 24px', alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid #f3f4f6' : 'none',
                background: user.isBanned ? '#fff7f7' : 'white',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => !user.isBanned && (e.currentTarget.style.background = '#fafbff')}
                onMouseLeave={e => e.currentTarget.style.background = user.isBanned ? '#fff7f7' : 'white'}
              >
                {/* Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: '700', fontSize: '14px', flexShrink: 0,
                  }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontWeight: '600', color: '#1a202c', fontSize: '14px' }}>{user.name}</span>
                </div>

                {/* Email */}
                <span style={{ color: '#6b7280', fontSize: '14px' }}>{user.email}</span>

                {/* Status */}
                <span style={{
                  display: 'inline-block', padding: '4px 10px', borderRadius: '50px',
                  fontSize: '12px', fontWeight: '600',
                  background: user.isBanned ? '#fee2e2' : '#dcfce7',
                  color: user.isBanned ? '#dc2626' : '#16a34a',
                }}>
                  {user.isBanned ? '🚫 Banned' : '✅ Active'}
                </span>

                {/* Joined */}
                <span style={{ color: '#9ca3af', fontSize: '13px' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => handleBan(user._id)} style={{
                    padding: '6px 10px', borderRadius: '8px', border: 'none',
                    cursor: 'pointer', fontSize: '12px', fontWeight: '600',
                    background: user.isBanned ? '#dcfce7' : '#fef3c7',
                    color: user.isBanned ? '#16a34a' : '#d97706',
                  }}>
                    {user.isBanned ? 'Unban' : 'Ban'}
                  </button>
                  <button onClick={() => handleDelete(user._id)} style={{
                    padding: '6px 10px', borderRadius: '8px', border: 'none',
                    cursor: 'pointer', background: '#fee2e2', color: '#dc2626',
                    fontSize: '12px', fontWeight: '600',
                  }}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}