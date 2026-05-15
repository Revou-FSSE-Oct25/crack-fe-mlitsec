'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { api, getErrorMessage } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import type { Barber, Service } from '@/lib/types';

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

  return (
    <>
      <section className="relative min-h-[520px] overflow-hidden bg-ink text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-55"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="relative mx-auto flex min-h-[520px] max-w-6xl flex-col justify-center px-4 py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#b9e5d3]">
            Simple booking system
          </p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-6xl">
            Barbershop Booking
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#eef4f0] md:text-lg">
            Pilih service, barber, dan jadwal. Semua data tersambung ke backend
            NestJS yang sudah kamu buat.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/booking">
              <Button>Booking Sekarang</Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" className="border-white bg-white/10 text-white hover:bg-white/20">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-leaf">Services</p>
            <h2 className="mt-1 text-2xl font-bold">Pilihan layanan</h2>
          </div>
          <Link href="/booking" className="text-sm font-semibold text-leaf">
            Buat booking
          </Link>
        </div>

        {loading ? (
          <Card>
            <p className="text-sm text-[#5b6b63]">Memuat data services...</p>
          </Card>
        ) : null}

        {error ? (
          <Card>
            <p className="text-sm text-clay">{error}</p>
          </Card>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id}>
              <h3 className="text-lg font-bold">{service.name}</h3>
              <p className="mt-2 min-h-12 text-sm text-[#5b6b63]">
                {service.description || 'Service barbershop'}
              </p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-semibold text-leaf">{formatPrice(service.price)}</span>
                <span>{service.duration} menit</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="barbers" className="bg-mist">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-sm font-semibold uppercase text-leaf">Barbers</p>
          <h2 className="mt-1 text-2xl font-bold">Tim barber</h2>
          {loading ? (
            <Card className="mt-6">
              <p className="text-sm text-[#5b6b63]">Memuat data barbers...</p>
            </Card>
          ) : null}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {barbers.map((barber) => (
              <Card key={barber.id}>
                <h3 className="text-lg font-bold">{barber.name}</h3>
                <p className="mt-2 text-sm text-[#5b6b63]">
                  {barber.phone || 'Nomor belum tersedia'}
                </p>
              </Card>
            ))}
          </div>
          {barbers.length === 0 && !loading && !error ? (
            <Card className="mt-6">
              <p className="text-sm text-[#5b6b63]">Belum ada barber.</p>
            </Card>
          ) : null}
        </div>
      </section>
    </>
  );
}
