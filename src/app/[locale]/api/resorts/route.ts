import { NextResponse } from 'next/server';
import { Resort, ResortSchema } from '@/lib/zods';
import { fetchResorts, filterResorts } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const country = searchParams.get('country');
  const difficultyMin = Number(searchParams.get('difficultyMin'));
  const difficultyMax = Number(searchParams.get('difficultyMax'));
  const tags = searchParams.get('tags')?.split(',') || [];
  const hasSkiTouring = searchParams.get('hasSkiTouring') === 'true';
  const minPrice = Number(searchParams.get('minPrice'));
  const maxPrice = Number(searchParams.get('maxPrice'));
  const searchTerm = searchParams.get('searchTerm');

  try {
    const allResorts = await fetchResorts();
    const filteredResorts = filterResorts(allResorts, {
      country,
      difficultyMin: isNaN(difficultyMin) ? undefined : difficultyMin,
      difficultyMax: isNaN(difficultyMax) ? undefined : difficultyMax,
      tags,
      hasSkiTouring,
      minPrice: isNaN(minPrice) ? undefined : minPrice,
      maxPrice: isNaN(maxPrice) ? undefined : maxPrice,
      searchTerm,
    });

    return NextResponse.json({
      count: filteredResorts.length,
      resorts: filteredResorts,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch resorts' }, { status: 500 });
  }
}