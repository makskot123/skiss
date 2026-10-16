import { NextResponse } from 'next/server';
import { fetchResorts, filterResorts } from '@/lib/data';
import type { ResortFiltersInput } from '@/lib/zods';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const filters: ResortFiltersInput = {
    country: searchParams.get('country'),
    difficultyMin: searchParams.get('difficultyMin') ? parseInt(searchParams.get('difficultyMin')!) : undefined,
    difficultyMax: searchParams.get('difficultyMax') ? parseInt(searchParams.get('difficultyMax')!) : undefined,
    tags: searchParams.getAll('tags').map(t => t),
    hasSkiTouring: searchParams.get('hasSkiTouring') === 'true',
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
    searchTerm: searchParams.get('q'),
    liftAccessibleOffPiste: searchParams.get('liftAccessibleOffPiste') === 'true',
  };

  try {
    const allResorts = await fetchResorts();
    const filteredResorts = filterResorts(allResorts, filters);

    return NextResponse.json(filteredResorts);
  } catch (error) {
    console.error('Error fetching filtered resorts:', error);
    return NextResponse.json({ error: 'Failed to fetch resorts' }, { status: 500 });
  }
}