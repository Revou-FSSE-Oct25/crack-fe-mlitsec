# Barbershop Booking Frontend

Frontend sederhana untuk project CRACK Barbershop Booking System.

Project ini dibuat dengan:

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Hook Form
- Axios

## Fitur MVP

- Homepage dengan hero section
- Section services
- Section barbers
- Register customer
- Login customer/admin
- Booking service
- My bookings untuk customer
- Admin dashboard
- Admin manage services
- Admin manage barbers
- Admin manage bookings

## Struktur Folder

```txt
src
|-- app
|   |-- admin
|   |   |-- barbers
|   |   |-- bookings
|   |   `-- services
|   |-- booking
|   |-- login
|   |-- my-bookings
|   |-- register
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- components
|   |-- AdminNav.tsx
|   |-- Button.tsx
|   |-- Card.tsx
|   |-- Footer.tsx
|   |-- Input.tsx
|   `-- Navbar.tsx
`-- lib
    |-- api.ts
    |-- auth.ts
    |-- format.ts
    `-- types.ts
```

## Setup Project

### 1. Install Dependency

```bash
npm install
```

### 2. Setup Environment Variable

Buat file `.env.local` dari `.env.example`.

Isi:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Pastikan backend NestJS berjalan di port `3001`.

### 3. Jalankan Frontend

```bash
npm run dev
```

Frontend berjalan di:

```txt
http://localhost:3000
```

Backend tetap berjalan di `http://localhost:3001`.

### 4. Build Project

```bash
npm run build
```

## Akun Admin

Gunakan akun dari seed backend:

```txt
email: admin@barbershop.com
password: admin123
```

## Catatan Auth

Untuk MVP, token JWT disimpan sederhana di `localStorage`.

- Customer diarahkan ke halaman booking.
- Admin diarahkan ke halaman admin.
- Halaman customer/admin melakukan proteksi sederhana berdasarkan role user.

## Catatan Untuk Presentasi

Alur singkat:

1. User melihat services dan barbers di homepage.
2. User register atau login.
3. Customer membuat booking.
4. Customer melihat booking miliknya.
5. Admin login.
6. Admin mengelola services, barbers, dan status bookings.

## Deploy ke Vercel

1. Push project ke GitHub.
2. Import repository di Vercel.
3. Pilih root directory:

```txt
crack-fe-mlitsec
```

4. Isi environment variable:

```env
NEXT_PUBLIC_API_URL=https://backend-kamu.up.railway.app
```

5. Deploy dengan command default Vercel:

```txt
Build Command: npm run build
Output: .next
```

6. Setelah deploy frontend, copy URL Vercel dan masukkan ke environment backend:

```env
FRONTEND_URL=https://frontend-kamu.vercel.app
```

7. Redeploy backend agar CORS mengizinkan frontend production.
