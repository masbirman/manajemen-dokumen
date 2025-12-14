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
        destination: 'http://docscanner-backend:8000/api/:path*',
      },
      {
        source: '/auto-login',
        destination: 'http://docscanner-backend:8000/auto-login',
      },
      {
        source: '/admin/:path*',
        destination: 'http://docscanner-backend:8000/admin/:path*',
      },
      {
        source: '/admin',
        destination: 'http://docscanner-backend:8000/admin',
      },
      {
        source: '/storage/:path*',
        destination: 'http://docscanner-backend:8000/storage/:path*',
      },
      {
        source: '/sanctum/:path*',
        destination: 'http://docscanner-backend:8000/sanctum/:path*',
      },
      {
        source: '/livewire/:path*',
        destination: 'http://docscanner-backend:8000/livewire/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

