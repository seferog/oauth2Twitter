/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["pbs.twimg.com", "cdn.discordapp.com", "imagedelivery.net"],
  },
};

module.exports = nextConfig;
