# Design System & UI/UX Specification — Twelve Skies

## 1. Filosofi Visual
Menggabungkan atmosfer antariksa gelap yang mendalam (*Deep Space Black* dan *Midnight Navy* dari referensi Neowise) dengan panel antarmuka *translucent glassmorphism*, tipografi geometris modern (*Titillium Web* & *Inter*), dan kilau bintang tajam berbentuk *4-point sparkle star*.

---

## 2. Palet Warna Dasar (Global Theme — Mengadopsi Warna Neowise)
- **Primary Space Canvas (Background Utama):** `#000000` (Space Black) dengan gradasi radial halus menuju `#03045E` (Midnight Navy).
- **Glassmorphism Surface (Navbar, Modal, Panel Kanan):** `rgba(3, 4, 94, 0.45)` dengan `backdrop-filter: blur(16px)` dan border tipis `1px solid rgba(124, 222, 228, 0.31)` (Cyan Glow).
- **Primary Text:** `#FFFFFF` (Pure Cosmic White) untuk judul dan teks kontras tinggi.
- **Secondary / Muted Text:** `#A0AEC0` (Nebula Silver/Grey) untuk tanggal dan teks pendukung.
- **Default UI Accent / CTA:** `#7CDEE4` (Electric Cyan) dengan teks tombol gelap `#03045E` untuk kontras maksimal.
- **Star Accent / Highlight:** `#FEC42D` (Stellar Amber/Gold) untuk tanda bintang istimewa atau badge favorit.

---

## 3. Palet Warna Khusus 12 Rasi Bintang (Harmonis dengan Background Gelap)
Setiap rasi memiliki warna *glow* garis dan bintang yang terinspirasi dari elemen/karakter rasi namun dijaga pada saturasi luminous gelap agar tidak bertabrakan dengan latar `#000000` & `#03045E`:

| No | Rasi Bintang | Periode | Nuansa / Inspirasi | Hex Glow Utama | Hex Garis Rasi (Opacity 45%) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Capricorn** | 22 Des – 19 Jan | Zamrud Pegunungan Malam | `#34D399` | `rgba(52, 211, 153, 0.45)` |
| 2 | **Aquarius** | 20 Jan – 18 Feb | Biru Arus Samudra Elektrik | `#38BDF8` | `rgba(56, 189, 248, 0.45)` |
| 3 | **Pisces** | 19 Feb – 20 Mar | Teal Laguna & Cahaya Bulan | `#2DD4BF` | `rgba(45, 212, 191, 0.45)` |
| 4 | **Aries** | 21 Mar – 19 Apr | Merah Bara Kosmik (*Crimson*) | `#FB7185` | `rgba(251, 113, 133, 0.45)` |
| 5 | **Taurus** | 20 Apr – 20 Mei | Hijau Giok & Emas Bumi | `#A3E635` | `rgba(163, 230, 53, 0.45)` |
| 6 | **Gemini** | 21 Mei – 20 Jun | Kuning Cahaya Kembar (*Amber*) | `#FACC15` | `rgba(250, 204, 21, 0.45)` |
| 7 | **Cancer** | 21 Jun – 22 Jul | Perak Mutiara Laut | `#CBD5E1` | `rgba(203, 213, 225, 0.50)` |
| 8 | **Leo** | 23 Jul – 22 Agu | Emas Matahari (*Solar Gold*) | `#F59E0B` | `rgba(245, 158, 11, 0.45)` |
| 9 | **Virgo** | 23 Agu – 22 Sep | Hijau Sage & Kristal | `#6EE7B7` | `rgba(110, 231, 183, 0.45)` |
| 10 | **Libra** | 23 Sep – 22 Okt | Rose Quartz Senja | `#F472B6` | `rgba(244, 114, 182, 0.45)` |
| 11 | **Scorpio** | 23 Okt – 21 Nov | Ungu Nebula Dalam (*Violet*) | `#A78BFA` | `rgba(167, 139, 250, 0.45)` |
| 12 | **Sagittarius** | 22 Nov – 21 Des | Indigo & Jingga Api Panah | `#818CF8` | `rgba(129, 140, 248, 0.45)` |

---

## 4. Tipografi
- **Font Display / Judul:** `Titillium Web` (Google Font — Bold/SemiBold, tracking sedikit renggang `+0.05em` atau `tracking-wider` untuk judul rasi).
- **Font Body / Cerita:** `Inter` atau `Roboto` (Regular 400 / Medium 500, line-height `1.6` agar cerita kenangan nyaman dibaca).

---

## 5. Komponen & Animasi Kunci (Spesifikasi Asli Twelve Skies)
1. **Navbar Minimalis (Post-Login):**
   - Tinggi `64px`, melayang (*floating*) di atas dengan jarak `16px`, berbentuk kapsul membulat (`rounded-full`).
   - Latar: `backdrop-blur-md bg-space-navy-glass border border-cyan-glow-30`.
   - Isi: Kiri = Logo *Twelve Skies*; Kanan = Tombol `[ + Tambah Foto ]`, Tombol `[ Reset Langit ]`, dan Avatar/Logout.
2. **Node Bintang (4-Pointed Sparkle Star):**
   - Terdiri dari inti cahaya putih terang di tengah dengan 4 pendaran lancip horizontal-vertikal dan halo warna rasi di belakangnya.
   - **Hover State:** Foto *thumbnail* muncul membesar dari `scale(0)` di titik pusat bintang menuju `scale(1)` berbentuk lingkaran bercahaya berdiameter `76px` (`duration: 280ms`, `cubic-bezier(0.22, 1, 0.36, 1)`).
3. **Layout Split-View (Saat Node Diklik):**
   - Transisi halus: Rasi bergeser ke sisi kiri layar (55% lebar), sementara panel kanan (45% lebar) meluncur masuk dari kanan (`slide-in`).
   - Bagian atas panel kanan berisi **Carousel / Slideshow** foto dalam node tersebut; bagian bawah berisi **Timeline Scrollable Cards** menampilkan detail foto, tanggal, badge lokasi, dan cerita.
