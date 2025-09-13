
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/health', destination: '/api/health' }
    ];
  },
};
module.exports = nextConfig;
