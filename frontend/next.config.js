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
  // Proxy API requests to backend - eliminates CORS
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://nginx:80/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

