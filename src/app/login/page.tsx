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

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState } = useForm<LoginForm>();

  async function onSubmit(data: LoginForm) {
    setError('');

    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      saveAuth(response.data);
      router.push(response.data.user.role === 'admin' ? '/admin' : '/booking');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-14">
      <Card>
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-2 text-sm text-[#5b6b63]">
          Masuk sebagai customer atau admin.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input label="Email" type="email" {...register('email', { required: 'Email wajib diisi' })} />
          <Input label="Password" type="password" {...register('password', { required: 'Password wajib diisi' })} />

          {error ? <p className="text-sm text-clay">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? 'Memproses...' : 'Login'}
          </Button>
        </form>

        <p className="mt-4 text-sm text-[#5b6b63]">
          Belum punya akun?{' '}
          <Link href="/register" className="font-semibold text-leaf">
            Register
          </Link>
        </p>
      </Card>
    </section>
  );
}
