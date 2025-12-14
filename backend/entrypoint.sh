#!/bin/sh
set -e

cd /var/www/html

if [ ! -f "/var/www/html/public/index.php" ]; then
    echo "Copying public files to volume..."
    cp -r /public-build/* /var/www/html/public/
fi

mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views storage/app/public bootstrap/cache
chmod -R 777 storage bootstrap/cache

php artisan storage:link 2>/dev/null || true
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true
php artisan migrate --force || true

echo "Starting PHP-FPM..."
exec php-fpm
