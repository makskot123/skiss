import { locales, getDictionary } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export async function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale as any);
  const t = await getTranslations({ locale });

  return {
    title: `${t('common.loading')} | ${dict.nav.resorts}`,
    description: dict.resorts.subtitle,
    alternates: {
      canonical: `/${locale}`,
    },
  };
}

export default function LocaleLayout({
  children,
  params,
}: Props) {
  const { locale } = params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  return <>{children}</>;
}