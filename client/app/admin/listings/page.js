'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Shield, Trash2, Search, MapPin, Heart } from 'lucide-react';
import Link from 'next/link';

export default function AdminListings() {
  const [listings, setListings] = useState([]);
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
    fetchListings();
  }, []);

  useEffect(() => {
    setFiltered(listings.filter(l =>
      l.title?.toLowerCase().includes(search.toLowerCase()) ||
      l.location?.toLowerCase().includes(search.toLowerCase()) ||
      l.creatorName?.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, listings]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get('/api/admin/listings');
      setListings(data);
      setFiltered(data);
    } catch {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this listing permanently?')) return;
    try {
      await adminApi.delete(`/api/admin/listings/${id}`);
      toast.success('Listing deleted');
      setListings(prev => prev.filter(l => l._id !== id));
    } catch {
      toast.error('Failed to delete');
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
          <Link href="/admin/users" style={{
            color: 'rgba(255,255,255,0.8)', textDecoration: 'none',
            padding: '8px 16px', borderRadius: '8px', fontSize: '14px',
            background: 'rgba(255,255,255,0.1)',
          }}>Users</Link>
        </div>
      </div>

      <div style={{ padding: '40px 32px' }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px',
        }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1e1b4b', marginBottom: '4px' }}>
              Listing Management 📋
            </h1>
            <p style={{ color: '#6b7280' }}>{listings.length} total listings</p>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search listings..."
              style={{
                padding: '11px 16px 11px 36px', border: '2px solid #e5e7eb',
                borderRadius: '12px', fontSize: '14px', outline: 'none', width: '260px',
              }}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height: '200px', borderRadius: '16px', background: '#e5e7eb' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <p>No listings found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {filtered.map(listing => (
              <div key={listing._id} style={{
                background: 'white', borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden',
                transition: 'transform 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Image */}
                <div style={{ position: 'relative', height: '140px' }}>
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=400'; }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.4))',
                  }} />
                  {listing.price && (
                    <span style={{
                      position: 'absolute', top: '10px', right: '10px',
                      background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
                      color: 'white', padding: '3px 10px', borderRadius: '20px',
                      fontSize: '12px', fontWeight: '700',
                    }}>
                      ${listing.price}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontWeight: '700', color: '#1a202c', marginBottom: '6px', fontSize: '15px' }}>
                    {listing.title}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#7c3aed', fontSize: '13px' }}>
                      <MapPin size={12} />{listing.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#db2777', fontSize: '13px' }}>
                      <Heart size={12} />{listing.likes?.length || 0}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                      by {listing.creatorName}
                    </span>
                    <button onClick={() => handleDelete(listing._id)} style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      padding: '6px 12px', borderRadius: '8px', border: 'none',
                      cursor: 'pointer', background: '#fee2e2', color: '#dc2626',
                      fontSize: '12px', fontWeight: '600',
                    }}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}