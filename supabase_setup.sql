-- ============================================================================
-- SQL SCHEMA DATABASE SUPABASE UNTUK WEBSITE UNDANGAN DIGITAL
-- Jalankan query ini di menu: Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================================

-- 1. TABEL DAFTAR TAMU UNDANGAN (guests)
-- Untuk fitur Nama Tamu Dinamis via Database berdasarkan parameter (?code=... atau ?to=...)
CREATE TABLE IF NOT EXISTS public.guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,      -- Contoh: 'TAMU01', 'BUDI', 'ZAKKY'
    name VARCHAR(150) NOT NULL,            -- Nama lengkap tamu undangan
    phone VARCHAR(20),                     -- Nomor WhatsApp/Telepon (opsional)
    quota INT DEFAULT 2,                   -- Kuota jumlah tamu
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL BUKU TAMU & RSVP (rsvps)
-- Untuk menyimpan konfirmasi kehadiran dan ucapan/doa restu dari tamu secara real-time
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name VARCHAR(150) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Hadir', 'Tidak Hadir', 'Masih Ragu')),
    guest_count VARCHAR(50) DEFAULT '1 Orang',
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PENGATURAN HAK AKSES (ROW LEVEL SECURITY / RLS)
-- Memberikan izin kepada pengunjung website (anon public key) untuk membaca & menulis
-- ============================================================================

-- Aktifkan RLS
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Kebijakan untuk Tabel guests: Pengunjung publik diizinkan membaca data tamu
DROP POLICY IF EXISTS "Allow anon read guests" ON public.guests;
CREATE POLICY "Allow anon read guests" 
ON public.guests FOR SELECT 
TO anon 
USING (true);

-- Kebijakan untuk Tabel rsvps: Pengunjung publik diizinkan membaca semua ucapan
DROP POLICY IF EXISTS "Allow anon read rsvps" ON public.rsvps;
CREATE POLICY "Allow anon read rsvps" 
ON public.rsvps FOR SELECT 
TO anon 
USING (true);

-- Kebijakan untuk Tabel rsvps: Pengunjung publik diizinkan mengirim ucapan baru
DROP POLICY IF EXISTS "Allow anon insert rsvps" ON public.rsvps;
CREATE POLICY "Allow anon insert rsvps" 
ON public.rsvps FOR INSERT 
TO anon 
WITH CHECK (true);

-- ============================================================================
-- DATA CONTOH AWAL (SEED DATA)
-- ============================================================================

-- Contoh data tamu (Bisa dicoba di URL: ?code=TAMU01 atau ?code=TAMU02)
INSERT INTO public.guests (code, name, phone, quota) VALUES
('TAMU01', 'Bpk. Ahmad Zakky & Keluarga', '08123456789', 2),
('TAMU02', 'Ibu Dr. Siti Rahmawati', '08198765432', 1),
('VIP01', 'Bpk. Kepala Sekolah & Rekan Guru', '08133344455', 4)
ON CONFLICT (code) DO NOTHING;

-- Contoh data ucapan awal
INSERT INTO public.rsvps (guest_name, status, guest_count, message, created_at) VALUES
('Budi Santoso', 'Hadir', '2 Orang', 'Selamat menempuh hidup baru Romeo & Juliet! Semoga menjadi keluarga yang sakinah, mawaddah, dan warahmah.', NOW() - INTERVAL '1 day'),
('Siti Rahmawati', 'Hadir', '1 Orang', 'Happy Wedding! Lancar sampai hari H ya, doa terbaik untuk kalian berdua.', NOW() - INTERVAL '2 days'),
('Andi Wijaya', 'Tidak Hadir', '-', 'Mohon maaf belum bisa hadir langsung karena tugas di luar kota. Selamat berbahagia!', NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- AKTIFKAN SUPABASE REALTIME (OPSIONAL / SANGAT DIREKOMENDASIKAN)
-- Supaya ucapan yang dikirim langsung muncul tanpa perlu refresh halaman
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvps;
