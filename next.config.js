/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en", "ru"],
    defaultLocale: "en",
  },
  images: {
    domains: ["images.unsplash.com"],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
