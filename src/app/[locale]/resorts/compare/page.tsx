import { redirect } from 'next/navigation';
import Link from 'next/link';
import { locales } from '@/lib/i18n';
import { fetchResorts, getEnglishDictionary } from '@/lib/data';
import { getDictionary } from '@/lib/i18n';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';

type Props = {
  searchParams: Promise<{ slug1?: string; slug2?: string; slug3?: string; slug4?: string }>;
  params: Promise<{ locale: string }>;
};

async function CompareResortsPage({ searchParams, params }: Props) {
  const { locale } = await params;
  const { slug1, slug2, slug3, slug4 } = await searchParams;
  const dict = getDictionary(locale as any);
  const dictEn = getEnglishDictionary();

  if (!slug1 && !slug2) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white dark:from-slate-900 to-slate-50 dark:to-slate-800 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <h1 className="text-3xl font-bold dark:text-white mb-4">
            {dict.comparison.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Select at least 2 resorts to compare
          </p>
          <Link href={`/${locale}/resorts`}>
            <Button>
              Browse Resorts
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const resortSlugs = [slug1, slug2, slug3, slug4].filter(Boolean) as string[];
  const resorts = await Promise.all(resortSlugs.map(fetchResort));

  // Filter out null resorts
  const validResorts = resorts.filter((r): r is any => r !== null);

  if (validResorts.length < 2) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white dark:from-slate-900 to-slate-50 dark:to-slate-800 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <h1 className="text-3xl font-bold dark:text-white mb-4">
            No Resorts Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please select at least 2 valid resorts
          </p>
          <Link href={`/${locale}/resorts`}>
            <Button>
              Browse Resorts
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Common columns for comparison
  const comparisonColumns = [
    {
      label: dict.resorts.countries,
      key: 'country',
      render: (value: string) => <Badge variant="info">{value}</Badge>,
    },
    {
      label: 'Region',
      key: 'region',
      render: (value: string) => <Badge variant="default">{value}</Badge>,
    },
    {
      label: dict.resorts.difficulty,
      key: 'terrainDifficulty',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <Badge variant={value >= 4 ? 'danger' : value >= 3 ? 'warning' : 'success'}>
            {value}/5
          </Badge>
        </div>
      ),
    },
    {
      label: 'Elevation Range',
      key: 'minElevation',
      subKey: 'maxElevation',
      render: (min: number, resort: any, key: string) => (
        <span className="font-mono font-medium dark:text-white">
          {min}m - {resort.maxElevation}m
        </span>
      ),
    },
    {
      label: dict.resorts.price,
      key: 'approxLiftPassPrice',
      render: (value: number) => (
        <span className="text-lg font-bold text-green-600 dark:text-green-400">
          {value}€
        </span>
      ),
    },
    {
      label: 'Vertical Drop',
      key: 'verticalDrop',
      render: (value: number) => <span className="font-mono dark:text-white">{value}m</span>,
    },
    {
      label: 'Lifts',
      key: 'numberOfLifts',
      subKey: 'lifts',
      render: (count: number, resort: any) => (
        <span className="dark:text-white">
          {count} lifts ({resort.lifts.join(', ')})
        </span>
      ),
    },
    {
      label: 'Snowfall',
      key: 'averageSnowfall',
      render: (value: number) => <span className="dark:text-white">{value} cm</span>,
    },
    {
      label: dict.resorts.skiTouringAccess,
      key: 'skiTouringAccess',
      render: (value: boolean, resort: any) => (
        value ? (
          <Badge variant="success">Available</Badge>
        ) : (
          <Badge variant="danger">No</Badge>
        )
      ),
    },
    {
      label: 'Off-Piste',
      key: 'liftAccessibleOffPiste',
      render: (value: boolean) => (
        value ? (
          <Badge variant="success">Accessible</Badge>
        ) : (
          <Badge variant="danger">No</Badge>
        )
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white dark:from-slate-900 to-slate-50 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/${locale}/resorts`} className="text-2xl font-bold text-slate-800 dark:text-white">
            Freeride Atlas
          </Link>
          <nav className="flex items-center gap-6">
            {locales.map((loc) => (
              <Link
                key={loc}
                href={`/${loc}/resorts/compare?slug1=${slug1}&slug2=${slug2}&slug3=${slug3}&slug4=${slug4}`}
                className={`px-2 py-1 rounded transition-colors ${
                  locale === loc
                    ? 'bg-slate-900 dark:bg-slate-800 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {loc.toUpperCase()}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Title & Back */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">
            {dict.comparison.title}
          </h1>
          <p className="text-xl text-blue-50">
            Compare {validResorts.length} resorts side by side
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-left font-bold dark:text-white w-48">Feature</th>
                {validResorts.map((resort, index) => (
                  <th key={index} className="p-4 text-center">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white p-4 rounded-lg">
                      <div className="text-sm opacity-80 mb-1">
                        {resort.country}
                      </div>
                      <div className="text-xl font-bold">
                        {resort.name}
                      </div>
                      <div className="mt-2 flex items-center justify-center gap-2">
                        <span className="px-2 py-0.5 bg-white/20 rounded text-sm">
                          {resort.terrainDifficulty}/5
                        </span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonColumns.map((column) => (
                <tr key={column.key} className="border-b border-slate-200 dark:border-slate-700">
                  <td className="p-4 font-semibold dark:text-white">
                    {column.label}
                  </td>
                  {validResorts.map((resort) => {
                    const value = column.key === 'lifts'
                      ? resort.numberOfLifts
                      : (column.subKey ? (resort as any)[column.subKey] : resort[column.key as keyof typeof resort]);

                    return (
                      <td key={resort.slug} className="p-4 text-center">
                        {column.subKey ? (column.render?.(value, resort, column.key) as any) : (column.render?.(value, resort) as any)}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Tags Column */}
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <td className="p-4 font-semibold dark:text-white">
                  Tags
                </td>
                {validResorts.map((resort) => (
                  <td key={resort.slug} className="p-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {resort.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                      {resort.tags.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{resort.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link href={`/${locale}/resorts`}>
            <Button variant="secondary">
              ← View All Resorts
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>© 2025 Freeride Atlas. Plan responsibly.</p>
        </div>
      </footer>
    </div>
  );
}

export default CompareResortsPage;