'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AUTH_EVENT, getUser, logout } from '@/lib/auth';
import type { User } from '@/lib/types';

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    function syncUser() {
      setUser(getUser());
    }

    syncUser();
    window.addEventListener(AUTH_EVENT, syncUser);

    return () => {
      window.removeEventListener(AUTH_EVENT, syncUser);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-[#d8e3dc] bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="text-lg font-bold text-ink">
          Barbershop Booking
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link href="/#services" className="text-[#42524a] hover:text-leaf">
            Services
          </Link>
          <Link href="/#barbers" className="text-[#42524a] hover:text-leaf">
            Barbers
          </Link>
          <Link href="/booking" className="text-[#42524a] hover:text-leaf">
            Booking
          </Link>
          <Link href="/my-bookings" className="text-[#42524a] hover:text-leaf">
            My Bookings
          </Link>
          {user?.role === 'admin' ? (
            <Link href="/admin" className="text-[#42524a] hover:text-leaf">
              Admin
            </Link>
          ) : null}
          {user ? (
            <button
              onClick={logout}
              className="rounded-md border border-[#d8e3dc] px-3 py-2 text-[#42524a] hover:bg-mist"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="text-[#42524a] hover:text-leaf">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-leaf px-3 py-2 font-semibold text-white hover:bg-[#176346]"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
