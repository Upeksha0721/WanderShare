import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Clock, User, DollarSign } from 'lucide-react';

export default function ListingCard({ listing }) {
  return (
    <Link href={`/listings/${listing._id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        height: '100%',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
          <img
            src={listing.imageUrl}
            alt={listing.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=400'; }}
          />
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '80px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.4))',
          }} />
          {listing.price && (
            <div style={{
              position: 'absolute', top: '12px', right: '12px',
              background: 'linear-gradient(135deg, #0f4c35, #1a7a52)',
              color: 'white', padding: '4px 12px',
              borderRadius: '20px', fontSize: '13px', fontWeight: '700',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
              ${listing.price}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '16px' }}>
          <h3 style={{
            fontSize: '17px', fontWeight: '700', color: '#1a202c',
            marginBottom: '6px', overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {listing.title}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1a7a52', fontSize: '13px', marginBottom: '8px' }}>
            <MapPin size={13} />
            <span style={{ fontWeight: '600' }}>{listing.location}</span>
          </div>

          <p style={{
            fontSize: '13px', color: '#6b7280', lineHeight: '1.5',
            marginBottom: '12px',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {listing.description}
          </p>

          {/* Footer */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingTop: '10px', borderTop: '1px solid #f3f4f6',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9ca3af', fontSize: '12px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #0f4c35, #4ade80)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '11px', fontWeight: '700',
              }}>
                {listing.creatorName[0].toUpperCase()}
              </div>
              <span style={{ color: '#4b5563', fontWeight: '500' }}>{listing.creatorName}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#9ca3af', fontSize: '11px' }}>
              <Clock size={11} />
              {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}