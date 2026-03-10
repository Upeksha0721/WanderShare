'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '../../../../lib/api';
import ListingForm from '../../../components/ListingForm';
import { useAuth } from '../../../../context/AuthContext';

export default function EditListing() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/api/listings/${id}`)
      .then(res => {
        if (user && user.id !== res.data.creatorId) {
          toast.error('Unauthorized');
          router.push('/');
        }
        setListing(res.data);
      })
      .catch(() => router.push('/'));
  }, [id, user]);

  const handleSubmit = async (form) => {
    setLoading(true);
    try {
      await api.put(`/api/listings/${id}`, form);
      toast.success('Listing updated! ✅');
      router.push(`/listings/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  if (!listing) return (
    <div className="max-w-2xl mx-auto mt-8 animate-pulse">
      <div className="bg-gray-100 h-96 rounded-2xl" />
    </div>
  );

  return (
    <div className="mt-8">
      <ListingForm initial={listing} onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}