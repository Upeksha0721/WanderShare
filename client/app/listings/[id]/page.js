'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { MapPin, DollarSign, User, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    api.get(`/api/listings/${id}`)
      .then(res => {
        setListing(res.data);
        setLikes(res.data.likes.length);
        if (user) setLiked(res.data.likes.includes(user.id));
      })
      .catch(() => toast.error('Listing not found'))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleDelete = async () => {
    if (!confirm('Delete this listing?')) return;
    try {
      await api.delete(`/api/listings/${id}`);
      toast.success('Listing deleted');
      router.push('/');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleLike = async () => {
    if (!user) { toast.error('Login to like'); return; }
    try {
      const { data } = await api.post(`/api/listings/${id}/like`);
      setLikes(data.likes);
      setLiked(data.liked);
    } catch {
      toast.error('Failed to like');
    }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto mt-8 animate-pulse">
      <div className="bg-gray-100 h-96 rounded-2xl mb-6" />
      <div className="bg-gray-100 h-8 rounded mb-4" />
      <div className="bg-gray-100 h-4 rounded mb-2" />
    </div>
  );

  if (!listing) return (
    <p className="text-center text-gray-400 mt-20">Listing not found</p>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <img src={listing.imageUrl} alt={listing.title}
        className="w-full h-96 object-cover rounded-2xl mb-6"
        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800'; }}
      />
      <div className="bg-white rounded-2xl shadow p-8">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{listing.title}</h1>
          <button onClick={handleLike}
            className={`flex items-center gap-1 px-4 py-2 rounded-full border transition ${liked ? 'bg-red-50 border-red-300 text-red-500' : 'hover:bg-gray-50'}`}>
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
            <span>{likes}</span>
          </button>
        </div>

        <div className="flex items-center gap-4 text-gray-500 mb-6">
          <span className="flex items-center gap-1"><MapPin size={16} />{listing.location}</span>
          {listing.price && (
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <DollarSign size={16} />{listing.price}
            </span>
          )}
          <span className="flex items-center gap-1"><User size={16} />{listing.creatorName}</span>
        </div>

        <p className="text-gray-600 leading-relaxed mb-6">{listing.description}</p>

        {user && user.id === listing.creatorId && (
          <div className="flex gap-3 pt-6 border-t">
            <button onClick={() => router.push(`/listings/${id}/edit`)}
              className="bg-emerald-600 text-white px-6 py-2 rounded-xl hover:bg-emerald-700 transition">
              Edit
            </button>
            <button onClick={handleDelete}
              className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}