# ♻️ EcoPoint — Entity Relationship Diagram (Backend)

> Skema database & arsitektur backend **NestJS (REST API)** untuk platform gamifikasi pengumpulan sampah EcoPoint. Melengkapi `prd.md` (frontend React + Vite).

---

## 1. Backend Tech Stack

```text
NestJS
  ↓
HTTP API / REST API
  ↓
Business Logic
  ↓
Database
```

### 1.1 Backend Responsibilities
- Register, Login, Logout pengguna (authentication & JWT/session).
- Validasi data pengguna.
- Mengelola points, XP, level, dan environmental impact.
- Mencatat collection sampah (jenis, berat, jumlah item).
- Mengelola rewards dan proses redemption.
- Mengelola challenges (daily/weekly) dan achievement/badge.
- Menghitung serta menyediakan data leaderboard.
- Menyediakan REST API yang dikonsumsi frontend React.

### 1.2 Project Structure
```text
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── auth/
│   ├── users/
│   ├── collections/
│   ├── challenges/
│   ├── achievements/
│   ├── rewards/
│   ├── leaderboard/
│   ├── stats/
│   ├── database/
│   ├── progress/
│   └── seed/
├── package.json
├── tsconfig.json
├── nest-cli.json
└── Dockerfile
```

### 1.3 Frontend ↔ Backend ↔ Database
```text
┌─────────────────────────────────────────────────────────┐
│ FRONTEND — React + Vite                                 │
│ Landing Page • Auth • Dashboard • Rewards • Profile    │
└─────────────────────────────────────────────────────────┘
                         │
                  HTTP / REST API
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ BACKEND — NestJS                                         │
│ Authentication • Business Logic • Points • XP          │
│ Collection • Rewards • Challenges • Leaderboard        │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ DATABASE                                                 │
│ User • Collection • Reward • Redemption • Challenge   │
│ UserChallenge • Achievement • UserAchievement          │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Entity List

### 2.1 User
| Field | Type | Constraint |
|---|---|---|
| id | UUID / BIGINT | PK |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | UNIQUE, NOT NULL |
| username | VARCHAR(50) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| avatar | VARCHAR(255) | NULLABLE |
| points | INT | DEFAULT 0 |
| xp | INT | DEFAULT 0 |
| level | INT | DEFAULT 1 |
| total_waste | DECIMAL(10,2) | DEFAULT 0 — dalam KG |
| total_items | INT | DEFAULT 0 |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### 2.2 Collection
Catatan setiap kali user menyetor sampah.

| Field | Type | Constraint |
|---|---|---|
| id | UUID / BIGINT | PK |
| user_id | UUID / BIGINT | FK → User.id |
| waste_type | VARCHAR(50) | NOT NULL — plastic_bottle, plastic_bag, dll |
| amount | DECIMAL(10,2) | NOT NULL — dalam KG |
| items_count | INT | DEFAULT 0 |
| points_earned | INT | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |

### 2.3 Level
Master data level/tier gamifikasi.

| Field | Type | Constraint |
|---|---|---|
| id | INT | PK |
| level_number | INT | UNIQUE, NOT NULL |
| title | VARCHAR(50) | NOT NULL — "Eco Starter", "Earth Guardian", dst |
| xp_required | INT | NOT NULL |
| badge_icon | VARCHAR(255) | NULLABLE |

### 2.4 Challenge
Master data tantangan harian/mingguan.

| Field | Type | Constraint |
|---|---|---|
| id | UUID / BIGINT | PK |
| title | VARCHAR(150) | NOT NULL |
| description | TEXT | NULLABLE |
| target | INT | NOT NULL — misal: 10 item |
| xp_reward | INT | NOT NULL |
| type | VARCHAR(20) | daily / weekly |
| deadline | TIMESTAMP | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |

### 2.5 UserChallenge
Junction table — progress tiap user terhadap tiap challenge.

| Field | Type | Constraint |
|---|---|---|
| id | UUID / BIGINT | PK |
| user_id | UUID / BIGINT | FK → User.id |
| challenge_id | UUID / BIGINT | FK → Challenge.id |
| progress | INT | DEFAULT 0 |
| is_completed | BOOLEAN | DEFAULT false |
| completed_at | TIMESTAMP | NULLABLE |

### 2.6 Achievement
Master data badge yang bisa di-unlock.

| Field | Type | Constraint |
|---|---|---|
| id | UUID / BIGINT | PK |
| name | VARCHAR(100) | NOT NULL — "First Collection", dst |
| description | TEXT | NULLABLE |
| icon | VARCHAR(255) | NULLABLE |
| condition_type | VARCHAR(50) | NOT NULL — total_items, total_waste, streak |
| condition_value | INT | NOT NULL |

### 2.7 UserAchievement
Junction table — badge yang sudah diperoleh user.

| Field | Type | Constraint |
|---|---|---|
| id | UUID / BIGINT | PK |
| user_id | UUID / BIGINT | FK → User.id |
| achievement_id | UUID / BIGINT | FK → Achievement.id |
| unlocked_at | TIMESTAMP | NOT NULL |

### 2.8 Reward
Master data reward yang bisa ditukar dengan poin.

| Field | Type | Constraint |
|---|---|---|
| id | UUID / BIGINT | PK |
| name | VARCHAR(150) | NOT NULL |
| description | TEXT | NULLABLE |
| category | VARCHAR(50) | NULLABLE — voucher / cash / merchandise / donation |
| points_required | INT | NOT NULL |
| image | VARCHAR(255) | NULLABLE |
| stock | INT | DEFAULT 0 |
| is_active | BOOLEAN | DEFAULT true |

### 2.9 Redemption
Riwayat penukaran poin dengan reward.

| Field | Type | Constraint |
|---|---|---|
| id | UUID / BIGINT | PK |
| user_id | UUID / BIGINT | FK → User.id |
| reward_id | UUID / BIGINT | FK → Reward.id |
| points_used | INT | NOT NULL |
| status | VARCHAR(20) | pending / completed / cancelled |
| created_at | TIMESTAMP | NOT NULL |

---

## 3. Relationships

```text
User        (1) ──── (N) Collection
User        (1) ──── (N) Redemption
User        (1) ──── (N) UserChallenge   ──── (N:1) Challenge
User        (1) ──── (N) UserAchievement ──── (N:1) Achievement
Reward      (1) ──── (N) Redemption
Level       (1) ──── (N) User            (referensi level saat ini, opsional FK)
```

- **User → Collection**: satu user bisa punya banyak riwayat setoran sampah. Setiap `Collection` menambah `points`, `xp`, `total_waste`, `total_items` milik user lewat service layer.
- **User ↔ Challenge**: many-to-many lewat `UserChallenge` — satu challenge diikuti banyak user, satu user bisa ikut banyak challenge dengan progress berbeda.
- **User ↔ Achievement**: many-to-many lewat `UserAchievement` — mencatat kapan badge tertentu ter-unlock untuk user tertentu.
- **User → Redemption → Reward**: `Redemption` adalah tabel transaksi penghubung `User` dan `Reward`; `points_used` mengurangi `points` user saat status `completed`.
- **Level**: master table opsional agar `xp_required` per level mudah diubah tanpa redeploy.

---

## 4. ER Diagram (Mermaid)

```mermaid
erDiagram
    USER ||--o{ COLLECTION : records
    USER ||--o{ REDEMPTION : makes
    USER ||--o{ USER_CHALLENGE : participates
    USER ||--o{ USER_ACHIEVEMENT : unlocks
    CHALLENGE ||--o{ USER_CHALLENGE : tracked_by
    ACHIEVEMENT ||--o{ USER_ACHIEVEMENT : granted_by
    REWARD ||--o{ REDEMPTION : redeemed_as
    LEVEL ||--o{ USER : classifies

    USER {
        UUID id PK
        string name
        string email
        string username
        string password_hash
        string avatar
        int points
        int xp
        int level
        decimal total_waste
        int total_items
        timestamp created_at
    }

    COLLECTION {
        UUID id PK
        UUID user_id FK
        string waste_type
        decimal amount
        int items_count
        int points_earned
        timestamp created_at
    }

    LEVEL {
        int id PK
        int level_number
        string title
        int xp_required
        string badge_icon
    }

    CHALLENGE {
        UUID id PK
        string title
        string description
        int target
        int xp_reward
        string type
        timestamp deadline
    }

    USER_CHALLENGE {
        UUID id PK
        UUID user_id FK
        UUID challenge_id FK
        int progress
        boolean is_completed
        timestamp completed_at
    }

    ACHIEVEMENT {
        UUID id PK
        string name
        string description
        string icon
        string condition_type
        int condition_value
    }

    USER_ACHIEVEMENT {
        UUID id PK
        UUID user_id FK
        UUID achievement_id FK
        timestamp unlocked_at
    }

    REWARD {
        UUID id PK
        string name
        string description
        string category
        int points_required
        string image
        int stock
        boolean is_active
    }

    REDEMPTION {
        UUID id PK
        UUID user_id FK
        UUID reward_id FK
        int points_used
        string status
        timestamp created_at
    }
```

---

## 5. ASCII Overview (ringkas)

```text
┌──────────┐        ┌────────────┐
│  LEVEL   │ 1 ── N │    USER    │
└──────────┘        └─────┬──────┘
                           │
        ┌──────────────────┼──────────────────┬────────────────────┐
        │                  │                  │                    │
        ▼                  ▼                  ▼                    ▼
 ┌─────────────┐  ┌────────────────┐ ┌──────────────────┐ ┌──────────────┐
 │ COLLECTION  │  │  REDEMPTION    │ │  USER_CHALLENGE  │ │USER_ACHIEVEM.│
 └─────────────┘  └───────┬────────┘ └────────┬─────────┘ └──────┬───────┘
                          │                    │                  │
                          ▼                    ▼                  ▼
                    ┌──────────┐        ┌──────────┐       ┌─────────────┐
                    │  REWARD  │        │CHALLENGE │       │ ACHIEVEMENT │
                    └──────────┘        └──────────┘       └─────────────┘
```

---

## 6. NestJS Model Sketch

```ts
// src/common/models.ts
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password_hash: string;
  avatar: string | null;
  points: number;
  xp: number;
  level: number;
  total_waste: number;
  total_items: number;
  created_at: string;
  updated_at: string;
}

// src/common/models.ts
export interface Collection {
  id: string;
  user_id: string;
  waste_type: string;
  amount: number;
  items_count: number;
  points_earned: number;
  created_at: string;
}
```
> Interface lain (`Reward`, `Redemption`, `Challenge`, `UserChallenge`, `Achievement`, `UserAchievement`) mengikuti pola field yang sama seperti tabel di Section 2.

---

## 7. REST API Endpoint (Ringkasan)

```text
Auth
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout

User
GET    /api/users/me
PUT    /api/users/me

Collection
POST   /api/collections
GET    /api/collections            (riwayat user)

Challenge
GET    /api/challenges
GET    /api/challenges/me          (progress user)
POST   /api/challenges/:id/progress

Achievement
GET    /api/achievements
GET    /api/achievements/me

Reward
GET    /api/rewards
POST   /api/rewards/:id/redeem

Leaderboard
GET    /api/leaderboard?range=week|month|all
```

---

## 8. Notes

- `points`, `xp`, `total_waste`, `total_items` pada `User` bersifat **denormalized/cached** dari agregat `Collection` dan `Redemption` — dipertahankan agar query dashboard cepat, diperbarui lewat service layer setiap ada `Collection`/`Redemption` baru.
- `UserChallenge` dan `UserAchievement` sengaja dipisah sebagai junction table agar riwayat progres/unlock per user tetap tersimpan meski `Challenge`/`Achievement` induknya berubah/diarsipkan.
- Untuk MVP, `Level` boleh disederhanakan jadi enum/konstanta di kode NestJS, alih-alih tabel terpisah — berguna kalau level ingin dikelola dinamis dari admin panel di kemudian hari.
- Detail tampilan/UI dan komponen frontend yang mengonsumsi endpoint di atas ada di `prd.md`.
