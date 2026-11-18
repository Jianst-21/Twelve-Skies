# Base Rules & Technical Architecture — Twelve Skies

## 1. Struktur Direktori Proyek (Next.js App Router + Prisma)
```text
prisma/
└── schema.prisma                # Skema database Prisma ORM (PostgreSQL Supabase)
src/
├── app/
│   ├── api/
│   │   └── memories/
│   │       ├── route.ts         # GET & POST memories via Prisma
│   │       └── [id]/route.ts    # PATCH & DELETE memory via Prisma
│   ├── page.tsx                 # Landing Page publik
│   ├── login/page.tsx           # Halaman Login privat
│   ├── sky/page.tsx             # Halaman utama eksplorasi 3D (Protected Route)
│   └── layout.tsx               # Root layout & font configuration
├── components/
│   ├── canvas/                  # Komponen Three.js / React Three Fiber
│   │   ├── SpaceDome.tsx        # Latar bintang latar belakang 360°
│   │   ├── Constellation.tsx    # Render garis & kumpulan node per rasi
│   │   └── StarNode.tsx         # Bintang 4-sudut + animasi radial hover
│   ├── ui/                      # Komponen UI 2D (Overlay)
│   │   ├── Navbar.tsx           # Navbar kapsul minimalis
│   │   ├── BottomPagination.tsx # Navigasi < Prev | Rasi | Next >
│   │   ├── NodeSplitPanel.tsx   # Panel kanan (Slideshow + Scroll cerita)
│   │   └── UploadPhotoModal.tsx # Modal tambah/edit foto
├── data/
│   └── constellations.ts        # Koordinat 3D, jumlah node, periode, & warna 12 rasi
├── lib/
│   ├── prisma.ts                # Singleton Prisma Client instance
│   ├── dateDistributor.ts       # Fungsi algoritma pembagian tanggal ke node
│   └── supabase/                # Client, Server, & Middleware (KHUSUS Auth & Storage)
└── types/
    └── index.ts                 # TypeScript interfaces
```

## 2. Arsitektur Database & Storage (Strict Prisma-Only DB Layer)
- **Aturan Wajib Prisma-Only:** Seluruh pembacaan dan penulisan data ke database PostgreSQL Supabase (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) **HARUS** melewati **Prisma ORM** di sisi server (Next.js API Route Handlers atau Server Actions). **DILARANG KERAS** menggunakan `supabase.from('memories')` secara langsung dari client maupun server.
- **Alur Mutasi Data (Create / Update / Delete):**
  1. Client mengunggah file gambar ke Supabase Storage (`supabase.storage.from('sky-memories').upload(...)`) untuk mendapatkan `imageUrl`.
  2. Client mengirim payload metadata (`imageUrl`, `memoryDate`, `location`, `caption`) ke endpoint Next.js `/api/memories`.
  3. Server memverifikasi sesi pengguna lewat `supabase.auth.getUser()`, lalu mengeksekusi injeksi database melalui `prisma.memory.create(...)` dengan `userId: user.id`.
- **Koneksi Database:** Menggunakan `DATABASE_URL` (Transaction Pooler port `6543` dengan `?pgbouncer=true`) dan `DIRECT_URL` (Session port `5432`) dari Supabase PostgreSQL untuk migrasi Prisma (`npx prisma migrate dev`).

## 3. Aturan Logika Bisnis (Core Rules)
1. **Single Source of Truth untuk Mapping Tanggal:**
   - Fungsi `getConstellationAndNode(date: Date)` wajib menjadi satu-satunya penentu lokasi foto.
   - Setiap kali pengguna memilih tanggal di `UploadPhotoModal`, fungsi ini langsung menghitung rasi bintang dan rentang tanggal tiap node menggunakan rumus `base = Math.floor(totalDays / nodeCount)` dan `remainder = totalDays % nodeCount`, di mana node `0` sampai `remainder - 1` mendapat `base + 1` hari.
2. **Optimasi Performa 3D & Gambar:**
   - Gambar yang diunggah wajib dikompresi di sisi klien (maksimal lebar `1920px`, kualitas `82%`, format WebP/JPEG) sebelum di-upload ke Supabase Storage.
3. **Aturan Coding & Prisma:**
   - Selalu gunakan *singleton* `prisma` dari `src/lib/prisma.ts` agar tidak terjadi kebocoran koneksi (*too many clients*) saat *hot-reload* di mode development.
   - Gunakan TypeScript *strict mode* dan manfaatkan tipe otomatis yang dihasilkan oleh `@prisma/client`.

## 4. Aturan Git Commit & Push
- **Bahasa:** Seluruh pesan commit wajib menggunakan bahasa Inggris.
- **Singkat & Garis Besar:** Pesan commit harus singkat dan bersifat umum (jangan terlalu detail atau panjang).
- **Format:**
  - `feat: add feature`
  - `fix: bug fixes`
  - `update: ui improvements`
  - `refactor: clean up`
  - `chore: update config`
