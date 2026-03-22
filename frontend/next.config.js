/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow requests to backend
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
