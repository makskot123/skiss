import { getDictionary } from '@/lib/i18n';
import { fetchResorts, filterResorts, getUniqueCountries } from '@/lib/data';
import { ResortFiltersInput } from '@/lib/zods';
import Link from 'next/link';
import MapSection from '@/components/resorts/map-section';
import ResortFilters from '@/components/resorts/resort-filters';

export default async function ResortsPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { locale } = await params;
  const dict = getDictionary(locale as any);
  const allResorts = await fetchResorts();

  // Get filters from search params
  const searchParams_raw = searchParams;
  const filters: ResortFiltersInput = {
    country: searchParams_raw.country as string,
    difficultyMin: Number(searchParams_raw.difficultyMin) || 1,
    difficultyMax: Number(searchParams_raw.difficultyMax) || 5,
    tags: (searchParams_raw.tags as string | string[])?.split(',') || [],
    hasSkiTouring: searchParams_raw.hasSkiTouring === 'true',
    minPrice: Number(searchParams_raw.minPrice) || 0,
    maxPrice: Number(searchParams_raw.maxPrice) || 1000000,
    searchTerm: searchParams_raw.searchTerm as string,
    liftAccessibleOffPiste: searchParams_raw.hasLiftAccessibleOffPiste === 'true',
  };

  const filteredResorts = filterResorts(allResorts, filters);
  const countries = getUniqueCountries(allResorts);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <header className="py-12 px-4 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">{dict.resorts.title}</h1>
          <p className="text-xl opacity-90">{dict.resorts.subtitle}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col gap-8">
          <MapSection resorts={filteredResorts} />

          <div className="flex flex-col lg:flex-row gap-8">
            <ResortFilters countries={countries} />

            <div className="flex-1">
              <div className="flex justify-between items-center mb-8">
                <p className="text-gray-600 dark:text-gray-400">
                  Showing {filteredResorts.length} {dict.resorts.resultsCount.replace('{count}', filteredResorts.length)}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredResorts.map((resort) => (
                  <Link
                    key={resort.slug}
                    href={`/${locale}/resorts/${resort.slug}`}
                    className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
                  >
                    <div className="h-48 relative">
                      <img
                        src={resort.image.src}
                        alt={resort.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs rounded-full">
                          {resort.country}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="text-white font-bold text-xl">{resort.name}</div>
                        <div className="text-white/80 text-sm">{resort.terrainDifficulty}/5 Difficulty</div>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                        {resort.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          {dict.resorts.price.replace('€', `€${resort.approxLiftPassPrice}`)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {resort.region}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
                {filteredResorts.length === 0 && (
                  <div className="col-span-full py-20 text-center text-gray-500">
                    No resorts found matching your filters.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}