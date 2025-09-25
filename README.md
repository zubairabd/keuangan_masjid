# Sistem Informasi Manajemen Masjid (PIMM)
PIMM adalah aplikasi web lengkap yang dirancang untuk membantu pengurus masjid (DKM) dalam mengelola operasional masjid secara digital dan transparan. Aplikasi ini mencakup manajemen keuangan, penjadwalan program kegiatan, dan menyediakan laporan yang dapat diakses oleh jamaah.
## ✨ Fitur Utama
Aplikasi ini dibagi menjadi dua bagian utama: Halaman Admin yang aman dan Halaman Publik yang informatif.Halaman Admin (Dasbor)🔐 Sistem Login Aman: Menggunakan otentikasi berbasis JSON Web Token (JWT).⏳ Session Timeout: Admin akan otomatis logout setelah 15 menit tidak ada aktivitas untuk keamanan.📊 Dasbor Multi-Menu: Navigasi menggunakan sidebar untuk beralih antara modul Keuangan dan Kegiatan.💰 Manajemen Keuangan:Operasi CRUD (Tambah, Edit, Hapus) untuk semua transaksi.📸 Upload Bukti Foto untuk setiap transaksi sebagai bukti akuntabilitas.🔍 Filter Transaksi berdasarkan tahun, bulan, jenis, dan kategori.📈 Grafik Dinamis: Visualisasi pemasukan dan pengeluaran bulanan yang interaktif dan mengikuti filter.🖨️ Cetak Laporan: Mencetak laporan keuangan yang rapi sesuai dengan filter yang sedang aktif.🗓️ Manajemen Program Kegiatan:Operasi CRUD (Tambah, Edit, Hapus) untuk semua jadwal kegiatan masjid.Mencatat detail seperti nama acara, tanggal, waktu, pembicara, dan keterangan.Halaman Publik (Jamaah)🔒 Read-Only: Tampilan yang aman, hanya untuk melihat data tanpa bisa mengubahnya.🧾 Laporan Keuangan Transparan: Menampilkan ringkasan saldo dan daftar semua transaksi.🔎 Filter Laporan Canggih: Jamaah dapat memfilter laporan keuangan berdasarkan tahun, bulan, jenis (pemasukan/pengeluaran), dan kategori.📄 Lihat Bukti: Terdapat tautan untuk melihat bukti foto dari setiap transaksi.💻 Teknologi yang DigunakanProyek ini dibangun menggunakan teknologi modern dan standar industri.BagianTeknologiBackendDatabaseFrontendLainnya🚀 Panduan Instalasi & MenjalankanBerikut adalah langkah-langkah untuk menjalankan proyek ini di lingkungan lokal.PrasyaratNode.js (v18 atau lebih baru)PostgreSQL
1. Clone Repositorygit clone [https://github.com/username-anda/nama-repository.git](https://github.com/username-anda/nama-repository.git)
cd nama-repository
2. Install Dependensi BackendBuka terminal di folder proyek dan jalankan:npm install
3. Konfigurasi DatabaseBuka psql atau alat bantu database Anda.Buat database baru:CREATE DATABASE db_keuangan_masjid;
Hubungkan ke database tersebut (\c db_keuangan_masjid) dan jalankan skrip SQL di bawah ini untuk membuat semua tabel yang dibutuhkan:CREATE TABLE transaksi (
    id SERIAL PRIMARY KEY,
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    keterangan VARCHAR(255) NOT NULL,
    jumlah DECIMAL(15, 2) NOT NULL,
    jenis VARCHAR(20) NOT NULL,
    kategori VARCHAR(50),
    bukti_foto_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kegiatan (
    id SERIAL PRIMARY KEY,
    nama_kegiatan VARCHAR(255) NOT NULL,
    tanggal_kegiatan DATE NOT NULL,
    waktu_mulai TIME,
    waktu_selesai TIME,
    pembicara VARCHAR(100),
    keterangan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
4. Konfigurasi EnvironmentBuat file baru di folder utama proyek bernama .env.Salin konten di bawah ini ke dalam file .env dan sesuaikan dengan konfigurasi lokal Anda, terutama DB_PASSWORD.# Konfigurasi Database
DB_USER=postgres
DB_HOST=localhost
DB_NAME=db_keuangan_masjid
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# Konfigurasi Aplikasi & Keamanan
JWT_SECRET=rahasia-super-aman-yang-harus-diganti
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123
5. Jalankan ServerSetelah semua konfigurasi selesai, jalankan server backend dengan perintah:node server.js
Server akan berjalan di http://localhost:3000.6. Akses AplikasiHalaman Login Admin: Buka file login.html di browser Anda.Halaman Publik: Buka file user-view.html di browser.📝 Lisensi & KreditDibuat dengan ❤️ oleh @elinf_zub © 2025.
