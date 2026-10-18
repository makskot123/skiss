import Link from 'next/link';
import { getDictionary } from '@/lib/i18n';
import { fetchResorts } from '@/lib/data';
import { formatDate } from '@/lib/i18n';

type Props = {
  params: Promise<{ locale: string }>;
};

async function HomePage({ params }: Props) {
  const { locale } = await params;
  const dict = getDictionary(locale as any);
  const resorts = await fetchResorts();

  const featured = resorts.slice(0, 3);
  const featuredColors = ['from-blue-500 to-cyan-400', 'from-purple-500 to-pink-400', 'from-orange-500 to-red-400'];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900">
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Background image placeholder */}
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url('${resorts[0].image.src}')` }}
        ></div>

        <div className="relative z-10 text-center px-4 mx-auto max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            {dict.home.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
            {dict.home.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/resorts`}
              className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              Explore Resorts
            </Link>
            <Link
              href={`/${locale}/safety`}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-lg"
            >
              Avalanche Safety
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Featured Resorts Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 dark:text-white">
            {dict.home.featuredPiste}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            Handpicked freeride destinations
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {featured.map((resort, index) => (
              <Link
                key={resort.slug}
                href={`/${locale}/resorts/${resort.slug}`}
                className="group block"
              >
                <div className={`relative h-64 rounded-xl overflow-hidden bg-gradient-to-br ${featuredColors[index]}`}>
                  {/* Resort image placeholder */}
                  <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('${resort.image.src}')` }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-sm">
                        {resort.terrainDifficulty}/5
                      </span>
                      <span className="text-sm opacity-80">
                        {resort.country}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{resort.name}</h3>
                    <p className="text-sm opacity-90 line-clamp-2">
                      {resort.description.substring(0, 100)}...
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href={`/${locale}/resorts`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all {dict.resorts.numberOfResorts.replace('{count}', `${resorts.length}`)}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">{resorts.length}</div>
            <div className="text-gray-400">Resorts</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-400 mb-2">5+</div>
            <div className="text-gray-400">Mountains</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400 mb-2">EU</div>
            <div className="text-gray-400">Countries</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-400 mb-2">100+</div>
            <div className="text-gray-400">Routes</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white dark:bg-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 dark:text-white">
            Ready to hit the slopes?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Plan your perfect freeride adventure with expert tips, safety guides, and the best resort information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/trip-planner`}
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              {dict.home.startJourney}
            </Link>
            <Link
              href={`/${locale}/safety`}
              className="px-8 py-4 border-2 border-slate-800 text-slate-900 dark:text-white font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-lg"
            >
              Learn Safety
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>© 2025 Freeride Atlas. Plan responsibly and ride safely.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;