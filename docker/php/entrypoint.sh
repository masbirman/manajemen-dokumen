#!/bin/bash
set -e

# Navigate to Laravel directory
cd /var/www/html

echo "Starting Laravel application setup..."

# Install Composer dependencies if vendor directory doesn't exist or is incomplete
if [ ! -d "vendor" ] || [ ! -f "vendor/autoload.php" ]; then
    echo "Installing Composer dependencies..."
    COMPOSER_ALLOW_SUPERUSER=1 composer install --no-interaction --no-dev --optimize-autoloader
fi

# Wait a moment to ensure everything is ready
sleep 2

# Clear caches first
echo "Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

# Publish Filament assets (CRITICAL for sidebar to work!)
echo "Publishing Filament assets..."
php artisan filament:assets

# Set proper permissions for storage and cache
echo "Setting permissions..."
chmod -R 775 storage bootstrap/cache 2>/dev/null || true
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

# Optimize for production
echo "Optimizing for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create storage link if not exists
php artisan storage:link 2>/dev/null || true

# Start PHP-FPM
echo "Starting PHP-FPM..."
exec php-fpm
