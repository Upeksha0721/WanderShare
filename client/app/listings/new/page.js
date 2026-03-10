'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '../../../lib/api';
import ListingForm from '../../components/ListingForm';
import { useAuth } from '../../../context/AuthContext';

export default function NewListing() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!user) { router.push('/login'); return null; }

  const handleSubmit = async (form) => {
    setLoading(true);
    try {
      await api.post('/api/listings', form);
      toast.success('Listing published! 🎉');
      router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <ListingForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}