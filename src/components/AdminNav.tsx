import Link from 'next/link';

export function AdminNav() {
  return (
    <div className="mb-6 flex flex-wrap gap-3 text-sm">
      <Link className="rounded-md border border-[#d8e3dc] px-3 py-2 hover:bg-mist" href="/admin">
        Dashboard
      </Link>
      <Link className="rounded-md border border-[#d8e3dc] px-3 py-2 hover:bg-mist" href="/admin/services">
        Services
      </Link>
      <Link className="rounded-md border border-[#d8e3dc] px-3 py-2 hover:bg-mist" href="/admin/barbers">
        Barbers
      </Link>
      <Link className="rounded-md border border-[#d8e3dc] px-3 py-2 hover:bg-mist" href="/admin/bookings">
        Bookings
      </Link>
    </div>
  );
}
