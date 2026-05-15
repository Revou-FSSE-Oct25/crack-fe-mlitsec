'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { api, getErrorMessage } from '@/lib/api';
import { requireRole } from '@/lib/auth';
import { formatPrice } from '@/lib/format';
import type { Barber, Service } from '@/lib/types';

type BookingForm = {
  bookingDate: string;
  serviceId: string;
  barberId: string;
  customerNote?: string;
};

export default function BookingPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState } = useForm<BookingForm>();

  useEffect(() => {
    const user = requireRole('customer');
    if (!user) return;

    async function loadData() {
      try {
        const [servicesResponse, barbersResponse] = await Promise.all([
          api.get<Service[]>('/services'),
          api.get<Barber[]>('/barbers'),
        ]);

        setServices(servicesResponse.data);
        setBarbers(barbersResponse.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function onSubmit(data: BookingForm) {
    setError('');
    setMessage('');

    try {
      await api.post('/bookings', {
        bookingDate: new Date(data.bookingDate).toISOString(),
        serviceId: Number(data.serviceId),
        barberId: Number(data.barberId),
        customerNote: data.customerNote,
      });

      setMessage('Booking berhasil dibuat.');
      reset();
      router.refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase text-leaf">Customer</p>
        <h1 className="text-3xl font-bold">Buat Booking</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="grid gap-4 md:grid-cols-2">
          {loading ? (
            <Card>
              <p className="text-sm text-[#5b6b63]">Memuat services dan barbers...</p>
            </Card>
          ) : null}
          {services.map((service) => (
            <Card key={service.id}>
              <h2 className="font-bold">{service.name}</h2>
              <p className="mt-2 text-sm text-[#5b6b63]">{service.description}</p>
              <p className="mt-3 text-sm font-semibold text-leaf">
                {formatPrice(service.price)} - {service.duration} menit
              </p>
            </Card>
          ))}
        </div>

        <Card>
          <h2 className="text-xl font-bold">Form Booking</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <Input
              label="Tanggal dan Jam"
              type="datetime-local"
              {...register('bookingDate', { required: true })}
            />

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Service</span>
              <select
                className="w-full rounded-md border border-[#cbd8cf] bg-white px-3 py-2 text-sm outline-none focus:border-leaf focus:ring-2 focus:ring-leaf/20"
                {...register('serviceId', { required: true })}
              >
                <option value="">Pilih service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Barber</span>
              <select
                className="w-full rounded-md border border-[#cbd8cf] bg-white px-3 py-2 text-sm outline-none focus:border-leaf focus:ring-2 focus:ring-leaf/20"
                {...register('barberId', { required: true })}
              >
                <option value="">Pilih barber</option>
                {barbers.map((barber) => (
                  <option key={barber.id} value={barber.id}>
                    {barber.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Catatan</span>
              <textarea
                className="min-h-24 w-full rounded-md border border-[#cbd8cf] bg-white px-3 py-2 text-sm outline-none focus:border-leaf focus:ring-2 focus:ring-leaf/20"
                placeholder="Opsional"
                {...register('customerNote')}
              />
            </label>

            {message ? <p className="text-sm text-leaf">{message}</p> : null}
            {error ? <p className="text-sm text-clay">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? 'Menyimpan...' : 'Buat Booking'}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
