# Document Scanner Application

Aplikasi untuk input data dengan fitur scan dokumen mobile, penyimpanan ke database, dan admin panel untuk manajemen data dropdown.

## Requirements

- Docker Desktop
- Node.js 18+ (untuk development lokal)
- Composer (untuk development lokal)

## Quick Start dengan Docker

### 1. Clone dan Setup

```bash
cd "D:\PROJECT 2025"

# Copy environment file untuk Laravel
copy backend\.env.docker backend\.env

# Generate APP_KEY (jalankan setelah container up)
docker-compose exec app php artisan key:generate
```

### 2. Jalankan Docker Containers

```bash
docker-compose up -d --build
```

### 3. Setup Laravel

```bash
# Install dependencies
docker-compose exec app composer install

# Generate key
docker-compose exec app php artisan key:generate

# Create storage link
docker-compose exec app php artisan storage:link

# Run migrations
docker-compose exec app php artisan migrate

# Run seeders (optional)
docker-compose exec app php artisan db:seed
```

### 4. Install Frontend Dependencies

```bash
cd frontend
npm install
```

## Akses Aplikasi

| Service | URL |
|---------|-----|
| Frontend (Next.js) | http://localhost:3000 |
| Backend API (Laravel) | http://localhost:8000 |
| PHPMyAdmin | http://localhost:8080 |
| Filament Admin | http://localhost:8000/admin |

## Database Credentials

| Key | Value |
|-----|-------|
| Host | mysql (dalam Docker) / localhost:3306 (dari host) |
| Database | docscanner |
| Username | docscanner |
| Password | secret |
| Root Password | root |

## Struktur Project

```
PROJECT 2025/
├── docker-compose.yml     # Docker configuration
├── docker/
│   ├── nginx/
│   │   └── default.conf   # Nginx config
│   └── php/
│       ├── Dockerfile     # PHP-FPM image
│       └── local.ini      # PHP config
├── backend/               # Laravel API + Filament Admin
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── ...
└── frontend/              # Next.js Application
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── lib/
    │   └── types/
    └── ...
```

## Commands Cheatsheet

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Laravel artisan (dalam container)
docker-compose exec app php artisan <command>

# Composer (dalam container)
docker-compose exec app composer <command>

# Frontend dev (lokal)
cd frontend && npm run dev

# Build frontend
cd frontend && npm run build
```

## Features

- [x] Form input dengan dropdown dinamis
- [x] Cascade dropdown (PPTK filter by Unit)
- [x] Document scanner (mobile only)
- [x] Single page & multi-page scan
- [x] PDF preview sebelum submit
- [x] Tabel data format Excel
- [x] Role-based access control
- [x] Excel import untuk dropdown data

## Admin Credentials

| Key | Value |
|-----|-------|
| Email | admin@docscanner.local |
| Password | password |

