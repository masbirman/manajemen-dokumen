# 🚀 Panduan Deployment ke Dokploy

Panduan lengkap untuk deploy project "Manajemen Dokumen" ke VPS dengan Dokploy.

---

## 📋 Prerequisite

- ✅ VPS sudah terinstall Docker
- ✅ Dokploy sudah terinstall dan bisa diakses
- ✅ Project "Manajemen Dokumen" sudah dibuat di Dokploy
- ✅ Repository GitHub sudah terhubung ke Dokploy (Settings → Git)

---

## 🔧 STEP 1: Buat Database Service (MySQL)

1. Di project **"Manajemen Dokumen"**, klik **"+ Create Service"**
2. Pilih **"Database"** → **"MySQL"**
3. Konfigurasi:
   - **Name**: `docscanner-db`
   - **Database Name**: `docscanner`
   - **Database User**: `docscanner`
   - **Database Password**: (generate otomatis atau set manual, **CATAT PASSWORD INI!**)
   - **Database Root Password**: (generate otomatis atau set manual)
4. Klik **"Create"**
5. Tunggu sampai database status **"Running"**
6. Catat **Internal Host** dari tab "General" (contoh: `docscanner-db-xxxxxx`)

---

## 🔧 STEP 2: Buat Compose Service (Backend + Frontend)

1. Klik **"+ Create Service"** → Pilih **"Compose"**
2. Beri nama: `docscanner-app`

### Tab "General":
- **Name**: `docscanner-app`
- **Description**: Backend Laravel & Frontend Next.js

### Tab "Source":
- **Provider**: GitHub
- **Repository**: Pilih repository project Anda
- **Branch**: `main`
- **Compose Path**: `docker-compose.prod.yml`
  > ⚠️ Jangan pakai "/" di depan, langsung nama file saja

---

## 🔧 STEP 3: Environment Variables

Di tab **"Environment"**, salin dan paste variabel berikut:

```env
# ===== BACKEND LARAVEL CONFIG =====
APP_NAME="Document Scanner"
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:NIafqr69A5TEM8SB87JbqiKf7IkhTV5sNU+Y86NsPjE=
APP_TIMEZONE=Asia/Makassar
APP_URL=http://103.235.75.221:8001

APP_LOCALE=id
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=id_ID

# ===== DATABASE CONFIG =====
# Ganti dengan Internal Host dari Database Service yang dibuat di Step 1
DB_CONNECTION=mysql
DB_HOST=docscanner-db-xxxxxx
DB_PORT=3306
DB_DATABASE=docscanner
DB_USERNAME=docscanner
DB_PASSWORD=YOUR_DATABASE_PASSWORD_HERE

# ===== SESSION & CACHE =====
SESSION_DRIVER=database
SESSION_LIFETIME=120
CACHE_STORE=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=public

# ===== SANCTUM (API AUTH) =====
SANCTUM_STATEFUL_DOMAINS=103.235.75.221:3001,103.235.75.221,localhost:3000

# ===== CORS =====
FRONTEND_URL=http://103.235.75.221:3001

# ===== FRONTEND NEXT.JS CONFIG =====
NEXT_PUBLIC_API_URL=http://103.235.75.221:8001
```

### ⚠️ PENTING - Yang Harus Diganti:
1. **DB_HOST**: Ganti `docscanner-db-xxxxxx` dengan Internal Host dari database service
2. **DB_PASSWORD**: Ganti dengan password database yang sudah di-set

---

## 🔧 STEP 4: Network Configuration

Pastikan Database dan Compose Service berada di network yang sama:

1. Buka **Database Service** (`docscanner-db`)
2. Tab **"Advanced"** → Cek nama **Network** (atau buat baru)
3. Buka **Compose Service** (`docscanner-app`)  
4. Tab **"Advanced"** → Set **Network** yang sama dengan database

> Atau biarkan default, Dokploy biasanya menangani ini secara otomatis dalam satu project.

---

## 🚀 STEP 5: Deploy

1. Buka Compose Service `docscanner-app`
2. Klik tab **"Deploy"**
3. Klik tombol **"Deploy"**
4. Tunggu proses build selesai (bisa 5-10 menit pertama kali)
5. Pantau progress di tab **"Logs"**

---

## 🔧 STEP 6: Post-Deployment Setup

Setelah deployment berhasil, jalankan perintah setup Laravel:

### Via Dokploy Terminal atau SSH ke VPS:

```bash
# Masuk ke container app
docker exec -it docscanner-app-prod bash

# Jalankan perintah setup
php artisan migrate --force
php artisan storage:link
php artisan optimize:clear
php artisan filament:cache-components

# Exit container
exit
```

### Atau langsung dari host:

```bash
docker exec docscanner-app-prod php artisan migrate --force
docker exec docscanner-app-prod php artisan storage:link
docker exec docscanner-app-prod php artisan optimize:clear
docker exec docscanner-app-prod php artisan filament:cache-components
```

---

## 🌐 STEP 7: Akses Aplikasi

Setelah deployment berhasil:

| Service | URL |
|---------|-----|
| **Frontend (Next.js)** | http://103.235.75.221:3001 |
| **Backend API (Laravel)** | http://103.235.75.221:8001 |
| **Admin Panel (Filament)** | http://103.235.75.221:8001/admin |

---

## 🔥 Firewall Settings

Pastikan port berikut terbuka di VPS:

```bash
# UFW (Ubuntu)
sudo ufw allow 8001/tcp  # Laravel Backend
sudo ufw allow 3001/tcp  # Next.js Frontend
sudo ufw reload
```

---

## 🐛 Troubleshooting

### 1. Database Connection Refused
- Pastikan **DB_HOST** menggunakan **Internal Host** (bukan IP)
- Pastikan database service sudah **Running**
- Pastikan network sama antara app dan database

### 2. 504 Gateway Timeout
- PHP-FPM mengalami timeout
- Cek logs: `docker logs docscanner-app-prod`
- Pastikan database bisa diakses

### 3. CORS Error di Frontend
- Pastikan `SANCTUM_STATEFUL_DOMAINS` sudah include domain frontend
- Pastikan `FRONTEND_URL` sudah benar

### 4. Images/Assets Tidak Muncul
- Jalankan: `docker exec docscanner-app-prod php artisan storage:link`
- Pastikan `NEXT_PUBLIC_API_URL` mengarah ke IP server (bukan localhost)

### 5. Build Gagal
- Cek tab **"Logs"** di Dokploy untuk error detail
- Pastikan Dockerfile dan docker-compose.prod.yml tidak ada syntax error

---

## 📊 Monitoring

Gunakan fitur Dokploy untuk monitoring:
- **Logs**: Lihat real-time logs dari container
- **Stats**: CPU, Memory, Network usage
- **Terminal**: Akses shell container langsung

---

## 🔄 Re-Deploy (Update)

Untuk update aplikasi setelah push kode baru:

1. Buka Compose Service `docscanner-app`
2. Klik **"Deploy"** → Deploy ulang
3. Atau aktifkan **Auto Deploy** untuk deploy otomatis saat ada push ke branch

---

*Terakhir diupdate: 13 Desember 2025*
