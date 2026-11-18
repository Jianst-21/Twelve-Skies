# Development Roadmap & Task Checklist — Twelve Skies

## Fase 1: Setup Proyek, Prisma & Infrastruktur
- [x] Inisialisasi proyek Next.js (TypeScript, Tailwind CSS, App Router).
- [x] Instalasi dependensi utama: `prisma`, `@prisma/client`, `@supabase/supabase-js`, `@supabase/ssr`, `three`, `@types/three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`, `lucide-react`.
- [x] Konfigurasi `prisma/schema.prisma`, `.env.example`, dan `.env.local` dengan API key Supabase resmi.
- [x] Buat `src/lib/prisma.ts` (Prisma Client Singleton) dan setup storage bucket `sky-memories` di Supabase.
- [x] Konfigurasi font (`Titillium Web` & `Inter`) serta variabel warna dasar di `globals.css` & `layout.tsx`.

## Fase 2: Data Rasi Bintang & Algoritma Distribusi Tanggal
- [x] Buat file `src/data/constellations.ts` berisi data lengkap 12 rasi zodiak (nama, rentang tanggal, warna hex glow, jumlah node, dan koordinat 3D titik bintang beserta garis penghubungnya).
- [x] Buat dan uji unit logika `src/lib/dateDistributor.ts` untuk memastikan pembagian hari ke node (termasuk kasus sisa hari seperti `22 hari / 5 node -> 5, 5, 4, 4, 4`) berjalan 100% akurat untuk seluruh 12 rasi.

## Fase 3: Autentikasi, API Routes & Landing Page
- [x] Bangun halaman publik `src/app/page.tsx` (Landing Page bertema antariksa *Neowise-inspired* dengan latar bintang halus, preview 12 rasi zodiak, dan tombol masuk).
- [x] Bangun halaman `src/app/login/page.tsx` dan integrasikan Supabase Auth (Login & Register dengan glassmorphic UI).
- [x] Implementasikan Next.js Proxy/Middleware untuk melindungi rute `/sky` dan `/api/memories` agar hanya dapat diakses setelah login.
- [x] Buat API Routes (`src/app/api/memories/route.ts` dan `[id]/route.ts`) menggunakan Prisma ORM untuk operasi CRUD foto tervalidasi `userId`.

## Fase 4: Kanvas Eksplorasi Antariksa 3D
- [x] Buat `SpaceDome.tsx` untuk latar belakang langit malam 360° dan rotasi kosmik halus.
- [x] Buat `StarNode.tsx` dengan bentuk bintang lancip 4 sudut (*4-point sparkle star*) dan animasi radial *scale-up* foto saat di-*hover*.
- [x] Buat `Constellation.tsx` untuk menggabungkan node dan garis penghubung, lengkap dengan efek *hover* menyala satu rasi penuh + label nama rasi.
- [x] Buat `SkyCanvas.tsx` dengan kontrol kamera orbit dan animasi kamera *smooth fly-to* saat rasi/node diklik atau dipindahkan lewat `BottomPagination.tsx`.

## Fase 5: Split-View Panel & Fitur Tambah Foto
- [x] Bangun `Navbar.tsx` minimalis pasca-login (Logo, tombol `+ Tambah Foto`, `Reset Langit`, dan `Logout`).
- [x] Bangun `NodeSplitPanel.tsx`: transisi kanvas 3D bergeser ke kiri (zoom ke node terpilih) dan panel kanan terbuka menampilkan **Slideshow Foto** serta **Daftar Scroll** (foto, tanggal, lokasi, cerita).
- [x] Bangun `UploadPhotoModal.tsx` dengan kompresi gambar otomatis, *date picker* yang menampilkan pratinjau rasi & node tujuan secara *real-time*, serta integrasi upload ke Supabase Storage + simpan metadata via Prisma API.
- [x] Tambahkan fitur Edit Cerita/Lokasi dan Hapus Foto di dalam `NodeSplitPanel.tsx`.

## Fase 6: Testing & Deployment
- [x] Uji build kompilasi TypeScript dan static page optimization Next.js (Lulus 100%).
- [ ] Masukkan password database PostgreSQL Supabase pada `.env.local` dan jalankan `npx prisma db push`.
- [ ] Uji jalankan development server `npm run dev` dan interaksi di browser.
