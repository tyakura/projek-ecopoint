# EcoPoint — Panduan Deploy

## Mengapa 404 saat Register/Login?

Penyebab pasti: **Backend tidak pernah di-deploy.**

Saat `VITE_API_URL` kosong, frontend mengirim request ke `/api/auth/register`
tanpa prefix domain — artinya request dikirim ke domain Vercel frontend itu
sendiri (misalnya `https://ecopoint.vercel.app/api/auth/register`). Vercel
tidak tahu route tersebut, sehingga membalas 404.

Solusi: deploy backend ke Railway, lalu isi `VITE_API_URL` di Vercel.

---

## Arsitektur Deployment

```
Browser → Vercel (frontend React)
                ↓ VITE_API_URL
         Railway (backend Go + SQLite)
```

---

## Bagian 1 — Deploy Backend ke Railway

### Prasyarat
- Akun Railway: https://railway.app (bisa login dengan GitHub)
- Repository sudah di-push ke GitHub (termasuk `backend/Dockerfile` dan
  `backend/railway.json`)

### Langkah-langkah

**1. Buat project baru di Railway**
1. Buka https://railway.app/new
2. Pilih **Deploy from GitHub repo**
3. Pilih repository `projek-ecopoint`
4. Klik **Add variables** (jangan deploy dulu)

**2. Set Root Directory ke `backend`**
1. Di halaman service, klik tab **Settings**
2. Cari bagian **Source** → **Root Directory**
3. Isi: `backend`
4. Save

**3. Set environment variables di Railway**

Masuk ke tab **Variables** pada service, tambahkan:

| Variable    | Value                        | Keterangan                          |
|-------------|------------------------------|-------------------------------------|
| `PORT`      | `8080`                       | Port yang dipakai binary Go         |
| `DB_PATH`   | `/app/ecopoint.db`           | Path SQLite di dalam container      |
| `JWT_SECRET`| *(buat string acak panjang)* | Jangan pakai nilai default!         |

> Contoh `JWT_SECRET` yang aman:
> ```
> openssl rand -base64 32
> ```

**4. Deploy**
1. Klik **Deploy** — Railway akan build dari `Dockerfile`
2. Tunggu hingga status **Active** (biasanya 2–3 menit)
3. Setelah aktif, klik tab **Settings** → **Networking** → **Generate Domain**
4. Salin URL yang muncul, contoh: `https://ecopoint-backend.up.railway.app`

**5. Verifikasi backend berjalan**

Buka di browser:
```
https://ecopoint-backend.up.railway.app/api/health
```

Respons yang benar:
```json
{"status":"ok"}
```

Jika belum muncul, cek tab **Logs** di Railway untuk melihat error.

---

## Bagian 2 — Konfigurasi Frontend di Vercel

### Set environment variable VITE_API_URL

1. Buka https://vercel.com/dashboard
2. Pilih project EcoPoint frontend
3. Masuk ke **Settings** → **Environment Variables**
4. Klik **Add New**:
   - **Key**: `VITE_API_URL`
   - **Value**: URL Railway kamu (contoh: `https://ecopoint-backend.up.railway.app`)
   - **Environment**: centang `Production` (dan `Preview` jika perlu)
5. Klik **Save**

> PENTING: `VITE_API_URL` aman untuk di-set sebagai environment variable Vercel
> karena hanya berisi URL publik. Jangan pernah set `JWT_SECRET` atau
> credential privat dengan prefix `VITE_` — semua variabel `VITE_*` akan
> terpanggang ke dalam JavaScript bundle dan bisa dibaca siapa saja.

### Redeploy frontend

Setelah menyimpan environment variable:

1. Masuk ke tab **Deployments**
2. Klik titik tiga (**⋯**) di deployment terbaru
3. Pilih **Redeploy**
4. Tunggu hingga status `Ready`

### Verifikasi

Buka website, coba register akun baru. Tidak boleh ada error 404 lagi.

---

## Catatan penting tentang SQLite

SQLite menyimpan data di file (`ecopoint.db`). Di Railway, file ini hidup di
dalam container. Artinya:

- Data **tetap ada** selama container tidak di-restart atau tidak ada deploy baru
- Data **akan hilang** jika Railway me-restart container atau kamu deploy ulang

Untuk production yang serius, migrasi ke **PostgreSQL** (Railway punya add-on
gratis). Namun untuk demo atau proyek kuliah, SQLite sudah cukup.

---

## Troubleshooting

| Gejala | Kemungkinan penyebab | Solusi |
|--------|---------------------|--------|
| 404 di register/login | `VITE_API_URL` kosong atau salah | Cek env variable di Vercel, redeploy |
| Backend tidak bisa start | `JWT_SECRET` atau `DB_PATH` tidak di-set | Cek Variables di Railway |
| CORS error di browser | `VITE_API_URL` pakai trailing slash | Hapus slash di akhir URL |
| Data hilang | SQLite terhapus saat redeploy | Normal untuk SQLite; gunakan Postgres untuk persistence |
| `/api/health` tidak merespons | Build gagal atau container crash | Cek Logs di Railway |
