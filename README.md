# Twelve Skies

Twelve Skies adalah aplikasi galeri foto pribadi interaktif berbasis ruang antariksa 3D. Aplikasi ini mengarsipkan kenangan pengguna ke dalam kubah langit 12 rasi bintang zodiak secara otomatis berdasarkan tanggal pengambilan foto.

---

## Daftar Isi
- [Ringkasan Proyek](#ringkasan-proyek)
- [Fitur Utama](#fitur-utama)
- [Algoritma Distribusi Tanggal](#algoritma-distribusi-tanggal)
- [Tech Stack](#tech-stack)
- [Struktur Direktori](#struktur-direktori)
- [Sistem Desain Visual](#sistem-desain-visual)
- [Panduan Instalasi & Penggunaan](#panduan-instalasi--penggunaan)
- [Konfigurasi Environment Variables](#konfigurasi-environment-variables)
- [Skrip yang Tersedia](#skrip-yang-tersedia)
- [Lisensi](#lisensi)

---

## Ringkasan Proyek
Twelve Skies mengubah konsep galeri foto konvensional menjadi pengalaman visual kubah langit malam 360 derajat. Pengguna dapat menjelajahi 12 rasi zodiak, mengarahkan kursor ke titik-titik bintang untuk melihat pratinjau foto secara radial, dan membuka panel Split-View untuk menikmati slideshow serta catatan cerita momen masa lalu.

---

## Fitur Utama

### 1. Eksplorasi Langit 3D (360-Degree Stargazing Canvas)
- Kanvas 3D penuh menggunakan Three.js dan React Three Fiber.
- Kontrol kamera bebas (orbit, drag, dan zoom).
- Efek hover pada rasi bintang yang menyalakan seluruh struktur garis dan titik bintang sesuai warna karakteristik rasi.
- Animasi perpindahan kamera halus (smooth fly-to) saat rasi atau node bintang dipilih.
- Navigasi cepat antar ke-12 rasi melalui Pagination Bar di bagian bawah layar.

### 2. Node Bintang Interaktif (4-Point Sparkle Star)
- Titik bintang berbentuk bintang 4 sudut tajam dengan inti cahaya putih dan pendaran warna rasi.
- Animasi radial scale-up: Saat kursor diarahkan ke node, lingkaran thumbnail foto terbaru membesar dari titik tengah ke luar disertai informasi rentang tanggal dan jumlah foto.

### 3. Tampilan Split-View
- Panel kiri (55% layar): Kanvas 3D berfokus pada titik bintang yang dipilih.
- Panel kanan (45% layar): Panel glassmorphism memuat Slideshow Foto interaktif di bagian atas dan linimasa kartu kenangan yang dapat di-scroll di bagian bawah.
- Setiap memori menampilkan foto resolusi tinggi, tanggal momen, badge lokasi, dan cerita kenangan.
- Fitur edit cerita/lokasi dan hapus foto secara real-time.

### 4. Manajemen & Pengunggahan Foto
- Modal pengunggahan dengan kompresi gambar otomatis di sisi klien (maksimal lebar 1920px, format WebP/JPEG, kualitas 82%).
- Deteksi otomatis: Saat pengguna memilih tanggal, sistem langsung menampilkan pratinjau rasi bintang dan titik bintang tujuan secara langsung sebelum foto diunggah.
- Penyimpanan file di Supabase Storage dan metadata di PostgreSQL melalui Prisma ORM.

### 5. Keamanan & Autentikasi
- Autentikasi pengguna berbasis Supabase Auth (Email dan Kata Sandi).
- Proteksi rute `/sky` dan endpoint API `/api/memories` menggunakan Next.js Proxy/Middleware.
- Lapisan basis data privat: Pengguna hanya dapat membaca, mengubah, dan menghapus memori milik akunnya sendiri.

---

## Algoritma Distribusi Tanggal
Setiap rasi zodiak memiliki rentang hari tertentu (D) dan jumlah titik bintang (N). Untuk mencegah penumpukan foto dan memastikan seluruh tanggal terbagi rata tanpa celah:

- Basis hari per node: `B = floor(D / N)`
- Sisa hari: `R = D % N`
- Sebanyak `R` node pertama masing-masing mendapatkan `(B + 1)` hari, sedangkan `(N - R)` node sisanya mendapatkan `B` hari.

Contoh kasus (D = 22 hari, N = 5 node):
- `22 / 5 = 4` sisa `2`
- Distribusi alokasi hari: Node 1 (5 hari), Node 2 (5 hari), Node 3 (4 hari), Node 4 (4 hari), Node 5 (4 hari).

---

## Tech Stack

| Kategori | Teknologi |
| :--- | :--- |
| Framework | Next.js (App Router, Turbopack) |
| Bahasa | TypeScript |
| Grafis 3D | Three.js, React Three Fiber, React Three Drei |
| Styling | Tailwind CSS v4 |
| Database & ORM | Prisma ORM, PostgreSQL (Supabase) |
| Auth & Storage | Supabase Auth, Supabase Storage |
| Animasi & Ikon | Framer Motion, Lucide React |

---

## Struktur Direktori

```text
├── prisma/
│   └── schema.prisma            # Skema model basis data Prisma
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── memories/
│   │   │       ├── route.ts     # GET & POST memori via Prisma
│   │   │       └── [id]/
│   │   │           └── route.ts # PATCH & DELETE memori via Prisma
│   │   ├── login/
│   │   │   └── page.tsx         # Halaman autentikasi login & registrasi
│   │   ├── sky/
│   │   │   └── page.tsx         # Halaman utama kanvas 3D & Split-View
│   │   ├── globals.css          # Konfigurasi Tailwind CSS v4 & variabel tema
│   │   ├── layout.tsx           # Root layout dan konfigurasi font
│   │   └── page.tsx             # Landing Page publik
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── Constellation.tsx # Komponen rasi bintang 3D & garis penghubung
│   │   │   ├── SkyCanvas.tsx     # Kanvas utama Three.js & kontrol kamera
│   │   │   ├── SpaceDome.tsx     # Latar kubah bintang 360 derajat
│   │   │   └── StarNode.tsx      # Komponen node bintang 4 sudut & hover radial
│   │   └── ui/
│   │       ├── BottomPagination.tsx # Navigasi 12 rasi zodiak di bawah layar
│   │       ├── Navbar.tsx           # Navigasi kapsul melayang
│   │       ├── NodeSplitPanel.tsx   # Panel Split-View slideshow & timeline cerita
│   │       └── UploadPhotoModal.tsx # Modal upload foto dengan kompresi otomatis
│   ├── data/
│   │   └── constellations.ts    # Koordinat 3D, node, garis, dan warna 12 rasi
│   ├── lib/
│   │   ├── dateDistributor.ts   # Logika pemetaan tanggal ke rasi dan node
│   │   ├── prisma.ts            # Instance singleton Prisma Client
│   │   └── supabase/            # Klien Supabase browser, server, dan middleware
│   ├── proxy.ts                 # Proteksi rute sesi autentikasi Next.js
│   └── types/
│       └── index.ts             # Definisi tipe TypeScript
├── .env.example                 # Contoh template environment variables
├── package.json
├── tsconfig.json
└── README.md
```

---

## Sistem Desain Visual

Desain visual mengadopsi estetika ruang angkasa kosmik Neowise yang dipadukan dengan aksen modern:

- Canvas Void: `#000000` (Space Black)
- Deep Space: `#03045E` (Midnight Navy)
- Surface Glass: `rgba(3, 4, 94, 0.45)` dengan border `rgba(124, 222, 228, 0.31)`
- Primary Accent: `#7CDEE4` (Electric Cyan Glow)
- Secondary Accent: `#FEC42D` (Stellar Amber)
- Font Display: Titillium Web
- Font Body: Inter

---

## Panduan Instalasi & Penggunaan

### Prasyarat
- Node.js versi 20 atau lebih baru
- Akun Supabase (untuk database PostgreSQL, Auth, dan Storage)

### Langkah Pemasangan

1. Clone repositori ini:
```bash
git clone https://github.com/username/twelve-skies.git
cd twelve-skies
```

2. Pasang seluruh dependensi:
```bash
npm install
```

3. Salin file environment:
```bash
cp .env.example .env.local
cp .env.example .env
```

4. Konfigurasikan variabel lingkungan pada `.env.local` dan `.env` (lihat bagian konfigurasi di bawah).

5. Buat tabel database menggunakan Prisma:
```bash
npx prisma generate
npx prisma db push
```

6. Jalankan server pengembangan lokal:
```bash
npm run dev
```

7. Buka browser pada alamat `http://localhost:3000`.

---

## Konfigurasi Environment Variables

Isi variabel berikut pada file `.env.local` dan `.env`:

```env
# Koneksi Database PostgreSQL Supabase (Prisma ORM)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Kunci API Supabase (Auth & Storage)
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR_SERVICE_ROLE_KEY]"
```

Catatan:
- Pastikan bucket publik bernama `sky-memories` telah dibuat pada Supabase Storage Anda.

---

## Skrip yang Tersedia

| Perintah | Fungsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server pengembangan lokal (Next.js Turbopack) |
| `npm run build` | Melakukan kompilasi produksi dan optimasi static rendering |
| `npm run start` | Menjalankan server aplikasi hasil build produksi |
| `npm run lint` | Menjalankan audit linter kode ESLint |
| `npx prisma generate` | Menghasilkan TypeScript types untuk Prisma Client |
| `npx prisma db push` | Menyinkronkan skema Prisma ke database Supabase |

---

## Lisensi
Proyek ini dilisensikan di bawah lisensi MIT. Silakan merujuk ke file LICENSE untuk informasi selengkapnya.
