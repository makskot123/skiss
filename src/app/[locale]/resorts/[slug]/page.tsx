import { notFound } from 'next/navigation';
import Link from 'next/link';
import { locales } from '@/lib/i18n';
import { fetchResort } from '@/lib/data';
import { getDictionary } from '@/lib/i18n';
import { formatDate } from '@/lib/i18n';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

async function ResortPage({ params }: Props) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale as any);
  const resort = await fetchResort(slug);

  if (!resort) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white dark:from-slate-900 to-slate-50 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/${locale}`} className="text-2xl font-bold text-slate-800 dark:text-white">
            Freeride Atlas
          </Link>
          <nav className="flex items-center gap-6">
            {locales.map((loc) => (
              <Link
                key={loc}
                href={`/${loc}/resorts/${slug}`}
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

      {/* Hero Image */}
      <div className="relative h-[400px] bg-gray-200 overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('${resort.image.src}')] bg-cover bg-center"
          alt={`${resort.name} - ${resort.image.alt || ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold">
                {resort.terrainDifficulty}/5
              </span>
              <span className="text-white/90 text-sm">freeride difficulty</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
              {resort.name}
            </h1>
            <p className="text-xl text-white/90">
              {resort.region}, {resort.country}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-3xl font-bold dark:text-white mb-4">
                About {resort.name}
              </h2>
              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                <p>{resort.description}</p>
              </div>
            </section>

            {/* Key Stats */}
            <section className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-xl font-bold dark:text-white mb-4">
                Key Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Elevation Range</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">
                    {resort.minElevation}m - {resort.maxElevation}m
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Vertical Drop</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">
                    {resort.verticalDrop}m
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Lift Pass Price</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {resort.approxLiftPassPrice}€
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Season</p>
                  <p className="text-lg font-medium text-slate-800 dark:text-white">
                    {formatDate(resort.seasonStart, locale)}
                    {' → '}
                    {formatDate(resort.seasonEnd, locale)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Transfer from Airport</p>
                  <p className="text-lg font-medium text-slate-800 dark:text-white">
                    {resort.nearestAirport}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Transfer Time</p>
                  <p className="text-lg font-medium text-slate-800 dark:text-white">
                    {resort.transferTime} min
                  </p>
                </div>
              </div>
            </section>

            {/* Terrain and Overview */}
            <section className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-xl font-bold dark:text-white mb-4">
                Terrain Overview
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Number of Lifts
                    </p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">
                      {resort.numberOfLifts}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Lift Types
                    </p>
                    <p className="text-lg font-medium text-slate-800 dark:text-white">
                      {resort.lifts.join(', ')}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Lift-Accesible Off-Piste
                  </p>
                  <div className="flex items-center gap-2">
                    {resort.liftAccessibleOffPiste ? (
                      <>
                        <svg
                          className="w-5 h-5 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          Available
                        </span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          Not Available
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Ski Touring Access
                  </p>
                  <div className="flex items-center gap-2">
                    {resort.skiTouringAccess ? (
                      <>
                        <svg
                          className="w-5 h-5 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          Available
                        </span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          Not Available
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Average Annual Snowfall
                  </p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">
                    {resort.averageSnowfall} cm
                  </p>
                </div>

                {/* Coverage Status */}
                {resort.coverage.verified === false && (
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>⚠️ Information status:</strong> Some data may be approximate.
                      Last verified: {formatDate(resort.coverage.lastVerified, locale)}
                      {resort.coverage.notes && `. ${resort.coverage.notes}`}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Suitability */}
            <section className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-xl font-bold dark:text-white mb-4">
                Suitable For
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Beginners</span>
                    <span className={`text-sm font-medium ${
                      resort.suitability.beginners >= 3
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {dict.badge[resort.suitability.beginners >= 3 ? 'expert' : 'beginner']}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        resort.suitability.beginners >= 3
                          ? 'bg-green-600'
                          : 'bg-yellow-500'
                      }`}
                      style={{ width: `${resort.suitability.beginners * 20}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Intermediates</span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {resort.suitability.intermediates >= 3 ? dict.badge.intermediate : 'Intermediate'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${resort.suitability.intermediates * 20}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Experts</span>
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {resort.suitability.experts >= 3 ? dict.badge.expert : 'Expert'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${resort.suitability.experts * 20}%` }}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Tags and Links */}
          <aside className="space-y-6">
            {/* Tags */}
            <section className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold dark:text-white mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {resort.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Official Links */}
            <section className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold dark:text-white mb-4">
                Official Links
              </h3>
              <a
                href={resort.officialLinks.resort}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mb-3 px-4 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
              >
                Official Resort Website
              </a>

              {resort.officialLinks.webcam && (
                <a
                  href={resort.officialLinks.webcam}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2 bg-gray-200 dark:bg-slate-700 text-center rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors text-sm"
                >
                  Webcam
                </a>
              )}

              {resort.officialLinks.snowReport && (
                <a
                  href={resort.officialLinks.snowReport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2 bg-gray-200 dark:bg-slate-700 text-center rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors text-sm"
                >
                  Snow Report
                </a>
              )}
            </section>

            {/* Back to resorts */}
            <Link
              href={`/${locale}/resorts`}
              className="block text-center px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              ← Back to all resorts
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ResortPage;

// Revalidate resort data periodically
export const revalidate = 3600;