# EcoPoint — Panduan Deploy

## Arsitektur

```
Browser → Vercel (frontend React)
               │ VITE_API_URL
        Railway (backend NestJS + SQLite)
```

Backend adalah aplikasi **NestJS** yang berjalan dengan Node.js. Database memakai
SQLite melalui modul bawaan Node.js (`node:sqlite`), sehingga tidak ada dependency
native yang perlu dikompilasi.

---

## Bagian 1 — Deploy Backend ke Railway

### Prasyarat

- Akun Railway: https://railway.app
- Repository sudah di-push ke GitHub (termasuk `backend/Dockerfile` dan
  `backend/railway.json`)

### Langkah-langkah

**1. Buat project baru di Railway**

1. Buka https://railway.app/new
2. Pilih **Deploy from GitHub repo**
3. Pilih repository `projek-ecopoint`
4. Jangan deploy dulu — atur variabel lebih dulu

**2. Set Root Directory ke `backend`**

1. Buka service → tab **Settings**
2. Bagian **Source** → **Root Directory**
3. Isi: `backend`
4. Save

**3. Set environment variables**

Masuk ke tab **Variables**, tambahkan:

| Variable     | Value                        | Keterangan                    |
| ------------ | ---------------------------- | ----------------------------- |
| `PORT`       | `8080`                       | Port aplikasi NestJS          |
| `DB_PATH`    | `/app/ecopoint.db`           | Path SQLite di dalam container|
| `JWT_SECRET` | *(string acak panjang)*      | Jangan pakai nilai default!   |

Contoh membuat `JWT_SECRET` yang aman:

```bash
openssl rand -base64 32
```

**4. Deploy**

1. Klik **Deploy** — Railway akan build dari `Dockerfile`
2. Tunggu sampai status **Active**
3. Tab **Settings** → **Networking** → **Generate Domain**
4. Salin URL, contoh: `https://ecopoint-backend.up.railway.app`

**5. Verifikasi**

Buka:

```
https://ecopoint-backend.up.railway.app/api/health
```

Respons yang benar:

```json
{"status":"ok"}
```

Jika belum muncul, cek tab **Logs** di Railway.

---

## Bagian 2 — Konfigurasi Frontend di Vercel

**1. Set `VITE_API_URL`**

1. Buka https://vercel.com/dashboard
2. Pilih project EcoPoint frontend
3. **Settings** → **Environment Variables**
4. Klik **Add New**:
   - **Key**: `VITE_API_URL`
   - **Value**: URL Railway (contoh `https://ecopoint-backend.up.railway.app`)
   - **Environment**: `Production` (dan `Preview` jika perlu)
5. **Save**

> Jangan pernah menaruh `JWT_SECRET` atau credential privat dengan prefix `VITE_`.
> Semua variabel `VITE_*` akan ikut ter-bundle ke JavaScript dan bisa dibaca publik.

**2. Redeploy frontend**

1. Tab **Deployments**
2. Titik tiga pada deployment terbaru → **Redeploy**
3. Tunggu status `Ready`

**3. Verifikasi**

Buka website, coba register/login. Tidak boleh ada error 404.

---

## Catatan tentang SQLite

SQLite menyimpan data di file (`ecopoint.db`) di dalam container Railway.

- Data tetap ada selama container tidak di-restart / tidak ada deploy baru
- Data akan hilang jika Railway me-restart container atau deploy ulang

Untuk production serius, migrasikan ke PostgreSQL. Untuk demo atau proyek
kuliah, SQLite sudah cukup.

---

## Troubleshooting

| Gejala                         | Kemungkinan penyebab             | Solusi                                      |
| ------------------------------ | -------------------------------- | ------------------------------------------- |
| 404 di register/login          | `VITE_API_URL` kosong/salah      | Cek env variable Vercel, redeploy           |
| Backend tidak bisa start       | Build gagal / env kurang         | Cek Logs Railway                            |
| CORS error                     | URL punya trailing slash         | Hapus slash di akhir URL                    |
| Data hilang                    | SQLite terhapus saat redeploy    | Normal untuk SQLite; gunakan Postgres       |
| `/api/health` tidak merespons  | Container crash                  | Cek Logs Railway                            |
| `node:sqlite` error            | Versi Node terlalu lama          | Pastikan image Node.js 24 (sudah di Dockerfile) |
