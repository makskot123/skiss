import { locales } from '@/lib/i18n';
import Link from 'next/link';
import { getDictionary } from '@/lib/i18n';

type Props = {
  params: Promise<{ locale: string }>;
};

async function SafetyPage({ params }: Props) {
  const { locale } = await params;
  const dict = getDictionary(locale as any);

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
                href={`/${loc}/safety`}
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

      {/* Hero with Disclaimer */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {dict.safety.title}
          </h1>
          <p className="text-xl text-red-50 mb-6">
            {dict.safety.subtitle}
          </p>
          <div className="p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <p className="text-yellow-100 text-lg leading-relaxed">
              🚨 <strong className="font-bold">Legal Disclaimer:</strong> {dict.safety.disclaimer}
            </p>
          </div>
        </div>
      </div>

      {/* Avalanche Danger Scale */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">
          {dict.safety.avalancheScale}
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          The European avalanche danger scale (EAWS) ranges from 1 (Low) to 5 (Extreme). Consistent with
          everyone in the area and compare your intended route with others.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`rounded-xl p-6 border-2 ${
                level <= 2
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-800'
                  : level === 3
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 dark:border-yellow-800'
                    : level <= 5
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-800'
                      : ''
              }`}
            >
              <div className={`text-4xl font-bold mb-2 ${
                level <= 2
                  ? 'text-green-600 dark:text-green-400'
                  : level === 3
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : level <= 5
                      ? 'text-red-600 dark:text-red-400'
                      : ''
              }`}>
                {level}
              </div>
              <h3 className={`text-xl font-bold mb-2 ${
                level <= 2
                  ? 'text-green-800 dark:text-green-200'
                  : level === 3
                    ? 'text-yellow-800 dark:text-yellow-200'
                    : level <= 5
                      ? 'text-red-800 dark:text-red-200'
                      : ''
              }`}>
                {dict.safety.dangerLevels[level.toString()]}
              </h3>
              <p
                className={`text-sm ${
                  level <= 2
                    ? 'text-green-700 dark:text-green-300'
                    : level === 3
                      ? 'text-yellow-700 dark:text-yellow-300'
                      : level <= 5
                        ? 'text-red-700 dark:text-red-300'
                        : ''
                }`}
              >
                {dict.safety.dangerDescription[level.toString()]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pre-Trip Checklist */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">
          {dict.safety.preTourChecklist.title}
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
          Before heading out, check off this essential checklist
        </p>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-8 shadow-lg">
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(dict.safety.preTourChecklist).map(([key, value]) => (
              <div key={key} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 mt-0.5">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold dark:text-white">
                    {dict.safety.preTourChecklist[key]}
                  </h3>
                  {key === 'gear' && (
                    <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>{dict.safety.gear.transceiver}</p>
                      <p>{dict.safety.gear.probe}</p>
                      <p>{dict.safety.gear.shovel}</p>
                      <p>{dict.safety.gear.airbag}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Official Bulletins */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">
          {dict.safety.officialBulletins}
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
          Check official sources before every trip. These are just starting points - always verify with
          local forecast centers.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <a
            href="https://www.slf.ch"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 p-6 hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              SLF Switzerland
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Swiss Federal Institute for Snow and Avalanche Research
            </div>
            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
              Visit →
            </span>
          </a>

          <a
            href="https://www.meteofrance.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 p-6 hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              Météo-France
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              French weather and avalanche forecasts
            </div>
            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
              Visit →
            </span>
          </a>

          <a
            href="https://www.lawinen.info"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 p-6 hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              lawinen.info Austria
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Austrian avalanche forecasts and conditions
            </div>
            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
              Visit →
            </span>
          </a>

          <a
            href="https://www.varsom.no/en/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 p-6 hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              varsom.no Norway
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Norwegian warnings and highway clearance
            </div>
            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
              Visit →
            </span>
          </a>

          <a
            href="https://www.topr.bg/en"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 p-6 hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              TOPR Bulgaria
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Tourist organization of the Rhodope Mountains
            </div>
            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
              Visit →
            </span>
          </a>

          <a
            href="https://www.powderguides.com/avalanche/forecasts/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 p-6 hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              PowderGuides
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Avalanche bulletins for popular destinations
            </div>
            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
              Visit →
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default SafetyPage;