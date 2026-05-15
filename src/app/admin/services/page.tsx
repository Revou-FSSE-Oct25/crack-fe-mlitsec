'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AdminNav } from '@/components/AdminNav';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { api, getErrorMessage } from '@/lib/api';
import { requireRole } from '@/lib/auth';
import { formatPrice } from '@/lib/format';
import type { Service } from '@/lib/types';

type ServiceForm = {
  name: string;
  description?: string;
  price: string;
  duration: string;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState } = useForm<ServiceForm>();

  async function loadServices() {
    try {
      const response = await api.get<Service[]>('/services');
      setServices(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const user = requireRole('admin');
    if (!user) return;

    loadServices();
  }, []);

  async function onSubmit(data: ServiceForm) {
    setError('');

    const payload = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      duration: Number(data.duration),
    };

    try {
      if (editingId) {
        await api.patch(`/services/${editingId}`, payload);
      } else {
        await api.post('/services', payload);
      }

      reset();
      setEditingId(null);
      loadServices();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  function startEdit(service: Service) {
    setEditingId(service.id);
    reset({
      name: service.name,
      description: service.description || '',
      price: String(service.price),
      duration: String(service.duration),
    });
  }

  async function remove(id: number) {
    setError('');

    try {
      await api.delete(`/services/${id}`);
      loadServices();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-sm font-semibold uppercase text-leaf">Admin</p>
      <h1 className="mb-6 text-3xl font-bold">Manage Services</h1>
      <AdminNav />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Card>
          <h2 className="text-xl font-bold">{editingId ? 'Edit Service' : 'Tambah Service'}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <Input label="Nama" {...register('name', { required: true })} />
            <Input label="Deskripsi" {...register('description')} />
            <Input label="Harga" type="number" {...register('price', { required: true })} />
            <Input label="Durasi menit" type="number" {...register('duration', { required: true })} />
            {error ? <p className="text-sm text-clay">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
              {editingId ? 'Update' : 'Simpan'}
            </Button>
          </form>
        </Card>

        <div className="grid gap-4">
          {services.map((service) => (
            <Card key={service.id}>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-bold">{service.name}</h2>
                  <p className="text-sm text-[#5b6b63]">{service.description}</p>
                  <p className="mt-1 text-sm font-semibold text-leaf">
                    {formatPrice(service.price)} - {service.duration} menit
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => startEdit(service)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => remove(service.id)}>
                    Hapus
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {loading ? (
            <Card>
              <p className="text-sm text-[#5b6b63]">Memuat services...</p>
            </Card>
          ) : null}
          {services.length === 0 && !loading && !error ? (
            <Card>
              <p className="text-sm text-[#5b6b63]">Belum ada service.</p>
            </Card>
          ) : null}
        </div>
      </div>
    </section>
  );
}
