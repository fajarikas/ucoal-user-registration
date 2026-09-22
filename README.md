# Ucoal User Registration System with Email Notification

Sistem pendaftaran pengguna (User Registration) dengan notifikasi email otomatis menggunakan arsitektur modern:
- **Frontend**: [Next.js](https://nextjs.org/) (React 19 + TypeScript + Tailwind CSS)
- **Backend**: [Golang](https://go.dev/) ([Fiber v2](https://gofiber.io/))
- **Database**: SQLite dengan [GORM](https://gorm.io/)
- **Email Service**: SMTP menggunakan [Ethereal Email](https://ethereal.email/)

---

## 🚀 Fitur Utama
1. **Pendaftaran Pengguna (User Registration)**:
   - Form pendaftaran simpel: Nama Lengkap, Email, Password, Konfirmasi Password.
   - Validasi input di sisi klien dan server.
   - Enkripsi password menggunakan `bcrypt`.
   - Pencegahan email duplikat.
2. **Notifikasi Email Otomatis**:
   - Setelah pendaftaran berhasil, sistem backend Golang Fiber otomatis mengirimkan pesan teks pemberitahuan ke email pendaftar via Ethereal SMTP.
   - Pesan teks: *"Halo [Nama], Pendaftaran akun Anda berhasil. Anda telah terdaftar dalam sistem. Terima kasih."*
3. **Penyimpanan Database**:
   - Data user tersimpan secara persisten pada SQLite database (`users.db`).
4. **Daftar User & Monitoring SMTP**:
   - Menampilkan daftar pengguna yang telah terdaftar secara real-time.
   - Informasi koneksi SMTP dan akses langsung ke web mailbox Ethereal Email.

---

## 📂 Struktur Proyek

```text
ucoal-test/
├── backend/
│   ├── config/
│   │   └── database.go        # Koneksi SQLite & AutoMigrate GORM
│   ├── handlers/
│   │   └── user_handler.go    # Handler Register, GetUsers, SmtpInfo
│   ├── models/
│   │   └── user.go            # User model & request/response DTOs
│   ├── services/
│   │   └── email.go           # SMTP Email notification service
│   ├── .env                   # Environment variable backend
│   ├── .env.example           # Contoh template environment
│   ├── go.mod                 # Go module definition
│   ├── go.sum
│   └── main.go                # Server entry point & routing Fiber
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css    # Styling & Glassmorphism design
│   │   │   ├── layout.tsx     # Root Layout Next.js
│   │   │   └── page.tsx       # Halaman utama aplikasi
│   │   └── components/
│   │       ├── RegistrationCard.tsx  # Form registrasi user
│   │       ├── UserListCard.tsx      # Tabel/Daftar user terdaftar
│   │       └── SmtpStatusCard.tsx    # Informasi & status gateway SMTP
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## 🛠️ Cara Menjalankan Aplikasi

### 1. Menjalankan Backend (Golang Fiber)

Pastikan Go telah terpasang (Go 1.20+):

```bash
cd backend

# Salin file .env jika belum ada
cp .env.example .env

# Jalankan server Fiber
go run main.go
```
Backend akan berjalan di `http://localhost:8080`.

### 2. Menjalankan Frontend (Next.js)

Pastikan Node.js telah terpasang (Node 18+):

```bash
cd frontend

# Install dependensi
npm install

# Jalankan development server
npm run dev
```
Frontend akan berjalan di `http://localhost:3000`.

---

## 📬 Konfigurasi SMTP (Ethereal Email)

Akun Ethereal Email yang digunakan pada aplikasi ini:
- **Host**: `smtp.ethereal.email`
- **Port**: `587`
- **Username**: `is4uwuqeitbihotj@ethereal.email`
- **Password**: `ED3d2RwtHUdnygRvdB`
- **Web Mailbox**: [https://ethereal.email/messages](https://ethereal.email/messages)

Untuk melihat email yang masuk:
1. Buka [https://ethereal.email/login](https://ethereal.email/login)
2. Masuk menggunakan username dan password di atas.
3. Buka tab **Messages** untuk membaca pesan yang terkirim.

---

## 🌐 Dokumentasi API Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/health` | Health check status server |
| `POST` | `/api/register` | Mendaftarkan pengguna baru & mengirim notifikasi email |
| `GET` | `/api/users` | Mengambil seluruh daftar pengguna dari database |
| `GET` | `/api/smtp-info` | Informasi konfigurasi SMTP dan tautan kotak masuk Ethereal |

### Contoh Request `POST /api/register`:
```json
{
  "name": "Budi Santoso",
  "email": "budi.santoso@example.com",
  "password": "password123"
}
```

### Contoh Response `201 Created`:
```json
{
  "message": "User berhasil didaftarkan",
  "email_status": "Email notifikasi berhasil dikirim via Ethereal SMTP",
  "user": {
    "id": 1,
    "name": "Budi Santoso",
    "email": "budi.santoso@example.com",
    "created_at": "2026-09-23T00:48:34.791396+07:00"
  }
}
```

---

## 👥 Collaborators
Sesuai instruksi, akun GitHub berikut telah ditambahkan sebagai collaborator:
- `demakalfredo`
- `rizalda96`
