import { redirect } from 'next/navigation';
import Link from 'next/link';
import { locales } from '@/lib/i18n';
import { fetchResorts } from '@/lib/data';
import { getDictionary } from '@/lib/i18n';

type Props = {
  searchParams: Promise<{ slug?: string }>;
  params: Promise<{ locale: string }>;
};

async function TripPlannerPage({ searchParams, params }: Props) {
  const { locale } = await params;
  const { slug } = await searchParams;
  const dict = getDictionary(locale as any);

  // Calculate estimate based on resort data
  // This is a simplified budget estimate (in EUR)
  const budgetBreakdown = slug ? await calculateBudget(slug) : null;

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
                href={`/${locale}/trip-planner${slug ? `?slug=${slug}` : ''}`}
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

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-teal-500 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            {dict.tripPlanner.title}
          </h1>
          <p className="text-xl text-green-50">
            {dict.tripPlanner.subtitle}
          </p>
        </div>
      </div>

      {/* Empty State */}
      {!budgetBreakdown && (
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Select a resort to generate a trip estimate
          </p>
          <Link href={`/${locale}/resorts`}>
            Browse Resorts
          </Link>
        </div>
      )}

      {/* Budget Calculator if resort selected */}
      {budgetBreakdown && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Resort Detail */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-2xl font-bold dark:text-white mb-4">
                {budgetBreakdown.resort.name}
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{dict.resorts.country}</span>
                  <span className="font-medium dark:text-white">{budgetBreakdown.resort.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Lift Pass Price</span>
                  <span className="font-medium dark:text-white">{budgetBreakdown.resort.approxLiftPassPrice}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Duration</span>
                  <span className="font-medium dark:text-white">7 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Number of People</span>
                  <span className="font-medium dark:text-white">2</span>
                </div>

                {/* Note about estimates */}
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>💡 Budget note:</strong> These are rough estimates. Actual costs will vary significantly based on accommodation quality, season dates, travel methods, and personal spending habits.
                </div>
              </div>
            </div>

            {/* Budget Breakdown */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-2xl font-bold dark:text-white mb-4">
                Rough Cost Estimate (per person)
              </h2>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold dark:text-white">Lift Passes</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{budgetBreakdown.liftPass}€</span>
                  </div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full">
                    <div
                      className="h-4 bg-green-600 rounded-full"
                      style={{ width: `${(budgetBreakdown.liftPass / budgetBreakdown.total) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold dark:text-white">Accommodation (5 nights)</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{budgetBreakdown.accommodation}€</span>
                  </div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full">
                    <div
                      className="h-4 bg-blue-600 rounded-full"
                      style={{ width: `${(budgetBreakdown.accommodation / budgetBreakdown.total) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold dark:text-white">Travel (flights/transfer)</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{budgetBreakdown.travel}€</span>
                  </div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full">
                    <div
                      className="h-4 bg-purple-600 rounded-full"
                      style={{ width: `${(budgetBreakdown.travel / budgetBreakdown.total) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold dark:text-white">Food & Miscellaneous</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">{budgetBreakdown.food}€</span>
                  </div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full">
                    <div
                      className="h-4 bg-orange-600 rounded-full"
                      style={{ width: `${(budgetBreakdown.food / budgetBreakdown.total) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                  <div className="flex justify-between text-xl">
                    <span className="font-bold dark:text-white">Total</span>
                    <span className="font-bold text-slate-900 dark:text-white">{budgetBreakdown.total}€</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Best Time to Go */}
          <div className="mt-8 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-2xl font-bold dark:text-white mb-4">Best Time to Go</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-slate-800 dark:text-white">
                  Best powder conditions
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check the snow reports for your chosen resort. Freeriding season runs typically from January to March.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-slate-800 dark:text-white">
                  Good weather window
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  February-March usually offers the best combination of snow and weather stability in the Alps.
                </p>
              </div>
            </div>
          </div>

          {/* Packing Checklist */}
          <div className="mt-8 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-2xl font-bold dark:text-white mb-4">Packing Checklist</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span className="text-gray-700 dark:text-gray-300">Backcountry/professional skis</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span className="text-gray-700 dark:text-gray-300">Ski boots (let them break in)</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span className="text-gray-700 dark:text-gray-300">Transceiver (beacon)</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span className="text-gray-700 dark:text-gray-300">Probe (probe)</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span className="text-gray-700 dark:text-gray-300">Shovel (shovel)</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span className="text-gray-700 dark:text-gray-300">Airbag pack (recommended)</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span className="text-gray-700 dark:text-gray-300">Ski touring skins</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span className="text-gray-700 dark:text-gray-300">Warm, waterproof clothing</span>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Link href={`/${locale}/resorts?slug=${slug}`}>
              Browse Resorts
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-16">
        <div className="max-w-6xl mx-auto text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>© 2025 Freeride Atlas. Plan responsibly and ride safely.</p>
        </div>
      </footer>
    </div>
  );
}

async function calculateBudget(slug: string) {
  const resort = await fetchResort(slug);
  if (!resort) {
    return null;
  }

  // Simplified budget estimates (per person, 1 week, 2 people)
  const numDays = 7;
  const numTrips = 2;
  const numNights = (numDays * numTrips) - (numTrips - 1); // Return trip excluded

  // Lift pass (daily rate × days × people)
  const liftPassPerPerson = resort.approxLiftPassPrice * numDays;
  const liftPass = liftPassPerPerson * numTrips; // for both trips

  // Accommodation: budget hotel (~70€/night) for 5 nights
  const accommodationPerPerson = 70 * numNights;

  // Travel: average flight from Europe to resort + transfers
  const travelPerPerson = 300 + resort.transferTime * 0.1; // Flight + per-minute transfer cost

  // Food & misc: 100€/day
  const foodPerPerson = 100 * numDays * numTrips;

  const total = liftPass + accommodationPerPerson + travelPerPerson + foodPerPerson;

  // Return to Plan API
  return {
    resort,
    liftPass,
    accommodation: accommodationPerPerson,
    travel,
    food: foodPerPerson,
    total,
  };
}