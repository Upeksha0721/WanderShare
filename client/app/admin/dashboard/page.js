'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Users, List, Heart, MapPin, TrendingUp, LogOut, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
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

    adminApi.get('/api/admin/stats')
      .then(res => setStats(res.data))
      .catch(() => { router.push('/admin/login'); })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    Cookies.remove('adminToken');
    router.push('/admin/login');
  };

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
    }}>
      <div style={{ color: 'white', fontSize: '18px' }}>Loading dashboard... ⏳</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', margin: '0', padding: '0' }}>

      {/* Admin Navbar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href="/admin/users" style={{
            color: 'rgba(255,255,255,0.8)', textDecoration: 'none',
            padding: '8px 16px', borderRadius: '8px', fontSize: '14px',
            background: 'rgba(255,255,255,0.1)',
          }}>Users</Link>
          <Link href="/admin/listings" style={{
            color: 'rgba(255,255,255,0.8)', textDecoration: 'none',
            padding: '8px 16px', borderRadius: '8px', fontSize: '14px',
            background: 'rgba(255,255,255,0.1)',
          }}>Listings</Link>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(239,68,68,0.2)', color: '#fca5a5',
            padding: '8px 16px', borderRadius: '8px',
            border: '1px solid rgba(239,68,68,0.3)',
            cursor: 'pointer', fontSize: '14px',
          }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div style={{ padding: '40px 32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1e1b4b', marginBottom: '4px' }}>
            Dashboard Overview 📊
          </h1>
          <p style={{ color: '#6b7280' }}>Welcome back, Admin! Here's what's happening.</p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px', marginBottom: '40px',
        }}>
          {[
            { icon: <Users size={24} />, label: 'Total Users', value: stats?.totalUsers || 0, color: '#4f46e5', bg: '#ede9fe' },
            { icon: <List size={24} />, label: 'Total Listings', value: stats?.totalListings || 0, color: '#7c3aed', bg: '#f3e8ff' },
            { icon: <Heart size={24} />, label: 'Most Liked', value: stats?.mostLiked?.[0]?.likes?.length || 0, color: '#db2777', bg: '#fce7f3' },
            { icon: <MapPin size={24} />, label: 'Locations', value: stats?.byLocation?.length || 0, color: '#d97706', bg: '#fef3c7' },
          ].map(({ icon, label, value, color, bg }) => (
            <div key={label} style={{
              background: 'white', borderRadius: '20px', padding: '28px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              borderLeft: `4px solid ${color}`,
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', color, marginBottom: '16px',
              }}>
                {icon}
              </div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#1a202c', marginBottom: '4px' }}>
                {value}
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>

          {/* New Users Chart */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e1b4b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color="#4f46e5" /> New Users (Last 7 Days)
            </h3>
            {stats?.newUsersData?.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>No new users this week</p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
                {stats?.newUsersData?.map((d, i) => {
                  const max = Math.max(...stats.newUsersData.map(x => x.count));
                  const height = (d.count / max) * 100;
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '11px', color: '#6b7280' }}>{d.count}</span>
                      <div style={{
                        width: '100%', height: `${height}px`,
                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                        borderRadius: '6px 6px 0 0', minHeight: '4px',
                      }} />
                      <span style={{ fontSize: '10px', color: '#9ca3af' }}>
                        {d._id?.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Listings by Location */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e1b4b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} color="#d97706" /> Listings by Location
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats?.byLocation?.map((loc, i) => {
                const max = stats.byLocation[0]?.count || 1;
                const pct = (loc.count / max) * 100;
                const colors = ['#4f46e5', '#7c3aed', '#db2777', '#d97706', '#059669', '#dc2626'];
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>{loc._id}</span>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>{loc.count}</span>
                    </div>
                    <div style={{ background: '#f3f4f6', borderRadius: '50px', height: '8px' }}>
                      <div style={{
                        width: `${pct}%`, height: '100%',
                        background: colors[i % colors.length],
                        borderRadius: '50px', transition: 'width 0.5s',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Most Liked Listings */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e1b4b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={20} color="#db2777" /> Most Liked Listings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats?.mostLiked?.map((listing, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', background: '#f8faff', borderRadius: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: '700', fontSize: '14px',
                  }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#1a202c', fontSize: '14px' }}>{listing.title}</div>
                    <div style={{ color: '#6b7280', fontSize: '12px' }}>{listing.location} • by {listing.creatorName}</div>
                  </div>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  background: '#fce7f3', padding: '4px 12px', borderRadius: '50px',
                  color: '#db2777', fontWeight: '700', fontSize: '14px',
                }}>
                  ❤️ {listing.likes?.length || 0}
                </div>
              </div>
            ))}
            {(!stats?.mostLiked || stats.mostLiked.length === 0) && (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>No listings yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}