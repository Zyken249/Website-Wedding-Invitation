/**
 * ============================================================================
 * KONFIGURASI TEMPLATE UNDANGAN DIGITAL (CONFIG.JS)
 * Tempat mengatur:
 * 1. Database Supabase (URL & Anon Key)
 * 2. Kustomisasi Musik & Playlist
 * 3. Informasi Acara & Mempelai
 * 4. Nomor Rekening & Alamat Kado
 * ============================================================================
 */

const APP_CONFIG = {
  // --------------------------------------------------------------------------
  // 1. PENGATURAN SUPABASE (DATABASE CLOUD)
  // --------------------------------------------------------------------------
  // Dapatkan URL dan ANON KEY dari Dashboard Supabase Anda:
  // Project Settings -> API -> Project URL & Project API Keys (anon public)
  supabase: {
    enabled: true, // Ubah ke false jika hanya ingin memakai localStorage
    url: "https://wqdrzonfwckmvdfiuxpj.supabase.co", // Ganti dengan Supabase Project URL Anda
    anonKey: "e6614b5d-12ed-4d7b-9805-7a177b4e8659", // Ganti dengan anon public key Anda
    tables: {
      guests: "guests", // Tabel data tamu undangan
      rsvps: "rsvps",   // Tabel konfirmasi kehadiran & ucapan
    },
  },

  // --------------------------------------------------------------------------
  // 2. KUSTOMISASI MUSIK (AUDIO SETTINGS & PLAYLIST)
  // --------------------------------------------------------------------------
  // Anda dapat mengganti lagu default dengan URL mp3 online atau file lokal di folder /assets/audio/
  music: {
    autoplay: true, // Otomatis putar setelah tombol "Buka Undangan" diklik
    defaultIndex: 0, // Indeks lagu yang pertama kali diputar
    playlist: [
      {
        id: "song-1",
        title: "Romantic Wedding Piano",
        artist: "Instrumental Acoustic",
        // File audio royalty-free kualitas tinggi
        src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-112191.mp3",
      },
      {
        id: "song-2",
        title: "A Thousand Years (Piano Cello)",
        artist: "The Piano Guys Style",
        src: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=piano-moment-9835.mp3",
      },
      {
        id: "song-3",
        title: "Canon in D Major (Classical)",
        artist: "Johann Pachelbel",
        src: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=canon-in-d-major-instrumental-112194.mp3",
      },
      {
        id: "song-4",
        title: "Lagu Kustom Lokal (Contoh)",
        artist: "File Lokal Anda",
        // Cara menggunakan file lokal: letakkan file mp3 di folder /assets/audio/nama-lagu.mp3
        src: "assets/audio/wedding-song.mp3",
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 3. INFORMASI ACARA (EVENT DETAILS)
  // --------------------------------------------------------------------------
  event: {
    groom: {
      nickname: "Romeo",
      fullName: "Romeo Montague, S.T.",
      parents: "Bpk. Lord Montague & Ibu Lady Montague",
      instagram: "romeo.montague",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    },
    bride: {
      nickname: "Juliet",
      fullName: "Juliet Capulet, S.Ds.",
      parents: "Bpk. Lord Capulet & Ibu Lady Capulet",
      instagram: "juliet.capulet",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    // Target Waktu untuk Countdown (Tahun, Bulan-1, Tanggal, Jam, Menit)
    // Format ISO: YYYY-MM-DDTHH:MM:SS
    targetDate: "2026-12-24T09:00:00",
    timeZone: "WIB",

    // Sesi Acara
    schedule: [
      {
        name: "Akad Nikah",
        dateText: "Kamis, 24 Desember 2026",
        timeText: "09.00 - 11.00 WIB",
        venue: "Grand Ballroom Hotel Mulia Senayan",
        address: "Jl. Asia Afrika No. 6, Gelora, Tanah Abang, Jakarta Pusat",
        icon: "bi-heart-fill",
      },
      {
        name: "Resepsi Pernikahan",
        dateText: "Kamis, 24 Desember 2026",
        timeText: "11.00 - 14.30 WIB",
        venue: "Grand Ballroom Hotel Mulia Senayan",
        address: "Jl. Asia Afrika No. 6, Gelora, Tanah Abang, Jakarta Pusat",
        icon: "bi-gem",
      },
    ],

    // Google Maps Embed & Direct Link
    maps: {
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.309395276214!2d106.7972046758682!3d-6.222874760946765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1496b71f909%3A0x6b63c7885b57f86e!2sHotel%20Mulia%20Senayan%20Jakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
      directUrl: "https://maps.google.com/?q=Hotel+Mulia+Senayan+Jakarta",
    },
  },

  // --------------------------------------------------------------------------
  // 4. AMPLOP DIGITAL & HADIAH KADO
  // --------------------------------------------------------------------------
  gifts: [
    {
      bank: "BANK BCA",
      accountNumber: "1234567890",
      accountName: "Romeo Montague",
      badgeColor: "bg-primary text-white",
    },
    {
      bank: "BANK MANDIRI",
      accountNumber: "987654321098",
      accountName: "Juliet Capulet",
      badgeColor: "bg-warning text-dark",
    },
    {
      type: "KADO FISIK",
      recipient: "Romeo & Juliet (0812-3456-7890)",
      address: "Jl. Mahoni Indah No. 42, Senayan, Jakarta Selatan (Kode Pos 12190)",
      badgeColor: "bg-secondary text-white",
    },
  ],
};
