const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();
// jeśli Twój plik i18n jest w innym miejscu: createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/skisa',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

module.exports = withNextIntl(nextConfig);