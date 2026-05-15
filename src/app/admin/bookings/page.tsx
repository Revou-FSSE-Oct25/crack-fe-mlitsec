'use client';

import { useEffect, useState } from 'react';
import { AdminNav } from '@/components/AdminNav';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { api, getErrorMessage } from '@/lib/api';
import { requireRole } from '@/lib/auth';
import { formatDate } from '@/lib/format';
import type { Booking, BookingStatus } from '@/lib/types';

const statuses: BookingStatus[] = ['pending', 'confirmed', 'cancelled', 'completed'];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function loadBookings() {
    try {
      const response = await api.get<Booking[]>('/bookings');
      setBookings(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const user = requireRole('admin');
    if (!user) return;

    loadBookings();
  }, []);

  async function updateStatus(id: number, status: BookingStatus) {
    setError('');
    setUpdatingId(id);

    try {
      await api.patch(`/bookings/${id}/status`, { status });
      loadBookings();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-sm font-semibold uppercase text-leaf">Admin</p>
      <h1 className="mb-6 text-3xl font-bold">Manage Bookings</h1>
      <AdminNav />

      {error ? <p className="mb-4 text-sm text-clay">{error}</p> : null}
      {loading ? (
        <Card>
          <p className="text-sm text-[#5b6b63]">Memuat semua booking...</p>
        </Card>
      ) : null}

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-bold">{booking.service.name}</h2>
                <p className="mt-1 text-sm text-[#5b6b63]">
                  Customer: {booking.user?.name || '-'} - Barber: {booking.barber.name}
                </p>
                <p className="mt-1 text-sm text-[#5b6b63]">
                  Jadwal: {formatDate(booking.bookingDate)}
                </p>
                <p className="mt-1 text-sm font-semibold text-leaf">Status: {booking.status}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <Button
                    key={status}
                    variant={status === booking.status ? 'primary' : 'secondary'}
                    onClick={() => updateStatus(booking.id, status)}
                    disabled={updatingId === booking.id}
                  >
                    {updatingId === booking.id ? 'Update...' : status}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {bookings.length === 0 && !loading && !error ? (
        <Card>
          <p className="text-sm text-[#5b6b63]">Belum ada booking.</p>
        </Card>
      ) : null}
    </section>
  );
}
