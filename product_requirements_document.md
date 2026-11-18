# Product Requirements Document (PRD) — Twelve Skies

## 1. Ringkasan Produk
- **Nama Produk:** Twelve Skies
- **Jenis Produk:** Aplikasi Web Galeri Foto Pribadi Berbasis Eksplorasi Rasi Bintang 3D
- **Tech Stack:** Next.js (App Router), Tailwind CSS, React Three Fiber / Three.js, Framer Motion, Prisma ORM, PostgreSQL (Supabase), Supabase Auth, Supabase Storage
- **Tujuan Utama:** Menyimpan, mengarsipkan, dan mengenang foto pribadi secara estetis melalui visualisasi ruang antariksa 3D interaktif yang mengelompokkan kenangan ke dalam 12 rasi bintang zodiak berdasarkan tanggal pengambilan foto.

## 2. Target Pengguna & Hak Akses
- **Pengguna Pribadi (Single/Private Owner):** Pemilik akun yang memiliki akses penuh untuk menjelajahi langit 3D, mengunggah foto, mengedit cerita/lokasi, dan menghapus foto.
- **Pengunjung Publik (Unauthenticated):** Hanya dapat melihat halaman *Landing Page* bertema kosmik dan halaman *Login*.

## 3. Fitur Utama & Spesifikasi Fungsional

### 3.1. Landing Page & Autentikasi
- **Landing Page:** Menampilkan hero section bertema antariksa (terinspirasi estetika *Neowise*), pengenalan singkat konsep *Twelve Skies*, pratinjau visual rasi bintang, dan tombol CTA menuju halaman login.
- **Sistem Login:** Autentikasi aman menggunakan Supabase Auth (Email & Password). Pengguna yang belum login tidak dapat mengakses rute `/sky` (kanvas utama).

### 3.2. Eksplorasi Langit 3D (360° Stargazing Canvas)
- **Navigasi 3D Bebas:** Pengguna berada di pusat kubah langit 3D dan dapat menggeser (*drag/orbit*) serta melakukan *zoom* untuk mencari 12 rasi bintang di seluruh penjuru langit.
- **Hover Rasi Bintang:** Ketika kursor diarahkan ke area salah satu rasi bintang, seluruh garis penghubung dan titik bintangnya akan menyala sesuai warna karakteristik rasi tersebut serta menampilkan label nama rasi dan periode bulannya.
- **Fokus Rasi (Klik Rasi) & Pagination Bawah:**
  - Mengklik salah satu rasi menggerakkan kamera secara mulus (*smooth fly-to*) mendekati rasi tersebut.
  - Di bagian bawah layar muncul **Pagination Bar** (`< Prev | Nama Rasi (Periode Tanggal) | Next >`) untuk berpindah antar ke-12 rasi secara cepat tanpa harus menggeser kanvas 3D secara manual.

### 3.3. Algoritma Pembagian Tanggal ke dalam Node Rasi Bintang
Setiap rasi bintang memiliki jumlah titik bintang utama (*node*) yang berbeda sesuai bentuk astronominya dan mencakup rentang hari tertentu (misal: 22 hari).
- **Rumus Distribusi Merata:**
  - Misalkan total hari pada rasi = $D$, dan jumlah node = $N$.
  - Basis hari per node: $B = \lfloor D / N \rfloor$
  - Sisa hari: $R = D \bmod N$
  - Sebanyak $R$ node pertama masing-masing mendapatkan $(B + 1)$ hari, sedangkan $(N - R)$ node sisanya mendapatkan $B$ hari.
  - **Contoh Kasus ($D = 22$ hari, $N = 5$ node):** $22 \div 5 = 4$ sisa $2$. Distribusi jumlah hari per node berurutan dari node ke-1 hingga ke-5 adalah: **`5, 5, 4, 4, 4`** hari.
- **Tujuan:** Memastikan seluruh rentang tanggal terbagi habis tanpa celah dan mencegah penumpukan foto di satu titik.

### 3.4. Interaksi Node Bintang (Hover & Split-View Detail)
- **Bentuk Node:** Bintang lancip 4 sudut (*4-point sparkle star*) bercahaya.
- **Animasi Hover Node:** Saat kursor diarahkan ke satu *node*, lingkaran pratinjau foto terbaru di *node* tersebut membesar dengan animasi *scale-up* dari titik tengah ke pinggir (*radial expand*), disertai tooltip singkat berisi rentang tanggal node dan jumlah foto.
- **Tampilan Split-View (Saat Node Diklik):**
  - **Panel Kiri (55% layar):** Kanvas rasi bintang melakukan *zoom-in* presisi ke *node* yang dipilih, tetap memperlihatkan struktur rasi di sekitarnya dengan efek *depth-of-field* halus.
  - **Panel Kanan (45% layar):** Panel *glassmorphism* yang memuat **Slideshow Foto** interaktif di bagian atas serta daftar foto yang dapat di-*scroll* di bagian bawah. Setiap item menampilkan foto resolusi penuh, **tanggal**, **lokasi**, dan **cerita singkat/caption**.

### 3.5. Manajemen Foto (Tambah, Edit, Hapus)
- **Akses Tambah Foto:**
  1. Tombol **`+ Tambah Foto`** di Navbar atas (selalu tersedia setelah login).
  2. Tombol **`+ Tambah Foto di Node Ini`** di dalam panel kanan *Split-View* (otomatis mengisi tanggal sesuai rentang *node* aktif).
- **Field Wajib & Opsional:**
  - File Foto (Wajib — JPG/PNG/WebP, dikompresi otomatis sebelum masuk Supabase Storage).
  - Tanggal Foto (Wajib — menampilkan *live preview* rasi dan nomor node tujuan).
  - Lokasi (Opsional/Direkomendasikan — teks lokasi kenangan).
  - Cerita Singkat / Caption (Wajib/Direkomendasikan — catatan momen di balik foto).