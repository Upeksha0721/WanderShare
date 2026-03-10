'use client';
import { useEffect, useState } from 'react';
import api from '../lib/api';
import ListingCard from './components/ListingCard';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Users, Star, Mail, Phone, ChevronDown, Plus, Heart, List } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [myListings, setMyListings] = useState([]);
  const [stats, setStats] = useState({ total: 0, totalLikes: 0 });
  const [myLoading, setMyLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch all listings (for public feed)
  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/listings', {
        params: { search, page, limit: 12 }
      });
      setListings(data.listings);
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch MY listings
  const fetchMyListings = async () => {
    setMyLoading(true);
    try {
      const { data } = await api.get('/api/listings', { params: { limit: 100 } });
      const mine = data.listings.filter(l => l.creatorId === user.id);
      const totalLikes = mine.reduce((sum, l) => sum + (l.likes?.length || 0), 0);
      setMyListings(mine);
      setStats({ total: mine.length, totalLikes });
    } catch (err) {
      console.error(err);
    } finally {
      setMyLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchMyListings();
      } else {
        fetchListings();
      }
    }
  }, [user, authLoading, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchListings();
  };

  // ─── LOGGED IN VIEW ───────────────────────────────────
  if (user) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8faff' }}>

        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)',
          padding: '48px 32px', margin: '-32px -16px 40px -16px',
          borderRadius: '0 0 32px 32px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute', width: '300px', height: '300px',
            borderRadius: '50%', background: 'rgba(251,191,36,0.08)',
            top: '-100px', right: '-50px',
          }} />
          <div style={{
            position: 'absolute', width: '200px', height: '200px',
            borderRadius: '50%', background: 'rgba(167,139,250,0.1)',
            bottom: '-80px', left: '10%',
          }} />

          <div style={{ position: 'relative', maxWidth: '800px' }}>
            <p style={{ color: '#fbbf24', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              👋 Welcome back
            </p>
            <h1 style={{
              color: 'white', fontSize: '36px', fontWeight: '900',
              marginBottom: '8px', letterSpacing: '-1px',
            }}>
              {user.name}'s Dashboard
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginBottom: '32px' }}>
              Manage your travel experiences and track your performance
            </p>

            {/* Stats cards */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {[
                { icon: '📋', label: 'Total Listings', value: stats.total, color: '#fbbf24' },
                { icon: '❤️', label: 'Total Likes', value: stats.totalLikes, color: '#f87171' },
                { icon: '🌍', label: 'Explorer Level', value: stats.total >= 5 ? 'Pro' : 'Starter', color: '#34d399' },
              ].map(({ icon, label, value, color }) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '16px', padding: '20px 28px',
                  minWidth: '150px', flex: 1,
                }}>
                  <div style={{ fontSize: '28px', marginBottom: '4px' }}>{icon}</div>
                  <div style={{ color, fontSize: '28px', fontWeight: '800' }}>{value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Listings Section */}
        <div style={{ padding: '0 0 60px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px',
          }}>
            <div>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#1e1b4b', marginBottom: '4px' }}>
                My Experiences
              </h2>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                {myListings.length} listing{myListings.length !== 1 ? 's' : ''} published
              </p>
            </div>
            <Link href="/listings/new" style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
              color: 'white', padding: '12px 24px', borderRadius: '50px',
              textDecoration: 'none', fontWeight: '700', fontSize: '14px',
              boxShadow: '0 4px 15px rgba(124,58,237,0.3)',
            }}>
              <Plus size={16} /> Add New Experience
            </Link>
          </div>

          {myLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{ height: '320px', borderRadius: '16px', background: '#e5e7eb', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : myListings.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '80px 20px',
              background: 'white', borderRadius: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🌍</div>
              <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1e1b4b', marginBottom: '8px' }}>
                No experiences yet!
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                Share your first travel experience with the world
              </p>
              <Link href="/listings/new" style={{
                background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
                color: 'white', padding: '12px 32px', borderRadius: '50px',
                textDecoration: 'none', fontWeight: '700',
              }}>
                Create Your First Listing
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {myListings.map(l => <ListingCard key={l._id} listing={l} />)}
            </div>
          )}

          {/* Explore more link */}
          <div style={{
            textAlign: 'center', marginTop: '48px', padding: '32px',
            background: 'linear-gradient(135deg, #1e1b4b, #4c1d95)',
            borderRadius: '24px', color: 'white',
          }}>
            <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>
              Explore Other Experiences 🌏
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>
              Discover amazing adventures shared by other travelers
            </p>
            <Link href="/explore" style={{
              background: '#fbbf24', color: '#1e1b4b',
              padding: '12px 32px', borderRadius: '50px',
              textDecoration: 'none', fontWeight: '800',
            }}>
              Explore All Listings →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── PUBLIC LANDING PAGE ──────────────────────────────
  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* HERO */}
      <div style={{
        position: 'relative', height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          transform: `translateY(${scrollY * 0.4}px)`,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(30,27,75,0.85) 0%, rgba(88,28,135,0.75) 50%, rgba(234,179,8,0.3) 100%)',
        }} />
        <div style={{
          position: 'absolute', width: '400px', height: '400px',
          borderRadius: '50%', border: '1px solid rgba(167,139,250,0.3)',
          top: '10%', left: '-5%', animation: 'spin 20s linear infinite',
        }} />
        <div style={{
          position: 'absolute', width: '300px', height: '300px',
          borderRadius: '50%', border: '1px solid rgba(234,179,8,0.3)',
          bottom: '10%', right: '-5%', animation: 'spin 15s linear infinite reverse',
        }} />

        <div style={{ position: 'relative', textAlign: 'center', padding: '0 20px', maxWidth: '800px' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(234,179,8,0.2)',
            border: '1px solid rgba(234,179,8,0.5)',
            padding: '6px 20px', borderRadius: '50px', marginBottom: '24px',
          }}>
            <span style={{ color: '#fbbf24', fontSize: '14px', fontWeight: '600' }}>✈️ Explore the World</span>
          </div>

          <h1 style={{
            color: 'white', fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: '900', lineHeight: '1.1', marginBottom: '20px',
          }}>
            Discover Amazing<br />
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24, #a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Travel Experiences
            </span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', marginBottom: '40px', lineHeight: '1.6' }}>
            Connect with local guides and experience authentic adventures around the world
          </p>

          <form onSubmit={handleSearch} style={{
            display: 'flex', maxWidth: '560px', margin: '0 auto 40px',
            background: 'white', borderRadius: '50px', padding: '6px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search style={{ position: 'absolute', left: '16px', top: '11px', color: '#9ca3af' }} size={18} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search destinations..."
                style={{
                  width: '100%', padding: '11px 16px 11px 44px',
                  border: 'none', outline: 'none', borderRadius: '50px',
                  fontSize: '15px', background: 'transparent',
                }} />
            </div>
            <button type="submit" style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: 'white', padding: '11px 28px', borderRadius: '50px',
              border: 'none', cursor: 'pointer', fontWeight: '700',
            }}>
              Search
            </button>
          </form>

          <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['500+', 'Experiences'], ['120+', 'Destinations'], ['1000+', 'Travelers']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ color: '#fbbf24', fontSize: '28px', fontWeight: '800' }}>{num}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', animation: 'bounce 2s infinite' }}>
          <ChevronDown color="white" size={32} />
        </div>
      </div>

      {/* LISTINGS */}
      <div style={{ padding: '80px 0', background: '#f8faff' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{
            fontSize: '40px', fontWeight: '800', marginBottom: '12px',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Featured Experiences</h2>
          <p style={{ color: '#6b7280' }}>Handpicked adventures from local experts</p>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height: '320px', borderRadius: '16px', background: '#e5e7eb' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {listings.map(l => <ListingCard key={l._id} listing={l} />)}
          </div>
        )}
      </div>

      {/* ABOUT */}
      <div style={{
        padding: '100px 20px',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <span style={{
            background: 'rgba(234,179,8,0.2)', border: '1px solid rgba(234,179,8,0.5)',
            color: '#fbbf24', padding: '6px 20px', borderRadius: '50px', fontSize: '14px', fontWeight: '600',
          }}>About Us</span>
          <h2 style={{ color: 'white', fontSize: '42px', fontWeight: '800', margin: '20px 0 16px' }}>
            We Connect Travelers With<br />
            <span style={{ color: '#fbbf24' }}>Authentic Local Experiences</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '17px', lineHeight: '1.8', marginBottom: '60px' }}>
            WanderShare is a platform that brings together passionate local guides and adventure-seeking travelers.
            We believe every destination has hidden gems waiting to be discovered.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {[
              { icon: '🌍', title: 'Global Reach', desc: 'Experiences in 120+ countries' },
              { icon: '⭐', title: 'Verified Guides', desc: 'All guides are verified and rated' },
              { icon: '🔒', title: 'Safe & Secure', desc: 'Your safety is our priority' },
              { icon: '💰', title: 'Best Prices', desc: 'No hidden fees ever' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{
                background: 'rgba(255,255,255,0.08)', borderRadius: '16px',
                padding: '28px 20px', border: '1px solid rgba(255,255,255,0.1)',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{icon}</div>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <div style={{ padding: '100px 20px', background: '#f8faff' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{
            background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)',
            color: '#7c3aed', padding: '6px 20px', borderRadius: '50px', fontSize: '14px', fontWeight: '600',
          }}>Contact Us</span>
          <h2 style={{
            fontSize: '40px', fontWeight: '800', margin: '20px 0 12px',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Get In Touch</h2>
          <p style={{ color: '#6b7280', marginBottom: '48px' }}>Have questions? We'd love to hear from you.</p>

          <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {['Your Name', 'Your Email'].map(p => (
                <input key={p} placeholder={p} type={p.includes('Email') ? 'email' : 'text'} style={{
                  padding: '14px 16px', border: '2px solid #e5e7eb',
                  borderRadius: '12px', fontSize: '15px', outline: 'none',
                }}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              ))}
              <textarea placeholder="Your Message" rows={4} style={{
                padding: '14px 16px', border: '2px solid #e5e7eb',
                borderRadius: '12px', fontSize: '15px', outline: 'none', resize: 'none',
              }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
              <button style={{
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: 'white', padding: '14px', borderRadius: '12px',
                border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '700',
              }}>Send Message ✉️</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '24px', flexWrap: 'wrap' }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>📧 hello@wandershare.com</span>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>📞 +1 (555) 000-0000</span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: '#1e1b4b', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>🌍 WanderShare</div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>© 2026 WanderShare. All rights reserved.</p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-10px); } }
      `}</style>
    </div>
  );
}