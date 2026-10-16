import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import dictionaries from './dictionaries.json';
import type { Dict } from 'next-intl';

export type Locale = 'pl' | 'en';

export const locales: Locale[] = ['pl', 'en'];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (dictionaries as any)[locale],
  };
});

// Helper to get dictionary for a specific locale
export function getDictionary(locale: Locale): Dict {
  return (dictionaries as any)[locale];
}

// Helper to format dates according to locale
export function formatDate(date: string, locale: Locale = 'pl'): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

// Helper to get localized property name for sorting
export function getSortableName(name: string, locale: Locale): string {
  if (locale === 'pl') {
    // Simple Polish alphabet: A B C Ć D E Ł F G H I J K L Ł M N O Ó P R S Ś T U W Z Ż
    const polishMap: Record<string, number> = {
      A: 1, B: 2, C: 3, 'Ć': 4, D: 5, E: 6, 'Ł': 7, F: 8, G: 9, H: 10,
      I: 11, J: 12, K: 13, L: 14, 'Ł': 15, M: 16, N: 17, O: 18, 'Ó': 19,
      P: 20, R: 21, S: 22, 'Ś': 23, T: 24, U: 25, W: 26, Z: 27, 'Ż': 28,
    };
    return {
      name,
      weight: polishMap[name[0].toUpperCase()] || 1000 + name.charCodeAt(0),
      original: name,
    };
  } else {
    return {
      name,
      weight: name.codePointAt(0) || 1000,
      original: name,
    };
  }
}