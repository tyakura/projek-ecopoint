# ♻️ EcoPoint — Product Requirements Document (Frontend)

> Frontend **React + Vite** untuk platform gamifikasi pengumpulan sampah EcoPoint. Dibungkus dengan bahasa visual **neo-brutalism bertema industri sampah** — kasar, tegas, dan penuh kontras, bukan "eco pastel" biasa.

---

## 0. Design Reference

Dua referensi digabung menjadi satu arah visual:

| Referensi | Yang Diambil |
|---|---|
| **DesignThinkers (neo-brutalism)** | Torn paper edge, border hitam tebal, blok warna solid kontras tinggi, sticker/badge miring, tipografi besar-tebal-kasar, hard shadow (bukan blur) |
| **Wastia (waste industry template)** | Palet warna industri sampah (kuning hazard, hijau recycle, abu truk/tong sampah), ikon layanan (pickup, dumpster, recycling), struktur konten seputar "collection" & "service" |

**Sintesis:** EcoPoint tampil seperti *poster jalanan tentang isu sampah* yang di-gamifikasi — bukan dashboard SaaS lembut, dan bukan pula brosur perusahaan waste-management yang kaku.

### 0.1 Yang Diambil dari Neo-Brutalism
- Torn paper edge sebagai pembatas antar section
- Border hitam tebal 3–4px pada card, tombol, foto, badge
- Warna blok solid penuh per section (bukan gradient)
- Sticker/badge miring (rotasi 4°–8°) untuk label poin & achievement
- Hard shadow offset hitam (bukan drop-shadow blur)
- Tipografi headline besar, tebal, sedikit kasar

### 0.2 Yang Diambil dari Tema Sampah (Wastia)
- Palet warna "hazard" khas industri sampah: kuning, hijau recycle, abu tong/truk
- Ikon layanan bergaya waste-management (truck, bin, recycle arrow, dumpster)
- Nada visual "operasional & aksi nyata" — bukan cuma ilustrasi bumi lucu

### 0.3 Dihindari
- Gradient lembut, drop-shadow blur, rounded corner berlebihan di semua elemen
- Palet pastel monoton tanpa kontras
- Layout kaku simetris tanpa elemen "tempel"
- Foto stok generik tanpa border/framing tegas

---

## 1. Product Overview

**Nama Produk:** EcoPoint
**Tagline:** "Turn Waste Into Value."

EcoPoint memberi pengalaman seperti game dalam mengumpulkan sampah plastik: kumpulkan sampah → dapat poin → naik level → tukar reward → lihat dampak lingkungan.

### Core Loop
```text
COLLECT → EARN POINTS → LEVEL UP → GET REWARDS → HELP THE ENVIRONMENT → COLLECT MORE
```

### Core Philosophy
> "Every piece of waste has value."

---

## 2. Frontend Tech Stack

```text
React
  ↓
Vite
  ↓
UI Components (neo-brutalist)
  ↓
Pages & Dashboard
  ↓
API Requests → Backend (Golang REST API)
```

### 2.1 Frontend Responsibilities
- Menampilkan Landing Page, Login, Register, Dashboard, Rewards, Leaderboard, Profile.
- Mengelola UI interaktif: progress bar level, poin, challenge, reward card, activity feed.
- Mengirim request ke backend via HTTP/REST API dan menampilkan response.
- Mengelola routing (React Router) dan state aplikasi di client (Context/hooks).
- Merender elemen dekoratif brutalist (torn edge, sticker, hard shadow) sebagai komponen reusable, bukan digambar manual per halaman.

### 2.2 Project Structure
```text
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Button, Card, Badge (brutalist base components)
│   │   ├── decorative/      # TornEdge, StickerBadge, HardShadowWrapper
│   │   ├── layout/          # Navbar, Footer, Sidebar
│   │   └── dashboard/       # PointsCard, LevelCard, ChallengeCard, RewardCard
│   ├── pages/
│   │   ├── Landing/
│   │   ├── Auth/            # Login, Register
│   │   └── Dashboard/       # Overview, Rewards, Leaderboard, Profile
│   ├── layouts/
│   ├── services/            # api.js, authService.js, collectionService.js
│   ├── hooks/                # useAuth, usePoints, useChallenge
│   ├── context/              # AuthContext, UserContext
│   ├── assets/               # icons, textures (paper, torn edge SVG)
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
└── vite.config.js
```

---

## 3. Design System

### 3.1 Color Palette (Neo-Brutalism × Waste Industry)
```text
Ink Black        #0D0F0C     — teks utama, outline, navbar/footer
Paper White      #F5F1E8     — background dasar, kartu terang
Hazard Yellow    #FFD100     — CTA utama, aksen "collection/pickup"
Recycle Green    #1DB954     — aksen "earn/reward", ikon daur ulang
Bin Grey         #8C8C88     — aksen netral, elemen tong sampah/truk
Alert Orange     #FF5A1F     — urgency, streak, challenge deadline
Neon Lime        #D4FF3F     — highlight poin, progress bar, badge sticker
```

Aturan pakai:
- **Ink Black** selalu jadi warna outline/border — tidak pernah abu-abu tipis.
- Satu section = satu warna blok dominan.
- **Hazard Yellow** dikhususkan untuk CTA & elemen "aksi" (submit, collect), meniru warna rompi/truk sampah.
- **Recycle Green** & **Neon Lime** dikhususkan untuk elemen poin/reward agar konsisten secara makna.

### 3.2 Typography
```text
Display Font:  Archivo Black / Space Grotesk (bold)
Body Font:     Inter / General Sans

Hero Headline:      72px / Black (900), all-caps opsional
Section Heading:     44px / Bold
Card Heading:        20px / Bold
Body:                16px / Regular, line-height 1.6
Badge/Sticker Text:  13px / Bold, all-caps, letter-spacing tinggi
```

### 3.3 Komponen Dekoratif Wajib
- `<TornEdge />` — SVG pembatas robek antar section besar
- `<StickerBadge rotate="-4deg" />` — label "+250 PTS", "NEW", "LEVEL UP!"
- `<HardShadowCard offset="6px" />` — card dengan bayangan solid offset, bukan blur

---

## 4. Website Structure

```text
EcoPoint (Frontend)
│
├── Landing Page
│   ├── Navbar
│   ├── Hero
│   ├── Problem
│   ├── Solution
│   ├── How It Works
│   ├── Gamification
│   ├── Environmental Impact
│   ├── Rewards Preview
│   ├── CTA
│   └── Footer
│
├── Authentication
│   ├── Login
│   └── Register
│
└── User Dashboard
    ├── Overview
    ├── Points
    ├── Level
    ├── Progress
    ├── Activity
    ├── Rewards
    ├── Leaderboard
    └── Profile
```

---

## 5. Landing Page Specification

### 5.1 Navbar
Background **Ink Black**, logo ♻ di kiri, nav item putih, tombol kanan "GET STARTED" berwarna **Hazard Yellow** dengan border hitam tebal (gaya tombol "REGISTER" pada referensi).

```text
┌─────────────────────────────────────────────────────────────┐
│ ♻ ECOPOINT     Home  How It Works  Impact  Rewards          │
│                                 [Login]   [GET STARTED →]    │
└─────────────────────────────────────────────────────────────┘
```
Mobile: `♻ ECOPOINT   ☰`

### 5.2 Hero
Background blok **Bin Grey** atau **Hazard Yellow**, dengan **torn paper edge** di bawah memisahkan hero dari section putih berikutnya.

**Headline:** "TURN WASTE INTO VALUE." (kata "VALUE" di-highlight blok **Neon Lime**)
**Subheadline:** Collect plastic waste, earn points, unlock rewards, and make a real impact on the environment.
**CTA:** `[START COLLECTING →]` `[SEE HOW IT WORKS]`

**Visual card kanan** (sticker, border hitam 4px, rotasi -3°):
```text
┌───────────────────────────────┐
│       ♻️ ECOPOINT             │
│       +250 POINTS              │
└───────────────────────────────┘
Environmental Impact — 1,250 KG Collected
```

### 5.3 Problem Section
Background **Ink Black**, teks putih.

**Heading:** "PLASTIC WASTE IS EVERYONE'S PROBLEM."
Card border putih 1px + ikon besar:
- 🌱 **Soil Pollution**
- 🌊 **Environmental Pollution**
- 🗑️ **Low Awareness**

### 5.4 Solution Section
Background **Paper White**. Tiga kartu border hitam tebal + hard shadow offset 6px.

**Heading:** "WHAT IF RECYCLING FELT LIKE A GAME?"
```text
♻ COLLECT — Collect recyclable waste.
⭐ EARN    — Receive points for your contribution.
🎁 REDEEM  — Exchange points for rewards.
```

### 5.5 How It Works
**Heading:** "HOW ECOPOINT WORKS"
```text
01                    02
COLLECT      →      SUBMIT

   ↓

04                    03
REDEEM       ←       EARN
```
Nomor step besar & tebal sebagai elemen dekoratif brutalist.

### 5.6 Gamification Section
Background **Recycle Green**, kartu putih border hitam.

**Heading:** "MAKE EVERY CONTRIBUTION COUNT."

Points sticker: `+250 POINTS` (rotasi -4°)

Levels:
```text
LEVEL 01  Eco Starter
LEVEL 02  Green Explorer
LEVEL 03  Eco Warrior
LEVEL 04  Earth Guardian
```

Weekly Challenge:
```text
WEEKLY CHALLENGE
Collect 10 plastic bottles
████████░░ 80%   8 / 10
+500 XP
```

Achievements (sticker rotasi acak ringan):
```text
♻ First Collection   🌱 Green Starter   🌎 Earth Saver   🏆 Eco Legend
```

### 5.7 User Progress Preview
Card border hitam 4px di atas background **Bin Grey**.
```text
┌──────────────────────────────────────────────┐
│ GOOD MORNING, ALEX 👋                        │
│ ⭐ 2,450 POINTS                              │
│ LEVEL 04 — Earth Guardian                    │
│ ████████████████░░░░  2,450 / 3,000 XP       │
│ ♻ 87 Items Collected   🌱 12.4 KG Collected  │
└──────────────────────────────────────────────┘
[START YOUR JOURNEY →]
```

### 5.8 Environmental Impact
Background **Alert Orange**, angka statistik raksasa (56–64px).

**Heading:** "SMALL ACTIONS. REAL IMPACT."
```text
12,450 KG     Waste Collected
4,250         Active Users
8,920         Collections
2,840         Rewards Claimed
```
> Every piece of waste collected is one small step toward a cleaner environment.

### 5.9 Rewards Preview
**Heading:** "YOUR POINTS. YOUR REWARDS."
Card border hitam tebal + hard shadow, badge poin sebagai sticker pojok.
```text
┌────────────────────┐
│       🎁           │
│ Rp10.000 Reward    │
│ 1,000 Points       │
│ [VIEW REWARD]      │
└────────────────────┘
```
Contoh lain: 🎟️ Discount Voucher · 👕 Eco Merchandise · 💰 Cash Reward · 🌱 Environmental Donation

`[EXPLORE REWARDS →]`

### 5.10 Final CTA
Background **Ink Black**, tipografi besar seperti "PARTNERS" pada referensi.
**Heading:** "READY TO TURN WASTE INTO VALUE?"
`[CREATE FREE ACCOUNT]` `[LOGIN]`

### 5.11 Footer
```text
♻ ECOPOINT — Turn Waste Into Value.
Product          Company        Support
How It Works     About          Help Center
Rewards          Impact         Contact
© 2026 EcoPoint
```

---

## 6. Authentication Pages

### 6.1 Login
Kartu form tengah, border hitam 4px + hard shadow, di atas background blok warna.
```text
┌──────────────────────────────────────────────────────┐
│                 ♻ ECOPOINT                            │
│              Welcome Back 👋                         │
│      Log in to continue your journey.                │
│ Email    [ you@example.com                    ]       │
│ Password [ ••••••••••••                       ]       │
│              Forgot password?                        │
│ [                 LOGIN →                     ]       │
│        Don't have an account? Register               │
└──────────────────────────────────────────────────────┘
```

### 6.2 Register
Fields: Full Name, Email, Username, Password, Confirm Password
Tombol: `[CREATE ACCOUNT →]`

Register Flow:
```text
Register → Validate Form → Create Account → Create User Profile
   → Points = 0, Level = Eco Starter → Dashboard
```

---

## 7. User Dashboard

Sidebar **Ink Black**, konten kartu statistik border hitam tebal + hard shadow, badge level sebagai sticker miring.

```text
┌─────────────────────────────────────────────────────────────┐
│ ♻ ECOPOINT                          🔔    👤 Alex            │
├───────────────┬─────────────────────────────────────────────┤
│ Dashboard     │  Good morning, Alex 👋                      │
│ ♻ Collection  │  Your Environmental Journey                 │
│ ⭐ Rewards    │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│ 🏆 Leaderboard│  │ 2,450    │ │ 87       │ │ 12.4 KG  │    │
│ 📊 Impact     │  │ Points   │ │ Items    │ │ Waste    │    │
│ 👤 Profile    │  └──────────┘ └──────────┘ └──────────┘    │
│ ⚙ Settings    │  Level 04 • Earth Guardian                 │
│               │  ████████████████░░░░  82%                 │
│               │  Recent Activity                            │
│               │  ♻ Plastic Collection     +250 ⭐           │
│               │  🎯 Weekly Challenge       +500 XP          │
│               │  🎁 Reward Redeemed        -1000 ⭐          │
└───────────────┴─────────────────────────────────────────────┘
```

### 7.1 Component: Points Card
```text
⭐ TOTAL POINTS
2,450
+250 this week
[View Points →]
```

### 7.2 Component: Waste Card
```text
♻ WASTE COLLECTED
12.4 KG
87 items
[View History →]
```

### 7.3 Component: Level Card
```text
🏆 CURRENT LEVEL
Earth Guardian — LEVEL 04
2,450 / 3,000 XP
████████████████░░░░
```

### 7.4 Recent Activity
```text
♻ Plastic Collection    Today       +250 Points
🎯 Weekly Challenge      Yesterday   +500 XP
♻ Plastic Collection    Aug 27      +180 Points
🎁 Reward Redeemed       Aug 26      -1,000 Points
```

### 7.5 Weekly Challenge Card
```text
┌─────────────────────────────────────────┐
│ 🎯 WEEKLY CHALLENGE                     │
│ Collect 10 recyclable items             │
│ ████████████████░░░░  8 / 10             │
│ Reward: +500 XP                         │
│ 2 days remaining                        │
└─────────────────────────────────────────┘
```

### 7.6 Dashboard Rewards
```text
💰 Rp10.000     — 1,000 Points  [Redeem]
🎟️ Voucher      — 1,500 Points  [Redeem]
👕 Eco T-Shirt  — 5,000 Points  [Redeem]
```

### 7.7 Leaderboard
```text
🏆 ECO LEADERBOARD
Rank   User      Waste
🥇 01  Alex      125 KG
🥈 02  Sarah      98 KG
🥉 03  Daniel     87 KG
   04  Kevin      76 KG
   05  You        65 KG
```
Filters: `[Today] [This Week] [This Month] [All Time]`

### 7.8 Profile Page
```text
PROFILE
        👤
        Alex
        Level 04 — Earth Guardian
────────────────────────────
Total Points          2,450
Waste Collected       12.4 KG
Items Collected       87
Challenges Completed  24
────────────────────────────
Achievements
♻ First Collection  🌱 Green Starter  🏆 Eco Warrior
────────────────────────────
[Edit Profile]  [Settings]  [Logout]
```

---

## 8. User Flow

```text
                    LANDING PAGE
                         │
               ┌─────────┴─────────┐
            LOGIN               REGISTER
               └─────────┬─────────┘
                         ↓
                    DASHBOARD
       ┌─────────────────┼─────────────────┐
       ▼                 ▼                 ▼
 COLLECTION          REWARDS         LEADERBOARD
       ▼                 ▼                 ▼
    POINTS            REDEEM            RANKING
       ▼
      XP
       ▼
     LEVEL UP
```

---

## 9. Responsive Design

**Desktop:** Navbar → 2-column Hero → 3-column Cards → 4-step Process → Gamification → Impact → Rewards → CTA → Footer

**Mobile:** Navbar → Hero → CTA → Problem → Solution → How It Works → Gamification → Impact → Rewards → CTA → Footer
Torn-edge & blok warna tetap dipertahankan di mobile, disederhanakan jadi tumpukan satu kolom.

**Dashboard mobile:** Top Bar → Points → Waste → Level → Challenge → Recent Activity → Rewards

---

## 10. Frontend ↔ Backend Interaction

```text
User
  ↓
React + Vite (Frontend)
  ↓
POST /api/login   (contoh)
  ↓
Golang Backend (REST API)
  ↓
Database
  ↓
Response JSON
  ↓
React Dashboard (render ulang state)
```

Frontend hanya berkomunikasi lewat REST API — lihat `erd.md` untuk detail entitas, relasi, dan endpoint backend.

---

## 11. MVP Scope (Frontend)

**Landing Page:** Navbar, Hero, Problem, Solution, How It Works, Gamification, Impact, Rewards, CTA, Footer

**Authentication:** Register, Login, Logout (UI + integrasi API)

**Dashboard:** Total Points, Waste Collected, User Level, XP Progress, Recent Activity, Challenges, Rewards

**Additional:** Profile, Leaderboard

---

## 12. Notes

- Semua nilai reward pada landing page adalah contoh untuk keperluan prototipe.
- Elemen "sobekan kertas" dan sticker rotasi dibuat sebagai komponen SVG reusable (`TornEdge`, `StickerBadge`) agar konsisten di seluruh halaman, bukan digambar manual per section.
- Kontras warna neo-brutalism harus tetap lolos uji aksesibilitas (rasio kontras teks minimal AA) meski tampilan berani.
- Untuk detail skema data, relasi tabel, dan kontrak API, rujuk `erd.md` (backend).
