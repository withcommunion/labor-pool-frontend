/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  images: {
    domains: ['images.unsplash.com'],
  },
};

module.exports = nextConfig;
