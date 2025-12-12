#!/bin/bash
set -e

# Install composer dependencies if vendor doesn't exist
if [ ! -d "/var/www/html/vendor" ]; then
    echo "Installing Composer dependencies..."
    cd /var/www/html
    composer install --no-dev --optimize-autoloader --no-interaction
fi

# Run Laravel optimizations for production
if [ -f "/var/www/html/artisan" ]; then
    echo "Running Laravel optimizations..."
    cd /var/www/html
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
    
    # Run migrations
    php artisan migrate --force || true
    
    # Seed admin user if needed
    php artisan db:seed --class=AdminSeeder --force || true
fi

# Execute the main command (php-fpm)
exec "$@"
