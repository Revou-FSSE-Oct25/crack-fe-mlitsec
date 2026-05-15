'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { api, getErrorMessage } from '@/lib/api';
import { saveAuth } from '@/lib/auth';
import type { AuthResponse } from '@/lib/types';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState } = useForm<RegisterForm>();

  async function onSubmit(data: RegisterForm) {
    setError('');

    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      saveAuth(response.data);
      router.push('/booking');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-14">
      <Card>
        <h1 className="text-2xl font-bold">Register</h1>
        <p className="mt-2 text-sm text-[#5b6b63]">
          Buat akun customer untuk mulai booking.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input label="Nama" {...register('name', { required: 'Nama wajib diisi' })} />
          <Input label="Email" type="email" {...register('email', { required: 'Email wajib diisi' })} />
          <Input
            label="Password"
            type="password"
            {...register('password', { required: 'Password wajib diisi', minLength: 6 })}
          />

          {error ? <p className="text-sm text-clay">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? 'Memproses...' : 'Register'}
          </Button>
        </form>

        <p className="mt-4 text-sm text-[#5b6b63]">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-semibold text-leaf">
            Login
          </Link>
        </p>
      </Card>
    </section>
  );
}
