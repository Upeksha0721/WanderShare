'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { MapPin, DollarSign, User, Heart, ArrowLeft, Edit, Trash2, Clock, Share2, Bookmark } from 'lucide-react';

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    api.get(`/api/listings/${id}`)
      .then(res => setListing(res.data))
      .catch(() => toast.error('Listing not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    if (!user) { toast.error('Login to like!'); return; }
    setLiking(true);
    try {
      const { data } = await api.post(`/api/listings/${id}/like`);
      setListing(prev => ({ ...prev, likes: data.likes }));
    } catch { toast.error('Failed to like'); }
    finally { setLiking(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this listing?')) return;
    try {
      await api.delete(`/api/listings/${id}`);
      toast.success('Listing deleted');
      router.push('/');
    } catch { toast.error('Failed to delete'); }
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8faff' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }}>🌍</div>
        <p style={{ color: '#7c3aed', fontWeight: '700', fontSize: '18px' }}>Loading experience...</p>
      </div>
    </div>
  );

  if (!listing) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>😕</div>
        <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '16px' }}>Listing not found</p>
        <Link href="/" style={{
          background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
          color: 'white', padding: '12px 28px', borderRadius: '50px',
          textDecoration: 'none', fontWeight: '700',
        }}>Go Home</Link>
      </div>
    </div>
  );

  const isOwner = user?.id === listing.creatorId;
  const isLiked = user && listing.likes?.includes(user.id);

  return (
    <div style={{ margin: '0 -16px', background: '#f8faff', minHeight: '100vh' }}>

      {/* ── FULL WIDTH HERO ── */}
      <div style={{
        position: 'relative', height: '85vh', overflow: 'hidden',
      }}>
        {/* Parallax image */}
        <div style={{
          position: 'absolute', inset: '-20%',
          backgroundImage: `url(${listing.imageUrl})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          transform: `translateY(${scrollY * 0.3}px)`,
          transition: 'transform 0.1s linear',
        }}
          onError={() => {}}
        />

        {/* Multi-layer gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(30,27,75,0.3) 0%, transparent 30%, transparent 50%, rgba(30,27,75,0.95) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(30,27,75,0.4) 0%, transparent 60%)',
        }} />

        {/* Back button */}
        <button onClick={() => router.back()} style={{
          position: 'absolute', top: '24px', left: '24px',
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.25)',
          color: 'white', padding: '10px 20px', borderRadius: '50px',
          cursor: 'pointer', fontWeight: '700', fontSize: '14px',
          zIndex: 10,
        }}>
          <ArrowLeft size={16} /> Back
        </button>

        {/* Price badge */}
        {listing.price && (
          <div style={{
            position: 'absolute', top: '24px', right: '24px',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            color: '#1e1b4b', padding: '10px 24px', borderRadius: '50px',
            fontSize: '20px', fontWeight: '900',
            boxShadow: '0 8px 24px rgba(251,191,36,0.5)',
            zIndex: 10,
          }}>
            ${listing.price}
          </div>
        )}

        {/* Hero content bottom */}
        <div style={{
          position: 'absolute', bottom: '0', left: '0', right: '0',
          padding: '40px 40px 48px',
        }}>
          {/* Location pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.5)',
            color: '#fbbf24', padding: '6px 16px', borderRadius: '50px',
            fontSize: '13px', fontWeight: '700', marginBottom: '16px',
          }}>
            <MapPin size={13} /> {listing.location}
          </div>

          <h1 style={{
            color: 'white', fontSize: 'clamp(32px, 5vw, 60px)',
            fontWeight: '900', lineHeight: '1.1', marginBottom: '16px',
            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
          }}>
            {listing.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#1e1b4b', fontWeight: '800', fontSize: '16px',
                boxShadow: '0 4px 12px rgba(251,191,36,0.4)',
              }}>
                {listing.creatorName?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: '700', fontSize: '14px' }}>{listing.creatorName}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>{timeAgo(listing.createdAt)}</div>
              </div>
            </div>

            {/* Likes count */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white', padding: '8px 16px', borderRadius: '50px', fontSize: '14px', fontWeight: '600',
            }}>
              <Heart size={14} fill="white" /> {listing.likes?.length || 0} likes
            </div>
          </div>
        </div>
      </div>

      {/* ── FLOATING ACTION BAR ── */}
      <div style={{
        background: 'white',
        boxShadow: '0 4px 30px rgba(0,0,0,0.12)',
        padding: '16px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '12px', position: 'sticky', top: '64px', zIndex: 100,
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleLike} disabled={liking} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 22px', borderRadius: '50px', border: 'none',
            cursor: 'pointer', fontWeight: '700', fontSize: '14px',
            background: isLiked ? 'linear-gradient(135deg, #db2777, #be185d)' : '#f3f4f6',
            color: isLiked ? 'white' : '#374151',
            boxShadow: isLiked ? '0 4px 15px rgba(219,39,119,0.4)' : 'none',
            transition: 'all 0.3s',
          }}>
            <Heart size={16} fill={isLiked ? 'white' : 'none'} />
            {isLiked ? 'Liked!' : 'Like'} · {listing.likes?.length || 0}
          </button>

          <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 22px', borderRadius: '50px', border: 'none',
            cursor: 'pointer', fontWeight: '700', fontSize: '14px',
            background: '#f3f4f6', color: '#374151',
          }}>
            <Share2 size={16} /> Share
          </button>
        </div>

        {isOwner && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href={`/listings/${id}/edit`} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 22px', borderRadius: '50px',
              background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
              color: 'white', textDecoration: 'none',
              fontWeight: '700', fontSize: '14px',
              boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
            }}>
              <Edit size={14} /> Edit
            </Link>
            <button onClick={handleDelete} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 22px', borderRadius: '50px', border: 'none',
              cursor: 'pointer', fontWeight: '700', fontSize: '14px',
              background: '#fee2e2', color: '#dc2626',
            }}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* About section */}
        <div style={{
          background: 'white', borderRadius: '24px', padding: '40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '24px',
        }}>
          <h2 style={{
            fontSize: '24px', fontWeight: '800', color: '#1e1b4b',
            marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            🌟 About This Experience
          </h2>
          <p style={{ color: '#374151', fontSize: '16px', lineHeight: '1.9' }}>
            {listing.description}
          </p>
        </div>

        {/* Info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { icon: '📍', label: 'Location', value: listing.location, color: '#7c3aed', bg: '#f3e8ff' },
            { icon: '💰', label: 'Price', value: listing.price ? `$${listing.price}` : 'Free', color: '#d97706', bg: '#fef3c7' },
            { icon: '❤️', label: 'Likes', value: `${listing.likes?.length || 0} likes`, color: '#db2777', bg: '#fce7f3' },
            { icon: '🕐', label: 'Posted', value: timeAgo(listing.createdAt), color: '#4f46e5', bg: '#ede9fe' },
          ].map(({ icon, label, value, color, bg }) => (
            <div key={label} style={{
              background: 'white', borderRadius: '16px', padding: '20px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
              borderTop: `4px solid ${color}`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
              <div style={{ color: '#1e1b4b', fontWeight: '800', fontSize: '15px' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Creator card */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b, #4c1d95)',
          borderRadius: '24px', padding: '32px',
          display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#1e1b4b', fontWeight: '900', fontSize: '24px', flexShrink: 0,
          }}>
            {listing.creatorName?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fbbf24', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Experience Creator</div>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '20px', marginBottom: '4px' }}>{listing.creatorName}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Sharing authentic travel experiences 🌍</div>
          </div>
          <button onClick={handleLike} style={{
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            color: '#1e1b4b', padding: '12px 28px', borderRadius: '50px',
            border: 'none', cursor: 'pointer', fontWeight: '800', fontSize: '15px',
            boxShadow: '0 4px 15px rgba(251,191,36,0.4)',
          }}>
            {isLiked ? '❤️ Liked!' : '🤍 Like This'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}