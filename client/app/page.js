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
      const mine = data.listings.filter(l => 
        l.creatorId === user.id || 
        l.creatorId === user._id ||
        l.creatorName === user.name
      );
      console.log('All listings:', data.listings);
      console.log('User:', user);
      console.log('My listings:', mine);
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
      <div style={{ margin: '0 -16px', background: '#f8faff', minHeight: '100vh' }}>

        {/* ── HERO BANNER ── */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 60%, #7c3aed 100%)',
          padding: '60px 48px 80px',
        }}>
          {/* Decorative blobs */}
          <div style={{
            position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
            background: 'rgba(251,191,36,0.06)', top: '-200px', right: '-100px',
          }} />
          <div style={{
            position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
            background: 'rgba(167,139,250,0.08)', bottom: '-100px', left: '5%',
          }} />
          <div style={{
            position: 'absolute', width: '200px', height: '200px', borderRadius: '50%',
            border: '1px solid rgba(251,191,36,0.2)', top: '20px', left: '30%',
          }} />

          <div style={{ position: 'relative', maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px' }}>

              {/* Left — greeting */}
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)',
                  color: '#fbbf24', padding: '6px 16px', borderRadius: '50px',
                  fontSize: '13px', fontWeight: '700', marginBottom: '20px',
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24', display: 'inline-block' }} />
                  Active Traveler
                </div>

                <h1 style={{
                  color: 'white', fontSize: 'clamp(28px, 4vw, 48px)',
                  fontWeight: '900', lineHeight: '1.1', marginBottom: '12px',
                }}>
                  Welcome back,<br />
                  <span style={{
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>{user.name} ✈️</span>
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginBottom: '32px' }}>
                  Your adventure dashboard — track, manage, and inspire.
                </p>

                <Link href="/listings/new" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#1e1b4b', padding: '14px 28px', borderRadius: '50px',
                  textDecoration: 'none', fontWeight: '800', fontSize: '15px',
                  boxShadow: '0 8px 24px rgba(251,191,36,0.4)',
                }}>
                  <Plus size={18} /> Share New Experience
                </Link>
              </div>

              {/* Right — stat cards */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {[
                  { icon: '📋', label: 'Listings', value: stats.total, sub: 'Published', color: '#a78bfa' },
                  { icon: '❤️', label: 'Likes', value: stats.totalLikes, sub: 'Received', color: '#f87171' },
                  { icon: '🏆', label: 'Level', value: stats.total >= 5 ? 'Pro' : 'Starter', sub: 'Explorer', color: '#fbbf24' },
                ].map(({ icon, label, value, sub, color }) => (
                  <div key={label} style={{
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '20px', padding: '24px 28px',
                    minWidth: '120px', textAlign: 'center',
                    transition: 'transform 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
                    <div style={{ color, fontSize: '32px', fontWeight: '900', lineHeight: 1 }}>{value}</div>
                    <div style={{ color: 'white', fontSize: '13px', fontWeight: '700', marginTop: '4px' }}>{label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── WAVE DIVIDER ── */}
        <div style={{ marginTop: '-2px', lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" style={{ width: '100%', display: 'block' }}>
            <path fill="#f8faff" d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>

        {/* ── MY LISTINGS ── */}
        <div style={{ padding: '20px 48px 80px', maxWidth: '1200px', margin: '0 auto' }}>

          {/* Section header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px',
          }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1e1b4b', marginBottom: '4px' }}>
                My Experiences 🗺️
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                {myListings.length} {myListings.length === 1 ? 'experience' : 'experiences'} shared with the world
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href="/explore" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px', borderRadius: '50px',
                border: '2px solid #e5e7eb', background: 'white',
                color: '#374151', textDecoration: 'none',
                fontWeight: '700', fontSize: '14px',
              }}>
                🌍 Explore All
              </Link>
              <Link href="/listings/new" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px', borderRadius: '50px',
                background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
                color: 'white', textDecoration: 'none',
                fontWeight: '700', fontSize: '14px',
                boxShadow: '0 4px 15px rgba(124,58,237,0.3)',
              }}>
                <Plus size={15} /> New Listing
              </Link>
            </div>
          </div>

          {myLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{ height: '380px', borderRadius: '20px', background: '#e5e7eb', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : myListings.length === 0 ? (
            <div style={{
              background: 'white', borderRadius: '24px', padding: '80px 40px',
              textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              border: '2px dashed #e5e7eb',
            }}>
              <div style={{ fontSize: '72px', marginBottom: '20px' }}>🌍</div>
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1e1b4b', marginBottom: '10px' }}>
                No experiences yet!
              </h3>
              <p style={{ color: '#9ca3af', marginBottom: '28px', fontSize: '16px' }}>
                Share your first travel experience with the world
              </p>
              <Link href="/listings/new" style={{
                background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
                color: 'white', padding: '14px 36px', borderRadius: '50px',
                textDecoration: 'none', fontWeight: '800', fontSize: '15px',
                boxShadow: '0 8px 24px rgba(124,58,237,0.3)',
              }}>
                ✈️ Create Your First Listing
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {myListings.map(l => <ListingCard key={l._id} listing={l} />)}
            </div>
          )}

          {/* Bottom CTA */}
          {myListings.length > 0 && (
            <div style={{
              marginTop: '48px',
              background: 'linear-gradient(135deg, #1e1b4b, #4c1d95)',
              borderRadius: '24px', padding: '40px 48px',
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', flexWrap: 'wrap', gap: '24px',
            }}>
              <div>
                <h3 style={{ color: 'white', fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>
                  Discover More Adventures 🌏
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                  Explore experiences shared by other travelers worldwide
                </p>
              </div>
              <Link href="/explore" style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: '#1e1b4b', padding: '14px 32px', borderRadius: '50px',
                textDecoration: 'none', fontWeight: '800', fontSize: '15px',
                boxShadow: '0 4px 20px rgba(251,191,36,0.4)',
                whiteSpace: 'nowrap',
              }}>
                Explore All Listings →
              </Link>
            </div>
          )}
        </div>

        <style>{`
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `}</style>
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
      <div style={{ padding: '100px 40px', background: '#f8faff' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)',
            color: '#7c3aed', padding: '6px 20px', borderRadius: '50px',
            fontSize: '13px', fontWeight: '700', marginBottom: '16px',
            letterSpacing: '1px', textTransform: 'uppercase',
          }}>✨ Curated For You</div>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '900', marginBottom: '16px',
            color: '#1e1b4b', lineHeight: '1.1',
          }}>
            Featured <span style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Experiences</span>
          </h2>
          <p style={{ color: '#6b7280', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>
            Handpicked adventures from passionate local experts around the world
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                height: '380px', borderRadius: '20px',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 20px',
            background: 'white', borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🌍</div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1e1b4b', marginBottom: '8px' }}>No experiences yet!</h3>
            <p style={{ color: '#6b7280' }}>Be the first to share an adventure</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px' }}>
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
      <div style={{ padding: '100px 20px', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)',
              color: '#7c3aed', padding: '6px 20px', borderRadius: '50px',
              fontSize: '13px', fontWeight: '700', marginBottom: '16px',
              letterSpacing: '1px', textTransform: 'uppercase',
            }}>💬 Get In Touch</div>
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '900', color: '#1e1b4b',
              marginBottom: '16px', lineHeight: '1.1',
            }}>
              We'd Love To <span style={{
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Hear From You</span>
            </h2>
            <p style={{ color: '#6b7280', fontSize: '17px' }}>
              Have questions or feedback? Our team responds within 24 hours.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px', alignItems: 'start' }}>

            {/* Left — Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { icon: '📧', label: 'Email Us', value: 'hello@wandershare.com', sub: 'We reply within 24 hours', color: '#4f46e5', bg: '#ede9fe' },
                { icon: '📞', label: 'Call Us', value: '+1 (555) 000-0000', sub: 'Mon–Fri, 9am–6pm EST', color: '#7c3aed', bg: '#f3e8ff' },
                { icon: '📍', label: 'Our Office', value: 'San Francisco, CA', sub: 'Visit us anytime', color: '#d97706', bg: '#fef3c7' },
                { icon: '🌐', label: 'Social', value: '@wandershare', sub: 'Follow our adventures', color: '#db2777', bg: '#fce7f3' },
              ].map(({ icon, label, value, sub, color, bg }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  background: '#f8faff', borderRadius: '16px', padding: '20px',
                  border: '1px solid #f0f0f0', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = color + '40'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f8faff'; e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: bg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '22px', flexShrink: 0,
                  }}>{icon}</div>
                  <div>
                    <div style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                    <div style={{ color: '#1e1b4b', fontWeight: '700', fontSize: '15px' }}>{value}</div>
                    <div style={{ color: '#9ca3af', fontSize: '12px' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — Form */}
            <div style={{
              background: 'linear-gradient(135deg, #1e1b4b, #4c1d95)',
              borderRadius: '24px', padding: '40px',
              boxShadow: '0 20px 60px rgba(30,27,75,0.3)',
            }}>
              <h3 style={{ color: 'white', fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>
                Send us a message
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '28px' }}>
                Fill out the form and we'll get back to you shortly
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {['First Name', 'Last Name'].map(p => (
                    <div key={p}>
                      <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>{p}</label>
                      <input placeholder={p} style={{
                        width: '100%', padding: '12px 14px', borderRadius: '12px',
                        border: '1.5px solid rgba(255,255,255,0.15)',
                        background: 'rgba(255,255,255,0.08)', color: 'white',
                        fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                        backdropFilter: 'blur(10px)',
                      }}
                        onFocus={e => e.target.style.borderColor = '#fbbf24'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                      />
                    </div>
                  ))}
                </div>

                {[
                  { label: 'Email Address', placeholder: 'you@example.com', type: 'email' },
                  { label: 'Subject', placeholder: 'How can we help?', type: 'text' },
                ].map(({ label, placeholder, type }) => (
                  <div key={label}>
                    <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>{label}</label>
                    <input placeholder={placeholder} type={type} style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px',
                      border: '1.5px solid rgba(255,255,255,0.15)',
                      background: 'rgba(255,255,255,0.08)', color: 'white',
                      fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                    }}
                      onFocus={e => e.target.style.borderColor = '#fbbf24'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                    />
                  </div>
                ))}

                <div>
                  <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Message</label>
                  <textarea placeholder="Tell us more..." rows={4} style={{
                    width: '100%', padding: '12px 14px', borderRadius: '12px',
                    border: '1.5px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.08)', color: 'white',
                    fontSize: '14px', outline: 'none', resize: 'none', boxSizing: 'border-box',
                  }}
                    onFocus={e => e.target.style.borderColor = '#fbbf24'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                  />
                </div>

                <button style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#1e1b4b', padding: '14px', borderRadius: '12px',
                  border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '800',
                  boxShadow: '0 4px 20px rgba(251,191,36,0.4)',
                  transition: 'all 0.3s',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Send Message 🚀
                </button>
              </div>
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