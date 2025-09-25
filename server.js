const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const app = express();
const port = 3000;

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USER = {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'password123'
};

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
    if (err) return console.error('Error acquiring client', err.stack);
    console.log('Berhasil terhubung ke database PostgreSQL!');
    client.release();
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)){ fs.mkdirSync(dir); }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// === Endpoint Login ===
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
        const token = jwt.sign({ username: username }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ token });
    } else {
        res.status(401).send('Username atau password salah');
    }
});

// Middleware Otentikasi
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// === Fungsi Bantuan untuk Filter ===
const buildFilterQuery = (baseQuery, queryParams) => {
    const { year, month, jenis, kategori } = queryParams;
    let query = baseQuery;
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (year) { conditions.push(`EXTRACT(YEAR FROM tanggal) = $${paramIndex++}`); values.push(year); }
    if (month) { conditions.push(`EXTRACT(MONTH FROM tanggal) = $${paramIndex++}`); values.push(month); }
    if (jenis) { conditions.push(`jenis = $${paramIndex++}`); values.push(jenis); }
    if (kategori) { conditions.push(`kategori ILIKE $${paramIndex++}`); values.push(`%${kategori}%`); }
    
    if (conditions.length > 0) {
        query += (query.includes('WHERE') ? ' AND ' : ' WHERE ') + conditions.join(' AND ');
    }
    return { query, values };
};

// === Endpoint Publik ===
app.get('/api/public/transaksi', async (req, res) => {
    try {
        let { query, values } = buildFilterQuery('SELECT id, tanggal, keterangan, jumlah, jenis, kategori, bukti_foto_url FROM transaksi', req.query);
        query += ' ORDER BY tanggal DESC, created_at DESC';
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) { res.status(500).send('Server Error'); }
});
app.get('/api/public/saldo', async (req, res) => {
    try {
        const baseQuery = `SELECT COALESCE(SUM(CASE WHEN jenis = 'pemasukan' THEN jumlah ELSE 0 END), 0) AS total_pemasukan, COALESCE(SUM(CASE WHEN jenis = 'pengeluaran' THEN jumlah ELSE 0 END), 0) AS total_pengeluaran, COALESCE(SUM(CASE WHEN jenis = 'pemasukan' THEN jumlah ELSE -jumlah END), 0) AS saldo_akhir FROM transaksi`;
        let { query, values } = buildFilterQuery(baseQuery, req.query);
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (err) { res.status(500).send('Server Error'); }
});


// === Endpoint Dilindungi: Transaksi Keuangan ===
app.get('/api/transaksi', authenticateToken, async (req, res) => {
    try {
        let { query, values } = buildFilterQuery('SELECT * FROM transaksi', req.query);
        query += ' ORDER BY tanggal DESC, created_at DESC';
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) { res.status(500).send('Server Error'); }
});

app.get('/api/saldo', authenticateToken, async (req, res) => {
    try {
        const baseQuery = `SELECT COALESCE(SUM(CASE WHEN jenis = 'pemasukan' THEN jumlah ELSE 0 END), 0) AS total_pemasukan, COALESCE(SUM(CASE WHEN jenis = 'pengeluaran' THEN jumlah ELSE 0 END), 0) AS total_pengeluaran, COALESCE(SUM(CASE WHEN jenis = 'pemasukan' THEN jumlah ELSE -jumlah END), 0) AS saldo_akhir FROM transaksi`;
        let { query, values } = buildFilterQuery(baseQuery, req.query);
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/transaksi', authenticateToken, upload.single('buktiFoto'), async (req, res) => {
    try {
        const { tanggal, keterangan, jumlah, jenis, kategori } = req.body;
        const buktiFotoUrl = req.file ? req.file.path.replace(/\\/g, "/") : null;
        const newTransaction = await pool.query("INSERT INTO transaksi (tanggal, keterangan, jumlah, jenis, kategori, bukti_foto_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [tanggal, keterangan, jumlah, jenis, kategori, buktiFotoUrl]);
        res.json(newTransaction.rows[0]);
    } catch (err) { res.status(500).send("Server Error"); }
});

app.put('/api/transaksi/:id', authenticateToken, upload.single('buktiFoto'), async (req, res) => {
    try {
        const { id } = req.params;
        const { tanggal, keterangan, jumlah, jenis, kategori } = req.body;
        let buktiFotoUrl = req.body.bukti_foto_url_lama;
        if (req.file) {
            buktiFotoUrl = req.file.path.replace(/\\/g, "/");
        }
        const updatedTransaction = await pool.query("UPDATE transaksi SET tanggal = $1, keterangan = $2, jumlah = $3, jenis = $4, kategori = $5, bukti_foto_url = $6 WHERE id = $7 RETURNING *", [tanggal, keterangan, jumlah, jenis, kategori, buktiFotoUrl, id]);
        if (updatedTransaction.rows.length === 0) {
            return res.status(404).send('Transaksi tidak ditemukan.');
        }
        res.json(updatedTransaction.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.delete('/api/transaksi/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM transaksi WHERE id = $1", [id]);
        res.json({ msg: "Transaksi berhasil dihapus" });
    } catch (err) { res.status(500).send("Server Error"); }
});


// === Endpoint Dilindungi: Program Kegiatan ===
app.get('/api/kegiatan', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT *, TO_CHAR(waktu_mulai, \'HH24:MI\') as waktu_mulai, TO_CHAR(waktu_selesai, \'HH24:MI\') as waktu_selesai FROM kegiatan ORDER BY tanggal_kegiatan DESC');
        res.json(result.rows);
    } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/kegiatan', authenticateToken, async (req, res) => {
    try {
        const { nama_kegiatan, tanggal_kegiatan, waktu_mulai, waktu_selesai, pembicara, keterangan } = req.body;
        const newKegiatan = await pool.query("INSERT INTO kegiatan (nama_kegiatan, tanggal_kegiatan, waktu_mulai, waktu_selesai, pembicara, keterangan) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [nama_kegiatan, tanggal_kegiatan, waktu_mulai || null, waktu_selesai || null, pembicara, keterangan]);
        res.json(newKegiatan.rows[0]);
    } catch (err) { res.status(500).send("Server Error"); }
});

app.put('/api/kegiatan/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_kegiatan, tanggal_kegiatan, waktu_mulai, waktu_selesai, pembicara, keterangan } = req.body;
        const updatedKegiatan = await pool.query("UPDATE kegiatan SET nama_kegiatan = $1, tanggal_kegiatan = $2, waktu_mulai = $3, waktu_selesai = $4, pembicara = $5, keterangan = $6 WHERE id = $7 RETURNING *", [nama_kegiatan, tanggal_kegiatan, waktu_mulai || null, waktu_selesai || null, pembicara, keterangan, id]);
        res.json(updatedKegiatan.rows[0]);
    } catch (err) { res.status(500).send("Server Error"); }
});

app.delete('/api/kegiatan/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM kegiatan WHERE id = $1", [id]);
        res.json({ msg: "Kegiatan berhasil dihapus" });
    } catch (err) { res.status(500).send("Server Error"); }
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});

