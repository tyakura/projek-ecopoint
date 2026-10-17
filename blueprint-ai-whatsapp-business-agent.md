# Blueprint Website AI WhatsApp Business Agent

## 1. Gambaran Umum

Website ini adalah platform AI Agent untuk membantu bisnis mengotomatisasi Customer Service melalui WhatsApp.

Platform memiliki 3 bagian utama:

1. **Landing Page** untuk menjelaskan produk dan menarik calon pengguna.
2. **User Dashboard** untuk bisnis/client yang menggunakan AI Agent.
3. **Admin Dashboard** untuk tim/platform owner dalam mengelola pengguna, agent, data, integrasi, dan sistem.

### Tujuan Utama

Platform dirancang untuk membantu bisnis:

- Menjawab pertanyaan pelanggan selama 24 jam.
- Menyimpan data pelanggan secara otomatis.
- Memisahkan calon pelanggan, pelanggan deal, dan data terlarang.
- Mengubah percakapan WhatsApp menjadi data pelanggan yang terstruktur.
- Melakukan follow-up otomatis melalui WhatsApp atau email.
- Mengekspor data pelanggan ke Excel.
- Menghubungkan data dengan HubSpot sebagai integrasi opsional.
- Mengurangi pekerjaan manual Customer Service.

---

# 2. Tech Stack

> Catatan: permintaan awal menggunakan **NestJS sebagai frontend** dan **Next.js sebagai backend**. Secara arsitektur web modern, biasanya Next.js digunakan untuk frontend dan NestJS untuk backend/API. Blueprint ini tetap mengikuti pembagian yang diminta agar sesuai dengan rencana awal, tetapi struktur tersebut sebaiknya dikaji kembali sebelum development.

## Frontend

- NestJS
- Tailwind CSS
- HTML
- TypeScript

## Backend

- Next.js
- TypeScript
- REST API / API Routes

## Database

- MySQL

## Integrasi

- WhatsApp Business API / WhatsApp provider
- Excel export
- Email provider
- HubSpot API (opsional)

## Authentication

- Email + password
- Session/JWT
- Role-based access control

## Deployment

Dapat menggunakan:

- Frontend: Vercel / VPS
- Backend: VPS / cloud hosting
- Database: MySQL managed server / VPS

---

# 3. Struktur Website

```text
/
├── Landing Page
├── Pricing
├── Features
├── Documentation
├── Login
├── Register
│
├── /dashboard
│   ├── Overview
│   ├── AI Agent
│   ├── Customer Service
│   ├── Customer Data
│   ├── Deal Data
│   ├── Follow Up
│   ├── Forbidden Data
│   ├── Integrations
│   ├── WhatsApp
│   ├── Export
│   └── Settings
│
└── /admin
    ├── Overview
    ├── Users
    ├── Businesses
    ├── AI Agents
    ├── Customer Data
    ├── Deals
    ├── Follow Ups
    ├── Forbidden Data
    ├── Integrations
    ├── System Logs
    └── Settings
```

---

# 4. Landing Page

Landing page harus memiliki tujuan utama:

> Membuat pemilik bisnis memahami masalah yang diselesaikan platform dan tertarik mencoba AI Agent.

## Hero Section

Contoh konsep:

**"Customer Service WhatsApp Otomatis, 24 Jam."**

Subheadline:

> AI Agent yang menjawab pelanggan, menyimpan data, mendeteksi calon pembeli, membantu follow-up, dan mengelola data pelanggan secara otomatis.

CTA:

- Coba Sekarang
- Lihat Demo

## Problem Section

Menampilkan masalah bisnis:

- CS tidak bisa online 24 jam.
- Banyak chat pelanggan yang tidak terdata.
- Calon pelanggan lupa di-follow-up.
- Data pelanggan masih dicatat manual.
- Data deal harus dipindahkan manual.
- CS menghabiskan waktu menjawab pertanyaan berulang.

## Solution Section

Menjelaskan solusi:

### 1. AI Customer Service

AI menjawab pertanyaan pelanggan otomatis.

### 2. Automatic Customer Data

Percakapan dapat diubah menjadi data pelanggan.

### 3. Deal Detection

AI membantu mengidentifikasi pelanggan yang sudah deal.

### 4. Automated Follow Up

Sistem dapat menjadwalkan follow-up.

### 5. Data Protection

Data tertentu dapat ditandai sebagai data terlarang untuk diproses/ditampilkan sesuai aturan bisnis.

### 6. HubSpot Integration

Data dapat disinkronkan dengan HubSpot jika pengguna mengaktifkannya.

## CTA Section

Contoh:

> "Biarkan AI menangani chat pelanggan. Tim Anda fokus pada penjualan."

CTA:

**Mulai Sekarang**

---

# 5. Authentication

## Login

Field:

- Email
- Password

Fitur:

- Remember session
- Forgot password
- Login validation

## Register

Field:

- Nama
- Nama bisnis
- Email
- Nomor WhatsApp
- Password
- Konfirmasi password

Setelah register:

```text
Register
   ↓
Email verification
   ↓
Create workspace/business
   ↓
Dashboard
```

---

# 6. User Dashboard

Dashboard adalah pusat kontrol bisnis.

## Overview

Menampilkan:

- Total pelanggan
- Pelanggan baru
- Prospek
- Deal
- Follow-up hari ini
- Follow-up tertunda
- Jumlah chat
- Jumlah percakapan AI
- Conversion rate

Contoh:

```text
+----------------+----------------+
| Total Customer | Total Deal     |
| 1,284          | 186            |
+----------------+----------------+

+----------------+----------------+
| Prospek        | Follow Up      |
| 492            | 37             |
+----------------+----------------+
```

---

# 7. Modul Customer Service

## Tujuan

AI berfungsi sebagai Customer Service otomatis.

### Alur

```text
Customer WhatsApp
       ↓
WhatsApp API
       ↓
AI Agent
       ↓
Analisis pertanyaan
       ↓
Knowledge Base / Business Data
       ↓
AI menghasilkan jawaban
       ↓
WhatsApp Customer
```

## Kemampuan AI

AI dapat:

- Menjawab FAQ.
- Menjelaskan produk.
- Memberikan informasi harga jika tersedia.
- Menanyakan kebutuhan pelanggan.
- Mengumpulkan data pelanggan.
- Mengidentifikasi intent pelanggan.
- Mengidentifikasi prospek.
- Mendeteksi kemungkinan deal.
- Memicu follow-up.
- Mengarahkan percakapan ke human agent.

## Human Handoff

Jika AI tidak mampu menjawab:

```text
AI tidak yakin
     ↓
Tandai conversation
     ↓
Notifikasi CS
     ↓
CS mengambil alih
```

---

# 8. Data Pelanggan / Lite

Modul ini digunakan untuk pelanggan yang masih bertanya-tanya dan belum deal.

## Status

Contoh status:

```text
NEW
↓
CONTACTED
↓
INTERESTED
↓
QUALIFIED
↓
NEGOTIATION
↓
DEAL
```

Namun pelanggan yang belum deal tetap berada dalam kategori **Prospect/Lite Customer**.

## Data Customer

Minimal:

- ID
- Nama
- Nomor WhatsApp
- Email
- Perusahaan
- Produk yang diminati
- Kebutuhan
- Status
- Source
- Last conversation
- Last contact
- Created at
- Updated at

## Automatic Data Extraction

AI dapat mengambil informasi dari percakapan.

Contoh:

```text
Customer:
"Pak saya tertarik 100 unit produk A,
bisa dikirim minggu depan?"

AI:
Nama       → jika diketahui
Produk     → Produk A
Quantity   → 100
Kebutuhan  → Pembelian
Timeline   → Minggu depan
Intent     → High Intent
```

Data kemudian masuk ke CRM internal.

---

# 9. Export Excel

Customer data dapat diekspor menjadi Excel.

## Export

User dapat memilih:

- Semua data
- Data berdasarkan status
- Data berdasarkan tanggal
- Data berdasarkan produk
- Data berdasarkan sumber

Contoh:

```text
[Export Excel]

Filter:
Status: Interested
Tanggal: 01/09/2026 - 05/09/2026

[Download Excel]
```

---

# 10. Data Deal

Data deal berisi pelanggan yang sudah melakukan pembelian atau mencapai kesepakatan.

## Data Deal

- Customer
- Produk
- Quantity
- Harga
- Total transaksi
- Status pembayaran
- Sales/CS
- Tanggal deal
- Catatan
- Source
- Conversation ID

## Deal Status

```text
PENDING
↓
CONFIRMED
↓
PAID
↓
COMPLETED
```

## Automatic Deal Detection

AI dapat mendeteksi indikasi deal dari percakapan.

Contoh:

```text
Customer:
"Baik pak, saya ambil 50 unit."

AI:
→ Potential Deal

System:
→ Create deal record
→ Notify sales
→ Update customer status
```

> Untuk transaksi penting, sistem sebaiknya menyediakan konfirmasi manusia sebelum deal benar-benar dianggap final.

---

# 11. Follow Up System

Follow-up digunakan untuk pelanggan yang belum melakukan deal atau perlu dihubungi kembali.

## Jenis Follow Up

### Manual

CS menentukan:

```text
Customer: PT ABC
Channel: WhatsApp
Date: 10 September
Time: 10:00
Message: Follow up quotation
```

### Automatic

AI/system membuat follow-up berdasarkan aturan.

Contoh:

```text
Customer belum membalas
        ↓
24 jam
        ↓
Follow-up #1
        ↓
48 jam
        ↓
Follow-up #2
        ↓
7 hari
        ↓
Follow-up #3
```

## Channel

- WhatsApp
- Email

## Follow Up Status

```text
SCHEDULED
SENT
DELIVERED
REPLIED
FAILED
CANCELLED
```

## Safety / Business Rules

User harus dapat menentukan:

- Maksimal jumlah follow-up.
- Jeda antar follow-up.
- Jam pengiriman.
- Hari pengiriman.
- Template pesan.
- Kondisi berhenti follow-up.

Follow-up otomatis harus berhenti jika:

- Customer membalas.
- Customer meminta berhenti dihubungi.
- Customer sudah deal.
- Customer masuk daftar terlarang.

---

# 12. Forbidden Data

Modul ini digunakan untuk menentukan data yang tidak boleh diproses atau digunakan oleh AI sesuai kebijakan bisnis.

## Contoh

Admin/User dapat menentukan:

```text
Forbidden field:
- NIK
- Nomor kartu
- Data pembayaran tertentu
- Password
- Data internal perusahaan
```

> Daftar di atas hanya contoh. Jenis data terlarang harus ditentukan berdasarkan kebutuhan bisnis dan kebijakan privasi yang berlaku.

## Behavior

Jika AI mendeteksi data terlarang:

```text
Customer message
       ↓
Data Detection
       ↓
Forbidden Data?
   ↙          ↘
 YES           NO
 ↓              ↓
Mask/Block     Process
 ↓
Log event
```

Contoh:

```text
Input:
"Nomor kartu saya adalah XXXX"

System:
"Data sensitif terdeteksi."

AI tidak menyimpan atau menampilkan data tersebut
sesuai rule yang dikonfigurasi.
```

## Configuration

Admin dapat menentukan:

- Field terlarang.
- Keyword.
- Pattern.
- Action.
- Retention policy.
- Siapa yang boleh melihat data.

---

# 13. HubSpot Integration

HubSpot bersifat **opsional**.

## Connect

```text
Dashboard
   ↓
Integrations
   ↓
HubSpot
   ↓
Connect
   ↓
Authorization
   ↓
Connected
```

## Data Sync

Internal CRM:

```text
Customer
Deal
Follow Up
Conversation
```

dapat disinkronkan ke HubSpot sesuai konfigurasi.

## Sync Direction

Tahap awal:

```text
Platform → HubSpot
```

Pengembangan lanjutan:

```text
Platform ↔ HubSpot
```

## Sync Status

```text
SYNCED
PENDING
FAILED
```

## Integration Settings

User dapat menentukan:

- Data yang disinkronkan.
- Field mapping.
- Automatic sync.
- Manual sync.
- Disconnect integration.

---

# 14. WhatsApp Integration

WhatsApp merupakan channel utama AI Agent.

## Connection

User dapat menghubungkan:

```text
Business Account
      ↓
WhatsApp Business API
      ↓
Platform
      ↓
AI Agent
```

## WhatsApp Settings

- Phone number
- Business account
- Connection status
- Webhook status
- Auto reply
- AI Agent status

## Conversation

Dashboard menampilkan:

```text
Customer
   ↓
Conversation
   ↓
AI Response
   ↓
Customer Response
```

---

# 15. AI Agent Configuration

User dapat membuat dan mengatur AI Agent.

## Agent Settings

- Agent name
- Personality/tone
- Business description
- Product information
- FAQ
- Operating hours
- Escalation rules
- Follow-up rules
- Forbidden data rules

## Knowledge Base

User dapat memasukkan:

- FAQ
- Product catalog
- Price list
- Company profile
- Shipping information
- Payment information
- Documents

AI menggunakan knowledge base tersebut untuk menjawab customer.

---

# 16. Admin Dashboard

Admin adalah dashboard milik tim/platform owner.

## Admin Overview

Menampilkan:

- Total registered business
- Active users
- Active AI agents
- WhatsApp connections
- Total conversations
- Total customers
- Total deals
- Follow-up volume
- System errors

## User Management

Admin dapat:

- Melihat user.
- Melihat business.
- Suspend user.
- Activate user.
- Melihat subscription.
- Melihat penggunaan AI.

## Business Management

Admin dapat:

- Melihat business.
- Mengubah status business.
- Melihat agent.
- Melihat integrasi.
- Melihat usage.

## AI Monitoring

Admin dapat melihat:

- AI request count.
- Failed request.
- Escalation rate.
- Response errors.
- Token/AI usage jika tersedia.

---

# 17. Role System

Minimal terdapat:

```text
SUPER ADMIN
    ↓
ADMIN
    ↓
BUSINESS OWNER
    ↓
STAFF / CS
```

## Super Admin

Akses seluruh sistem.

## Admin

Mengelola user/business sesuai permission.

## Business Owner

Mengelola bisnis dan AI Agent.

## Staff / CS

Mengelola customer, conversation, deal, dan follow-up sesuai permission.

---

# 18. Database Blueprint

Database utama menggunakan MySQL.

## Users

```text
users
- id
- name
- email
- password_hash
- role_id
- status
- created_at
- updated_at
```

## Roles

```text
roles
- id
- name
```

## Businesses

```text
businesses
- id
- owner_id
- name
- description
- status
- created_at
- updated_at
```

## Customers

```text
customers
- id
- business_id
- name
- whatsapp
- email
- company
- status
- source
- notes
- created_at
- updated_at
```

## Conversations

```text
conversations
- id
- business_id
- customer_id
- channel
- status
- assigned_to
- created_at
- updated_at
```

## Messages

```text
messages
- id
- conversation_id
- sender_type
- message
- ai_generated
- created_at
```

## Deals

```text
deals
- id
- business_id
- customer_id
- product
- quantity
- amount
- status
- deal_date
- created_at
- updated_at
```

## Follow Ups

```text
follow_ups
- id
- business_id
- customer_id
- channel
- scheduled_at
- message
- status
- sent_at
- created_at
```

## Forbidden Rules

```text
forbidden_rules
- id
- business_id
- name
- rule_type
- pattern
- action
- active
- created_at
```

## Integrations

```text
integrations
- id
- business_id
- provider
- access_token
- status
- config
- created_at
- updated_at
```

## AI Agents

```text
ai_agents
- id
- business_id
- name
- system_prompt
- status
- created_at
- updated_at
```

## Knowledge Base

```text
knowledge_base
- id
- business_id
- title
- content
- source_type
- status
- created_at
- updated_at
```

## Audit Logs

```text
audit_logs
- id
- business_id
- user_id
- action
- entity
- entity_id
- metadata
- created_at
```

---

# 19. Core Business Flow

## Customer Baru

```text
Customer WhatsApp
        ↓
AI Agent
        ↓
Conversation dibuat
        ↓
Customer belum ada?
    ↓ YES
Create Customer
        ↓
Extract customer information
        ↓
Set status = NEW
```

## Customer Bertanya

```text
Customer
   ↓
AI menjawab
   ↓
AI menganalisis intent
   ↓
Update customer
```

## Customer Tertarik

```text
Customer menunjukkan minat
        ↓
Status = INTERESTED
        ↓
Save product interest
        ↓
Optional follow-up
```

## Customer Deal

```text
Customer menyatakan setuju
        ↓
Potential Deal
        ↓
Human confirmation / business rule
        ↓
Create Deal
        ↓
Customer status = DEAL
        ↓
Stop follow-up
```

---

# 20. Notification System

Dashboard menyediakan notifikasi untuk:

- Customer baru.
- Customer high intent.
- Potential deal.
- Deal confirmed.
- AI membutuhkan bantuan manusia.
- Follow-up gagal.
- WhatsApp disconnected.
- HubSpot sync gagal.

---

# 21. Security

Karena platform menangani data pelanggan, security harus menjadi bagian inti.

## Minimum

- Password hashing.
- JWT/session security.
- RBAC.
- API authentication.
- Input validation.
- Rate limiting.
- Webhook verification.
- Encryption untuk secret/token.
- Audit log.
- Secure environment variables.
- Database backup.

Token integrasi seperti WhatsApp/HubSpot tidak boleh disimpan sebagai plain text jika tidak diperlukan.

---

# 22. API Blueprint

Contoh endpoint:

## Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/forgot-password
```

## Customers

```text
GET    /customers
GET    /customers/:id
POST   /customers
PATCH  /customers/:id
DELETE /customers/:id
GET    /customers/export
```

## Conversations

```text
GET  /conversations
GET  /conversations/:id
POST /conversations/:id/messages
POST /conversations/:id/handoff
```

## Deals

```text
GET   /deals
POST  /deals
GET   /deals/:id
PATCH /deals/:id
```

## Follow Ups

```text
GET   /follow-ups
POST  /follow-ups
PATCH /follow-ups/:id
POST  /follow-ups/:id/cancel
```

## AI Agent

```text
GET   /agents
POST  /agents
PATCH /agents/:id
POST  /agents/:id/test
```

## Integrations

```text
GET  /integrations
POST /integrations/hubspot/connect
POST /integrations/hubspot/sync
POST /integrations/hubspot/disconnect
```

---

# 23. Frontend UI Structure

## Dashboard Layout

```text
┌──────────────────────────────────────────────┐
│ Logo                         Notification 👤 │
├──────────────┬───────────────────────────────┤
│ Dashboard    │                               │
│ AI Agent     │          Main Content         │
│ Customers    │                               │
│ Conversations│                               │
│ Deals        │                               │
│ Follow Up    │                               │
│ Forbidden    │                               │
│ Integrations │                               │
│ Settings     │                               │
└──────────────┴───────────────────────────────┘
```

## Design Direction

Gunakan:

- Tailwind CSS.
- Responsive design.
- Clean SaaS dashboard.
- Card-based statistics.
- Data table.
- Modal/form.
- Toast notification.
- Loading state.
- Empty state.
- Error state.
- Dark/light mode jika diperlukan.

---

# 24. MVP Scope

Jangan langsung membuat semua fitur.

## Phase 1 - Foundation

- Landing page.
- Login.
- Register.
- User dashboard.
- Admin dashboard.
- Database.
- Role system.

## Phase 2 - Customer Management

- Customer CRUD.
- Conversation management.
- Customer status.
- Data extraction.
- Excel export.

## Phase 3 - AI Agent

- AI configuration.
- Knowledge base.
- AI response.
- Human handoff.

## Phase 4 - WhatsApp

- WhatsApp connection.
- Incoming webhook.
- Outgoing message.
- Conversation synchronization.

## Phase 5 - Deal

- Deal management.
- Potential deal detection.
- Deal confirmation.
- Automatic customer status update.

## Phase 6 - Follow Up

- Follow-up scheduler.
- WhatsApp follow-up.
- Email follow-up.
- Stop conditions.

## Phase 7 - Data Protection

- Forbidden data rules.
- Detection.
- Masking/blocking.
- Audit logs.

## Phase 8 - HubSpot

- OAuth/connect.
- Customer sync.
- Deal sync.
- Field mapping.
- Sync logs.

---

# 25. Recommended MVP User Journey

```text
Landing Page
     ↓
Register
     ↓
Create Business
     ↓
Dashboard
     ↓
Create AI Agent
     ↓
Input Business Knowledge
     ↓
Connect WhatsApp
     ↓
AI Agent Active
     ↓
Customer Chat
     ↓
Customer Data Automatically Created
     ↓
Customer Becomes Prospect
     ↓
Follow Up
     ↓
Customer Deal
     ↓
Deal Automatically Recorded
     ↓
Optional HubSpot Sync
```

---

# 26. Success Metrics

Platform dapat mengukur:

- Jumlah conversation.
- AI response rate.
- Human handoff rate.
- Customer acquisition.
- Prospect conversion.
- Deal conversion.
- Follow-up response rate.
- Follow-up conversion.
- Average response time.
- AI resolution rate.
- Failed AI response.
- WhatsApp message volume.

---

# 27. Arsitektur Tingkat Tinggi

```text
                    ┌──────────────────┐
                    │   Landing Page   │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ Authentication   │
                    └────────┬─────────┘
                             │
             ┌───────────────┴───────────────┐
             │                               │
      ┌──────▼──────┐                ┌──────▼──────┐
      │ User Portal │                │ Admin Portal│
      └──────┬──────┘                └──────┬──────┘
             │                               │
             └───────────────┬───────────────┘
                             │
                     ┌───────▼────────┐
                     │ Backend / API  │
                     └───────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
   ┌──────▼─────┐     ┌──────▼──────┐    ┌──────▼──────┐
   │ MySQL      │     │ AI Service  │    │ Scheduler   │
   └────────────┘     └──────┬──────┘    └──────┬──────┘
                              │                  │
                 ┌────────────┼──────────────────┤
                 │            │                  │
          ┌──────▼─────┐ ┌────▼──────┐    ┌──────▼──────┐
          │ WhatsApp   │ │ HubSpot   │    │ Email      │
          └────────────┘ └───────────┘    └─────────────┘
```

---

# 28. Catatan Arsitektur Penting

Stack yang diminta adalah:

```text
Frontend  → NestJS + Tailwind CSS
Backend   → Next.js
Database  → MySQL
```

Namun untuk implementasi produksi, arsitektur yang lebih umum adalah:

```text
Frontend  → Next.js + Tailwind CSS
Backend   → NestJS
Database  → MySQL
```

Alasannya:

- Next.js memang dirancang sebagai framework React untuk frontend/full-stack web.
- NestJS dirancang khusus untuk aplikasi server/backend dan API.
- Struktur tersebut lebih mudah dipisahkan menjadi frontend dan backend.
- NestJS sangat cocok untuk modul seperti authentication, webhook WhatsApp, scheduler, integration API, dan business logic.

**Rekomendasi:** gunakan **Next.js + Tailwind CSS sebagai frontend** dan **NestJS sebagai backend**, kecuali ada alasan khusus mengapa tim ingin membalik keduanya.

---

# 29. Prinsip Pengembangan

Prioritas pengembangan:

```text
Reliable
   ↓
Secure
   ↓
Simple
   ↓
Scalable
   ↓
Advanced AI
```

Jangan menjadikan AI sebagai satu-satunya sumber kebenaran untuk data bisnis penting.

AI bertugas:

- memahami percakapan,
- mengklasifikasikan customer,
- mengekstrak informasi,
- membantu menjawab,
- memberikan rekomendasi.

Database dan business rules tetap menjadi sumber data utama.

---

# 30. Final Product Vision

Produk akhir diharapkan menjadi sebuah:

> **AI WhatsApp Business Agent + Mini CRM**

yang mengubah:

```text
WhatsApp Chat
      ↓
AI Customer Service
      ↓
Customer Data
      ↓
Prospect
      ↓
Follow Up
      ↓
Deal
      ↓
CRM / HubSpot
```

Dengan tujuan akhir:

**"Setiap chat pelanggan tidak lagi hilang sebagai percakapan, tetapi berubah menjadi data dan peluang bisnis yang dapat ditindaklanjuti."**
