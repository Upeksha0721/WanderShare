'use client';
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import ListingCard from '../components/ListingCard';
import { Search } from 'lucide-react';

export default function Explore() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/listings', { params: { search, page, limit: 12 } });
      setListings(data.listings);
      setTotalPages(data.pages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchListings(); }, [page]);

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
        padding: '48px 32px', margin: '-32px -16px 40px -16px',
        borderRadius: '0 0 32px 32px', textAlign: 'center',
      }}>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: '900', marginBottom: '8px' }}>
          Explore Experiences 🌏
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>
          Discover adventures shared by travelers worldwide
        </p>
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchListings(); }}
          style={{ display: 'flex', maxWidth: '500px', margin: '0 auto', background: 'white', borderRadius: '50px', padding: '6px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '16px', top: '11px', color: '#9ca3af' }} size={18} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search destinations..."
              style={{ width: '100%', padding: '11px 16px 11px 44px', border: 'none', outline: 'none', borderRadius: '50px', fontSize: '15px' }} />
          </div>
          <button type="submit" style={{
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#1e1b4b',
            padding: '11px 24px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '700',
          }}>Search</button>
        </form>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {[...Array(8)].map((_, i) => <div key={i} style={{ height: '320px', borderRadius: '16px', background: '#e5e7eb' }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {listings.map(l => <ListingCard key={l._id} listing={l} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} style={{
              width: '40px', height: '40px', borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: page === i + 1 ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : '#e5e7eb',
              color: page === i + 1 ? 'white' : '#374151', fontWeight: '700',
            }}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}