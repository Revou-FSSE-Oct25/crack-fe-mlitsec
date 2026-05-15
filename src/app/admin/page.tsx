'use client';

import { useEffect, useState } from 'react';
import { AdminNav } from '@/components/AdminNav';
import { Card } from '@/components/Card';
import { api, getErrorMessage } from '@/lib/api';
import { requireRole } from '@/lib/auth';
import type { Barber, Booking, Service } from '@/lib/types';

export default function AdminDashboardPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = requireRole('admin');
    if (!user) return;

    async function loadData() {
      try {
        const [servicesResponse, barbersResponse, bookingsResponse] = await Promise.all([
          api.get<Service[]>('/services'),
          api.get<Barber[]>('/barbers'),
          api.get<Booking[]>('/bookings'),
        ]);

        setServices(servicesResponse.data);
        setBarbers(barbersResponse.data);
        setBookings(bookingsResponse.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-sm font-semibold uppercase text-leaf">Admin</p>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <AdminNav />

      {loading ? <p className="mb-4 text-sm text-[#5b6b63]">Memuat dashboard...</p> : null}
      {error ? <p className="mb-4 text-sm text-clay">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-[#5b6b63]">Total Services</p>
          <p className="mt-2 text-3xl font-bold">{services.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-[#5b6b63]">Total Barbers</p>
          <p className="mt-2 text-3xl font-bold">{barbers.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-[#5b6b63]">Total Bookings</p>
          <p className="mt-2 text-3xl font-bold">{bookings.length}</p>
        </Card>
      </div>
    </section>
  );
}
