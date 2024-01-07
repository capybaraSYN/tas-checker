/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MAESTRO_KEY: process.env.MAESTRO_KEY,
  },
}

module.exports = nextConfig
