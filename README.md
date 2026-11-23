# Template Website Undangan Digital - Bootstrap 5 & Supabase

Template website undangan digital responsif berkonsep **Mobile-First** yang dibangun menggunakan **Bootstrap 5**, terintegrasi dengan database cloud **Supabase** (dengan fallback otomatis ke `localStorage`), serta dilengkapi fitur **Kustomisasi Musik** yang fleksibel.

---

## 🚀 Fitur Unggulan Sesuai Dokumen ASAS

1. **Cover / Sampul Undangan (Hero Cover Fullscreen)**
   - Mendukung nama tamu dinamis dari query database **Supabase** (`?code=TAMU01` atau `?id=...`) dan parameter URL langsung (`?to=Nama+Tamu`).
   - Tombol *"Buka Undangan"* membuka kunci scroll dengan animasi slide-up dan memutar musik latar otomatis.
2. **Informasi Acara & Countdown Timer**
   - Real-time countdown timer (Hari, Jam, Menit, Detik) menuju target waktu acara.
   - Tombol integrasi langsung *"Simpan ke Google Calendar"*.
3. **Navigasi Lokasi & Amplop Digital**
   - Responsive iframe Google Maps + tombol petunjuk arah lokasi.
   - Kartu rekening & alamat kado fisik dengan tombol *"Salin ke Clipboard"* yang memicu notifikasi visual **Bootstrap 5 Toast**.
4. **Galeri Foto & Scroll Animation**
   - Grid galeri foto dengan efek hover zoom, animasi scroll **AOS** (*Animate On Scroll*), dan fitur **Lightbox Modal** saat foto diklik.
5. **RSVP & Buku Tamu Real-time (Supabase + LocalStorage)**
   - Formulir konfirmasi kehadiran dan doa restu.
   - Tersimpan langsung ke database cloud **Supabase** secara real-time via `supabase_realtime`, dengan cadangan otomatis ke **`localStorage`** jika dalam kondisi offline atau belum dikonfigurasi.
6. **Pemutar Musik & Fitur Kustomisasi Lagu**
   - Floating audio toggle dengan ikon piringan/disc berputar.
   - Modal *"Ganti Lagu"* interaktif: pilih dari daftar playlist bawaan, input custom URL audio MP3, atau unggah audio lokal dari perangkat langsung di browser.
   - Konfigurasi permanen lagu default melalui berkas `js/config.js`.
7. **Desain Mobile-First**
   - Proporsional di layar HP (360px–414px) dan elegan di layar desktop berkat layout `.site-wrapper` (500px centered frame view).

---

## 🎵 Cara Mengustomisasi Lagu (Musik Latar)

Anda memiliki 3 cara mudah untuk mengganti lagu:

### Opsi 1: Lewat Berkas `js/config.js` (Rekomendasi Utama)
Buka [**`js/config.js`**](file:///c:/Users/ACER/Desktop/Ahmad%20Zakky%20Al%20Fitra%20-%20RPL%202/Website%20Job%20&%20Edu%20Fair/js/config.js), lalu ubah bagian `music`:
```javascript
music: {
  autoplay: true,
  defaultIndex: 0, // Pilih lagu default (0, 1, 2, dst.)
  playlist: [
    {
      id: "song-1",
      title: "Judul Lagu Anda",
      artist: "Nama Artis",
      src: "assets/audio/nama-file-lagu.mp3", // Atau link URL mp3 online
    },
    // ...
  ]
}
```

### Opsi 2: Menggunakan File Lokal Sendiri
1. Simpan berkas audio MP3 Anda ke dalam folder `assets/audio/` (misalnya: `wedding.mp3`).
2. Masukkan jalurnya pada `src: "assets/audio/wedding.mp3"` di `js/config.js`.

### Opsi 3: Langsung dari Tampilan Halaman (Interactive UI)
1. Buka website di browser.
2. Di pojok kanan bawah, klik tombol **"Ganti Lagu"** di atas tombol musik mengambang.
3. Pilih lagu dari playlist, tempel link audio MP3 kustom, atau pilih file langsung dari HP/Laptop Anda.

---

## 🗄️ Cara Menghubungkan ke Database Supabase

Jika Anda ingin mengaktifkan database Supabase (opsional, jika tidak diisi website otomatis tetap berfungsi menggunakan `localStorage`):

### 1. Buat Tabel di Supabase
1. Masuk ke [Supabase Dashboard](https://supabase.com).
2. Buat proyek baru atau buka proyek yang sudah ada.
3. Buka menu **SQL Editor** -> **New Query**.
4. Buka berkas [**`supabase_setup.sql`**](file:///c:/Users/ACER/Desktop/Ahmad%20Zakky%20Al%20Fitra%20-%20RPL%202/Website%20Job%20&%20Edu%20Fair/supabase_setup.sql), salin seluruh kodenya, tempel ke SQL Editor Supabase, lalu klik **Run**.

### 2. Isi Kredensial di `js/config.js`
Buka [**`js/config.js`**](file:///c:/Users/ACER/Desktop/Ahmad%20Zakky%20Al%20Fitra%20-%20RPL%202/Website%20Job%20&%20Edu%20Fair/js/config.js), lalu masukkan `url` dan `anonKey` Anda (bisa didapat di menu **Project Settings -> API** pada Supabase):
```javascript
supabase: {
  enabled: true,
  url: "https://proyek-kamu.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsIn...",
  tables: {
    guests: "guests",
    rsvps: "rsvps",
  },
}
```

---

## 🧪 Menguji Fitur Nama Tamu Dinamis

Coba jalankan dengan menambahkan parameter di URL browser Anda:
- **Dari URL Langsung:** `index.html?to=Bpk.+Ahmad+Zakky+dan+Keluarga`
- **Dari Kode Supabase:** `index.html?code=TAMU01` (akan membaca nama dari tabel `guests` di Supabase)

---

## 📝 Tabel Log Penggunaan AI (Untuk Lembar Jawaban Siswa)

| No. | Tahap Pengembangan | Tujuan / Masalah yang Diselesaikan | Ringkasan Prompt ke AI | Penyesuaian Manual yang Dilakukan Siswa |
|---|---|---|---|---|
| **1** | Struktur & UI | Membuat template website undangan mobile-first dengan Bootstrap 5 sesuai spesifikasi fitur ASAS. | *"Buatkan kerangka UI menggunakan Bootstrap 5 sesuai spesifikasi fitur: Hero Cover, Nama Tamu dinamis, Countdown Timer, Embed Maps, Amplop digital, Galeri Lightbox, dan RSVP."* | Menyesuaikan profil mempelai, foto, palet warna krem & gold, serta struktur container mobile-first. |
| **2** | Database Supabase | Integrasi database cloud Supabase untuk data tamu dinamis dan RSVP buku tamu real-time. | *"Integrasikan database Supabase untuk membaca data tamu dan menyimpan buku tamu real-time dengan fallback otomatis ke localStorage."* | Membuat tabel melalui query SQL di Supabase SQL editor dan menghubungkan anon key di `config.js`. |
| **3** | Kustomisasi Audio | Membuat sistem pemutar musik yang dapat dikustomisasi (playlist, URL custom, file lokal). | *"Buatkan sistem audio controller yang bisa dikustomisasi lagunya melalui file konfigurasi dan modal interaktif."* | Menambahkan file audio pilihan ke daftar playlist dan mengatur lagu romantis default. |
| **4** | Validasi & Interaksi | Membuat countdown timer real-time, fungsi salin rekening dengan Toast feedback, dan transisi cover. | *"Buatkan logika countdown timer real-time, copy to clipboard dengan feedback Bootstrap Toast, dan transisi unlock cover."* | Mengatur target tanggal pernikahan pada format waktu ISO `2026-12-31T09:00:00`. |
