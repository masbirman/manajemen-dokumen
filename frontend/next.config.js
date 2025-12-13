/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: [],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Proxy requests to Laravel backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://nginx:80/api/:path*',
      },
      {
        source: '/auto-login',
        destination: 'http://nginx:80/auto-login',
      },
      {
        source: '/admin/:path*',
        destination: 'http://nginx:80/admin/:path*',
      },
      {
        source: '/admin',
        destination: 'http://nginx:80/admin',
      },
      {
        source: '/storage/:path*',
        destination: 'http://nginx:80/storage/:path*',
      },
      {
        source: '/sanctum/:path*',
        destination: 'http://nginx:80/sanctum/:path*',
      },
      {
        source: '/livewire/:path*',
        destination: 'http://nginx:80/livewire/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

