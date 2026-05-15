'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { api, getErrorMessage } from '@/lib/api';
import { requireRole } from '@/lib/auth';
import { formatDate, formatPrice } from '@/lib/format';
import type { Booking } from '@/lib/types';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = requireRole('customer');
    if (!user) return;

    async function loadBookings() {
      try {
        const response = await api.get<Booking[]>('/bookings/my-bookings');
        setBookings(response.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase text-leaf">Customer</p>
        <h1 className="text-3xl font-bold">My Bookings</h1>
      </div>

      {error ? <p className="mb-4 text-sm text-clay">{error}</p> : null}
      {loading ? (
        <Card>
          <p className="text-sm text-[#5b6b63]">Memuat booking...</p>
        </Card>
      ) : null}

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-bold">{booking.service.name}</h2>
                <p className="mt-1 text-sm text-[#5b6b63]">
                  {formatDate(booking.bookingDate)} dengan {booking.barber.name}
                </p>
                <p className="mt-1 text-sm text-[#5b6b63]">
                  {formatPrice(booking.service.price)}
                </p>
              </div>
              <span className="w-fit rounded-md bg-mist px-3 py-1 text-sm font-semibold text-leaf">
                {booking.status}
              </span>
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
