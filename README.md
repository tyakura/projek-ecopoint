# EcoPoint

EcoPoint adalah aplikasi gamifikasi pengelolaan sampah. Catat setoran sampah daur ulang, kumpulkan poin dan XP, ikuti tantangan, lalu tukarkan poin dengan reward.

Aplikasi terdiri dari frontend React (Vite), backend REST API NestJS, dan database SQLite menggunakan modul bawaan Node.js `node:sqlite`.

## Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: NestJS 12, TypeScript, JWT, bcryptjs
- **Database**: SQLite (`node:sqlite`, tanpa dependency native)

## Fitur

- **Landing page** dengan informasi program, statistik dampak lingkungan, dan animasi scroll.
- **Registrasi dan login** untuk mengakses dashboard yang dilindungi autentikasi.
- **Dashboard personal** yang merangkum poin, berat dan jumlah sampah, level, XP, tantangan, serta aktivitas terbaru.
- **Pencatatan setoran sampah** berdasarkan jenis, berat, dan jumlah item, termasuk riwayat setoran.
- **Gamifikasi** berupa poin, XP, level, achievement, dan tantangan harian atau mingguan.
- **Katalog dan penukaran reward** menggunakan poin, dengan informasi stok dan riwayat penukaran.
- **Leaderboard** dengan filter peringkat sepanjang waktu, mingguan, dan bulanan.
- **Profil pengguna** untuk melihat progres serta mengubah nama dan avatar.

## Struktur Project

```
projek-ecopoint/
├── backend/          # REST API NestJS
│   └── src/
│       ├── auth/         # register, login, logout
│       ├── users/        # profil user
│       ├── collections/  # setoran sampah
│       ├── challenges/   # tantangan
│       ├── achievements/ # pencapaian
│       ├── rewards/      # hadiah & penukaran
│       ├── leaderboard/  # peringkat
│       ├── stats/        # statistik publik
│       ├── database/     # koneksi & migrasi SQLite
│       ├── seed/         # data awal & akun demo
│       └── main.ts       # entrypoint
└── frontend/         # aplikasi React
```

## Prasyarat

- **Node.js 24 LTS** versi terbaru, atau minimal **Node.js 22.22+**
- npm

> Backend memakai modul SQLite bawaan Node.js (`node:sqlite`), jadi tidak perlu install database terpisah.

## Menjalankan Secara Lokal

Clone repository, lalu masuk ke folder project:

```powershell
git clone https://github.com/tyakura/projek-ecopoint.git
cd projek-ecopoint
```

## Menjalankan Backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run start:dev
```

Backend berjalan di **http://localhost:8081**.

Cek kesehatan API:

```powershell
curl http://localhost:8081/api/health
# {"status":"ok"}
```

Konfigurasi tersedia di `backend/.env`:

| Variable     | Default                     | Keterangan               |
| ------------ | --------------------------- | ------------------------ |
| `PORT`       | `8081`                      | Port backend             |
| `DB_PATH`    | `ecopoint.db`               | Lokasi file SQLite       |
| `JWT_SECRET` | `ecopoint-super-secret-key` | Secret token JWT (ganti!) |

## Menjalankan Frontend

Buka terminal baru:

```powershell
cd frontend
npm install
npm run dev
```

Frontend berjalan di **http://localhost:5173**.

Vite otomatis mem-proxy request `/api/*` ke `http://localhost:8081`, jadi frontend dan backend cukup dijalankan bersamaan.

> Jika port `8081` juga terpakai, ubah `PORT` di `backend/.env` **dan**
> `VITE_API_TARGET` di `frontend/.env` ke port yang sama.

## Akun Demo

| Email               | Password      |
| ------------------- | ------------- |
| `alex@ecopoint.io`  | `demo123456`  |
| `sarah@ecopoint.io` | `demo123456`  |
| `daniel@ecopoint.io`| `demo123456`  |
| `kevin@ecopoint.io` | `demo123456`  |

Data awal (level, challenge, achievement, reward, akun demo) dibuat otomatis saat backend pertama kali dijalankan.

## Endpoint API

| Method | Endpoint                         | Auth | Keterangan                    |
| ------ | -------------------------------- | ---- | ----------------------------- |
| GET    | `/api/health`                    | -    | Health check                  |
| GET    | `/api/stats`                     | -    | Statistik publik              |
| POST   | `/api/auth/register`             | -    | Registrasi                    |
| POST   | `/api/auth/login`                | -    | Login                         |
| POST   | `/api/auth/logout`               | Yes  | Logout                        |
| GET    | `/api/users/me`                  | Yes  | Profil user                   |
| PUT    | `/api/users/me`                  | Yes  | Update profil                 |
| POST   | `/api/collections`               | Yes  | Setor sampah                  |
| GET    | `/api/collections`               | Yes  | Riwayat setoran               |
| GET    | `/api/challenges`                | Yes  | Daftar challenge              |
| GET    | `/api/challenges/me`             | Yes  | Challenge yang diikuti        |
| POST   | `/api/challenges/:id/progress`   | Yes  | Tambah progress challenge     |
| GET    | `/api/achievements`              | Yes  | Daftar achievement            |
| GET    | `/api/achievements/me`           | Yes  | Achievement user              |
| GET    | `/api/rewards`                   | Yes  | Daftar reward                 |
| GET    | `/api/rewards/redemptions`       | Yes  | Riwayat penukaran             |
| POST   | `/api/rewards/:id/redeem`        | Yes  | Tukar reward                  |
| GET    | `/api/leaderboard?range=all`     | Yes  | Peringkat                     |

Semua endpoint yang butuh auth memakai header:

```
Authorization: Bearer <token>
```

## Build Production

Backend:

```powershell
cd backend
npm run build
npm run start:prod
```

Frontend:

```powershell
cd frontend
npm run build
npm run preview
```

Untuk deploy ke Railway/Vercel, lihat [DEPLOY.md](DEPLOY.md).

## Troubleshooting

| Gejala                              | Solusi                                                        |
| ----------------------------------- | ------------------------------------------------------------- |
| `node:sqlite` tidak ditemukan       | Gunakan Node.js 22.5+ (disarankan 24)                         |
| Frontend gagal memanggil API        | Pastikan backend jalan di port 8081                           |
| `EADDRINUSE` saat start backend     | Port terpakai; ganti `PORT` dan `VITE_API_TARGET`             |
| Login gagal                        | Gunakan akun demo di atas atau daftar akun baru               |
| Data ingin di-reset                 | Hentikan backend, hapus `backend/ecopoint.db`, jalankan ulang |
