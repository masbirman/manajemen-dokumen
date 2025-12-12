# Panduan Deployment ke Dokploy

Berikut langkah-langkah untuk deploy project ini ke Dokploy untuk testing mobile.

## 1. Persiapan Dokploy

1.  Pastikan Anda sudah login ke panel Dokploy.
2.  Masuk ke Project **"Manajemen Dokumen"**.
3.  Klik tombol **"Create Service"** -> Pilih **"Compose"**.

## 2. Konfigurasi Service

Setelah Service Compose dibuat (beri nama misal `docscanner-prod`):

1.  **Tab "Source"**:
    *   **Repository URL**: Masukkan URL GitHub repository Anda (pastikan akun GitHub sudah terhubung di Dokploy atau repo bersifat Public).
    *   **Branch**: `main`
    *   **Compose Path**: `/docker-compose.prod.yml`
        *   *Note: Saya sudah membuatkan file khusus `docker-compose.prod.yml` di repository yang dioptimalkan untuk production.*

2. **Tab "Environment"**:
    Salin dan paste Variable berikut ke kolom Environment di Dokploy:
    
    ```env
    # --- Backend Laravel Config ---
    APP_ENV=production
    APP_DEBUG=false
    APP_KEY=base64:YOUR_APP_KEY_HERE  <-- (Generate di local: php artisan key:generate --show)
    APP_URL=http://103.150.227.7:8000
    
    # --- Database Config (Dari Screenshot Dokploy Database) ---
    DB_CONNECTION=mysql
    DB_HOST=manajemen-dokumen-scanner-pixzpd  <-- Internal Host
    DB_PORT=3306
    DB_DATABASE=mysql                         <-- Database Name
    DB_USERNAME=mysql                         <-- User
    DB_PASSWORD=yhzmhe8wwptdbjus              <-- Password
    
    # --- Frontend Config ---
    NEXT_PUBLIC_API_URL=http://103.150.227.7:8000
    ```

    *Catatan: Pastikan Service Database dan Service App Anda berada di "Network" yang sama di Dokploy jika menggunakan Internal Host.*

3.  **Tab "Deploy"**:
    *   Klik **"Deploy"**.

## 3. Akses Aplikasi

Aplikasi berjalan di server:

*   **Frontend**: `http://103.150.227.7:3000`
*   **Backend API**: `http://103.150.227.7:8000`

## 4. Troubleshooting

*   **Gambar Tidak Muncul**: Pastikan setting `NEXT_PUBLIC_API_URL` sudah benar mengarah ke IP Server, bukan `localhost`. Mobile tidak bisa akses `localhost` server.
*   **Build Gagal**: Cek tab "Logs" di Dokploy untuk melihat error detail.
*   **Database Error**: Pastikan container `mysql` sudah berjalan (status Healthcheck OK atau running).
