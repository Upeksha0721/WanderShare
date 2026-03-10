'use client';
import { useEffect, useState } from 'react';
import api from '../lib/api';
import ListingCard from './components/ListingCard';
import { Search, MapPin, Users, Star, Mail, Phone, ChevronDown } from 'lucide-react';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  useEffect(() => { fetchListings(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchListings();
  };

  return (
    <div style={{ overflowX: 'hidden' }}>

      {/* ===== HERO SECTION ===== */}
      <div style={{
        position: 'relative', height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '-32px -16px 0 -16px', overflow: 'hidden',
      }}>
        {/* Background image with parallax */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          transform: `translateY(${scrollY * 0.4}px)`,
          transition: 'transform 0.1s',
        }} />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(30,27,75,0.85) 0%, rgba(88,28,135,0.75) 50%, rgba(234,179,8,0.3) 100%)',
        }} />

        {/* Animated circles */}
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

        {/* Hero content */}
        <div style={{ position: 'relative', textAlign: 'center', padding: '0 20px', maxWidth: '800px' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(234,179,8,0.2)',
            border: '1px solid rgba(234,179,8,0.5)',
            padding: '6px 20px', borderRadius: '50px', marginBottom: '24px',
          }}>
            <span style={{ color: '#fbbf24', fontSize: '14px', fontWeight: '600' }}>
              ✈️ Explore the World
            </span>
          </div>

          <h1 style={{
            color: 'white', fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: '900', lineHeight: '1.1', marginBottom: '20px',
            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
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
            Connect with local guides and experience authentic adventures<br />around the world
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{
            display: 'flex', gap: '0', maxWidth: '560px', margin: '0 auto 40px',
            background: 'white', borderRadius: '50px', padding: '6px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search style={{ position: 'absolute', left: '16px', top: '11px', color: '#9ca3af' }} size={18} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search destinations..."
                style={{
                  width: '100%', padding: '11px 16px 11px 44px',
                  border: 'none', outline: 'none', borderRadius: '50px',
                  fontSize: '15px', background: 'transparent',
                }}
              />
            </div>
            <button type="submit" style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: 'white', padding: '11px 28px', borderRadius: '50px',
              border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '15px',
              boxShadow: '0 4px 15px rgba(124,58,237,0.4)',
            }}>
              Search
            </button>
          </form>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['500+', 'Experiences'], ['120+', 'Destinations'], ['1000+', 'Happy Travelers']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ color: '#fbbf24', fontSize: '28px', fontWeight: '800' }}>{num}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
          animation: 'bounce 2s infinite',
        }}>
          <ChevronDown color="white" size={32} />
        </div>
      </div>

      {/* ===== LISTINGS SECTION ===== */}
      <div style={{ padding: '80px 0', background: '#f8faff' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{
            fontSize: '40px', fontWeight: '800', marginBottom: '12px',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Featured Experiences
          </h2>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            Handpicked adventures from local experts
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                height: '320px', borderRadius: '16px',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                animation: 'shimmer 1.5s infinite',
              }} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>🌍</div>
            <p style={{ color: '#6b7280', fontSize: '18px' }}>No listings yet. Be the first to add one!</p>
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
                width: '40px', height: '40px', borderRadius: '50%', border: 'none',
                cursor: 'pointer', fontWeight: '700',
                background: page === i + 1 ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : '#e5e7eb',
                color: page === i + 1 ? 'white' : '#374151',
              }}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ===== ABOUT SECTION ===== */}
      <div style={{
        padding: '100px 20px',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <span style={{
            background: 'rgba(234,179,8,0.2)', border: '1px solid rgba(234,179,8,0.5)',
            color: '#fbbf24', padding: '6px 20px', borderRadius: '50px',
            fontSize: '14px', fontWeight: '600',
          }}>
            About Us
          </span>
          <h2 style={{
            color: 'white', fontSize: '42px', fontWeight: '800',
            margin: '20px 0 16px', lineHeight: '1.2',
          }}>
            We Connect Travelers With<br />
            <span style={{ color: '#fbbf24' }}>Authentic Local Experiences</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '17px', lineHeight: '1.8', marginBottom: '60px' }}>
            WanderShare is a platform that brings together passionate local guides and adventure-seeking travelers.
            We believe every destination has hidden gems waiting to be discovered. Our mission is to make
            authentic travel experiences accessible to everyone, while empowering local communities.
          </p>

          {/* Feature cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {[
              { icon: '🌍', title: 'Global Reach', desc: 'Experiences in 120+ countries worldwide' },
              { icon: '⭐', title: 'Verified Guides', desc: 'All our guides are verified and rated' },
              { icon: '🔒', title: 'Safe & Secure', desc: 'Your safety is our top priority' },
              { icon: '💰', title: 'Best Prices', desc: 'Competitive prices, no hidden fees' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{
                background: 'rgba(255,255,255,0.08)', borderRadius: '16px',
                padding: '28px 20px', border: '1px solid rgba(255,255,255,0.1)',
                transition: 'transform 0.3s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{icon}</div>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.6' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CONTACT SECTION ===== */}
      <div style={{ padding: '100px 20px', background: '#f8faff' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{
            background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)',
            color: '#7c3aed', padding: '6px 20px', borderRadius: '50px',
            fontSize: '14px', fontWeight: '600',
          }}>
            Contact Us
          </span>
          <h2 style={{
            fontSize: '40px', fontWeight: '800', margin: '20px 0 12px',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Get In Touch
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '48px', fontSize: '16px' }}>
            Have questions? We'd love to hear from you.
          </p>

          <div style={{
            background: 'white', borderRadius: '24px',
            padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input placeholder="Your Name" style={{
                padding: '14px 16px', border: '2px solid #e5e7eb',
                borderRadius: '12px', fontSize: '15px', outline: 'none',
              }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
              <input placeholder="Your Email" type="email" style={{
                padding: '14px 16px', border: '2px solid #e5e7eb',
                borderRadius: '12px', fontSize: '15px', outline: 'none',
              }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
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
                boxShadow: '0 4px 15px rgba(124,58,237,0.3)',
              }}>
                Send Message ✉️
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '32px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                <Mail size={18} color="#7c3aed" />
                <span>hello@wandershare.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                <Phone size={18} color="#7c3aed" />
                <span>+1 (555) 000-0000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div style={{
        background: '#1e1b4b', padding: '40px 20px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>
          🌍 WanderShare
        </div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
          © 2026 WanderShare. All rights reserved. Made with ❤️ for travelers.
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-10px); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>
    </div>
  );
}