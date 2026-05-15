'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AdminNav } from '@/components/AdminNav';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { api, getErrorMessage } from '@/lib/api';
import { requireRole } from '@/lib/auth';
import type { Barber } from '@/lib/types';

type BarberForm = {
  name: string;
  phone?: string;
};

export default function AdminBarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState } = useForm<BarberForm>();

  async function loadBarbers() {
    try {
      const response = await api.get<Barber[]>('/barbers');
      setBarbers(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const user = requireRole('admin');
    if (!user) return;

    loadBarbers();
  }, []);

  async function onSubmit(data: BarberForm) {
    setError('');

    try {
      if (editingId) {
        await api.patch(`/barbers/${editingId}`, data);
      } else {
        await api.post('/barbers', data);
      }

      reset();
      setEditingId(null);
      loadBarbers();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  function startEdit(barber: Barber) {
    setEditingId(barber.id);
    reset({
      name: barber.name,
      phone: barber.phone || '',
    });
  }

  async function remove(id: number) {
    setError('');

    try {
      await api.delete(`/barbers/${id}`);
      loadBarbers();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-sm font-semibold uppercase text-leaf">Admin</p>
      <h1 className="mb-6 text-3xl font-bold">Manage Barbers</h1>
      <AdminNav />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Card>
          <h2 className="text-xl font-bold">{editingId ? 'Edit Barber' : 'Tambah Barber'}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <Input label="Nama" {...register('name', { required: true })} />
            <Input label="Telepon" {...register('phone')} />
            {error ? <p className="text-sm text-clay">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
              {editingId ? 'Update' : 'Simpan'}
            </Button>
          </form>
        </Card>

        <div className="grid gap-4">
          {barbers.map((barber) => (
            <Card key={barber.id}>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-bold">{barber.name}</h2>
                  <p className="text-sm text-[#5b6b63]">{barber.phone || 'Nomor belum tersedia'}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => startEdit(barber)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => remove(barber.id)}>
                    Hapus
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {loading ? (
            <Card>
              <p className="text-sm text-[#5b6b63]">Memuat barbers...</p>
            </Card>
          ) : null}
          {barbers.length === 0 && !loading && !error ? (
            <Card>
              <p className="text-sm text-[#5b6b63]">Belum ada barber.</p>
            </Card>
          ) : null}
        </div>
      </div>
    </section>
  );
}
