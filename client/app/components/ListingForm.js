'use client';
import { useState } from 'react';
import { MapPin, Type, Image, FileText, DollarSign } from 'lucide-react';

export default function ListingForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    location: initial.location || '',
    imageUrl: initial.imageUrl || '',
    description: initial.description || '',
    price: initial.price || '',
  });

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const inputStyle = {
    width: '100%', padding: '13px 14px 13px 42px',
    border: '2px solid #e5e7eb', borderRadius: '12px',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s', background: '#fafafa',
  };

  const fields = [
    { key: 'title', placeholder: 'Experience Title *', icon: <Type size={16} />, type: 'text' },
    { key: 'location', placeholder: 'Location (e.g. Bali, Indonesia) *', icon: <MapPin size={16} />, type: 'text' },
    { key: 'imageUrl', placeholder: 'Image URL *', icon: <Image size={16} />, type: 'text' },
  ];

  return (
    <div style={{
      minHeight: '90vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px',
    }}>
      <div style={{
        background: 'white', borderRadius: '24px',
        padding: '48px 40px', width: '100%', maxWidth: '560px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: '28px',
          }}>
            🌍
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#1a202c', marginBottom: '6px' }}>
            {initial._id ? 'Edit Experience' : 'Create New Experience'}
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Share your amazing travel experience with the world
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {fields.map(({ key, placeholder, icon, type }) => (
            <div key={key} style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '14px', color: '#9ca3af' }}>
                {icon}
              </div>
              <input
                type={type} placeholder={placeholder}
                value={form[key]} onChange={set(key)}
                required={key !== 'price'}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          ))}

          {/* Image preview */}
          {form.imageUrl && (
            <div style={{ borderRadius: '12px', overflow: 'hidden', height: '180px' }}>
              <img src={form.imageUrl} alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          {/* Description */}
          <div style={{ position: 'relative' }}>
            <FileText size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#9ca3af' }} />
            <textarea
              placeholder="Description *"
              value={form.description} onChange={set('description')}
              required rows={4}
              style={{ ...inputStyle, padding: '13px 14px 13px 42px', resize: 'none' }}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Price */}
          <div style={{ position: 'relative' }}>
            <DollarSign size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#9ca3af' }} />
            <input
              type="number" placeholder="Price in USD (optional)"
              value={form.price} onChange={set('price')} min={0}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <button type="button" onClick={handleSubmit} disabled={loading} style={{
            background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
            color: 'white', padding: '15px', borderRadius: '12px',
            border: 'none', cursor: 'pointer', fontSize: '16px',
            fontWeight: '700', marginTop: '8px',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 4px 15px rgba(124,58,237,0.3)',
          }}>
            {loading ? 'Saving...' : initial._id ? '✅ Update Experience' : '🚀 Publish Experience'}
          </button>
        </div>
      </div>
    </div>
  );
}