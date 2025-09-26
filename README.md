# Sistem Informasi Manajemen Masjid (PIMM)
PIMM adalah aplikasi web lengkap yang dirancang untuk membantu pengurus masjid (DKM) dalam mengelola operasional masjid secara digital dan transparan. Aplikasi ini mencakup manajemen keuangan, penjadwalan program kegiatan, dan menyediakan laporan yang dapat diakses oleh jamaah.
## ✨ Fitur Utama
Aplikasi ini dibagi menjadi dua bagian utama: Halaman Admin yang aman dan Halaman Publik yang informatif.
### Halaman Admin (Dasbor)
- 🔐 Sistem Login Aman: Menggunakan otentikasi berbasis JSON Web Token (JWT).
- ⏳ Session Timeout: Admin akan otomatis logout setelah 15 menit tidak ada aktivitas untuk keamanan.
- 📊 Dasbor Multi-Menu: Navigasi menggunakan sidebar untuk beralih antara modul Keuangan dan Kegiatan.
- 💰 Manajemen Keuangan:
    - Operasi CRUD (Tambah, Edit, Hapus) untuk semua transaksi.
    - 📸 Upload Bukti Foto untuk setiap transaksi sebagai bukti akuntabilitas.
    - 🔍 Filter Transaksi berdasarkan tahun, bulan, jenis, dan kategori.
    - 📈 Grafik Dinamis: Visualisasi pemasukan dan pengeluaran bulanan yang interaktif dan mengikuti filter.
    - 🖨️ Cetak Laporan: Mencetak laporan keuangan yang rapi sesuai dengan filter yang sedang aktif.
- 🗓️ Manajemen Program Kegiatan:
  - Operasi CRUD (Tambah, Edit, Hapus) untuk semua jadwal kegiatan masjid.
  - Mencatat detail seperti nama acara, tanggal, waktu, pembicara, dan keterangan.
## Halaman Publik (Jamaah)
- 🔒 Read-Only: Tampilan yang aman, hanya untuk melihat data tanpa bisa mengubahnya.
- 🧾 Laporan Keuangan Transparan: Menampilkan ringkasan saldo dan daftar semua transaksi.
- 🔎 Filter Laporan Canggih: Jamaah dapat memfilter laporan keuangan berdasarkan tahun, bulan, jenis (pemasukan/pengeluaran), dan kategori.
- 📄 Lihat Bukti: Terdapat tautan untuk melihat bukti foto dari setiap transaksi.
## 💻 Teknologi yang Digunakan
Proyek ini dibangun menggunakan teknologi modern dan standar industri.
- Backend
   ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

- Database
   ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
- Frontend
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

## 🚀 Panduan Instalasi & Menjalankan
Berikut adalah langkah-langkah untuk menjalankan proyek ini di lingkungan lokal.
### Prasyarat
- Node.js (v18 atau lebih baru)
- PostgreSQL
### 1. Clone Repository
git clone [https://github.com/zubairabd/keuangan_masjid.git](https://github.com/zubairabd/keuangan_masjid.git)
```
cd nama-repository
 ```
### 2. Install Dependensi Backend
Buka terminal di folder proyek dan jalankan:
```
npm install
```
### 3. Konfigurasi Database
Buka ``` psql ``` atau alat bantu database Anda.
Buat database baru:
```
CREATE DATABASE db_keuangan_masjid;
```
Hubungkan ke database tersebut (``` \c db_keuangan_masjid ```) dan jalankan skrip SQL di bawah ini untuk membuat semua tabel yang dibutuhkan:
```
CREATE TABLE transaksi (
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
```
### 4. Konfigurasi Environment
1. Buat file baru di folder utama proyek bernama ``` .env ```.
2. Salin konten di bawah ini ke dalam file ``` .env ``` dan sesuaikan dengan konfigurasi lokal Anda, terutama ``` DB_PASSWORD ```.
```
# Konfigurasi Database
DB_USER=postgres
DB_HOST=localhost
DB_NAME=db_keuangan_masjid
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# Konfigurasi Aplikasi & Keamanan
JWT_SECRET=rahasia-super-aman-yang-harus-diganti
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123
```
### 5. Jalankan Server
Setelah semua konfigurasi selesai, jalankan server backend dengan perintah:
```
node server.js
```
Server akan berjalan di ``` http://localhost:3000 ```.
### 6. Akses Aplikasi
Halaman Login Admin: Buka file ``` login.html ``` di browser Anda.Halaman Publik: Buka file ``` user-view.html ``` di browser.
### 7. Testing
buka https://onecompiler.com/html , masukkan code file pada ``` (https://github.com/zubairabd/keuangan_masjid/SHOWCASE.html) ``` ke dalam editor html onecompiler
### 📝 Lisensi & KreditDibuat dengan ❤️ oleh @elinf_zub © 2025.
