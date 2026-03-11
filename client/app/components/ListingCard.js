'use client';
import Link from 'next/link';
import { MapPin, Clock, Heart } from 'lucide-react';

export default function ListingCard({ listing }) {
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date);
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      cursor: 'pointer',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,58,237,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img
          src={listing.imageUrl}
          alt={listing.title}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&referrerPolicy=no-referrer'; }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.5))',
        }} />
        {/* Price badge */}
        {listing.price && (
          <div style={{
            position: 'absolute', top: '12px', right: '12px',
            background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
            color: 'white', padding: '4px 12px', borderRadius: '20px',
            fontSize: '13px', fontWeight: '700',
            boxShadow: '0 2px 10px rgba(124,58,237,0.4)',
          }}>
            ${listing.price}
          </div>
        )}
        {/* Likes badge */}
        <div style={{
          position: 'absolute', bottom: '12px', right: '12px',
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(8px)',
          color: 'white', padding: '4px 10px', borderRadius: '20px',
          fontSize: '12px', fontWeight: '600',
          display: 'flex', alignItems: 'center', gap: '4px',
          border: '1px solid rgba(255,255,255,0.3)',
        }}>
          <Heart size={12} fill="white" /> {listing.likes?.length || 0}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <h3 style={{
          fontSize: '17px', fontWeight: '800', color: '#1e1b4b',
          marginBottom: '6px', lineHeight: '1.3',
        }}>
          {listing.title}
        </h3>

        {/* Location */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          color: '#7c3aed', fontSize: '13px', fontWeight: '600', marginBottom: '8px',
        }}>
          <MapPin size={13} />
          {listing.location}
        </div>

        {/* Description */}
        <p style={{
          color: '#6b7280', fontSize: '13px', lineHeight: '1.6',
          marginBottom: '16px',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {listing.description}
        </p>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid #f3f4f6',
        }}>
          {/* Author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: '700', fontSize: '12px',
            }}>
              {listing.creatorName?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
              {listing.creatorName}
            </span>
          </div>

          {/* Time + View button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Clock size={11} /> {timeAgo(listing.createdAt)}
            </span>
            <Link href={`/listings/${listing._id}`} style={{
              background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
              color: 'white', padding: '5px 14px', borderRadius: '20px',
              textDecoration: 'none', fontSize: '12px', fontWeight: '700',
              boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
              whiteSpace: 'nowrap',
            }}>
              View →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}