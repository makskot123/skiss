import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metaMetadata = {
  title: 'Freeride Atlas – Plan your perfect freeride trip in Europe',
  description: 'Find the best European ski resorts for off-piste skiing, avalanche safety information, trip planning, and gear guides. Explore over 30 resorts across the Alps, Pyrenees, and beyond.',
  keywords: ['freeride', 'off-piste', 'ski resort', 'avalanche safety', 'Europe', 'winter sports'],
  authors: [{ name: 'Freeride Atlas' }],
  openGraph: {
    title: 'Freeride Atlas – Epic Freeride Terrain in Europe',
    description: 'Discover the best European resorts for off-piste skiing and avalanche safety guides.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}