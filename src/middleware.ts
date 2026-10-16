import { locales } from '@/lib/i18n';
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'pl',

  // Always use prefix for URLs
  localePrefix: 'always',

  // Only redirect on root paths
  localesDetection: true,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(pl|en)/:path*'],
};