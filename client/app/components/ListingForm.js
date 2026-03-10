'use client';
import { useState } from 'react';

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

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow">
      <h2 className="text-2xl font-bold">
        {initial._id ? 'Edit Listing' : 'Create New Experience'}
      </h2>
      <input
        placeholder="Experience Title *"
        value={form.title} onChange={set('title')} required
        className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
      />
      <input
        placeholder="Location (e.g. Bali, Indonesia) *"
        value={form.location} onChange={set('location')} required
        className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
      />
      <input
        placeholder="Image URL *"
        value={form.imageUrl} onChange={set('imageUrl')} required
        className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
      />
      {form.imageUrl && (
        <img src={form.imageUrl} alt="Preview"
          className="w-full h-48 object-cover rounded-xl" />
      )}
      <textarea
        placeholder="Description *"
        value={form.description} onChange={set('description')} required rows={4}
        className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
      />
      <input
        type="number" placeholder="Price (optional, in USD)"
        value={form.price} onChange={set('price')} min={0}
        className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
      />
      <button type="submit" disabled={loading}
        className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 font-medium disabled:opacity-60 transition">
        {loading ? 'Saving...' : initial._id ? 'Update Listing' : 'Publish Experience'}
      </button>
    </form>
  );
}