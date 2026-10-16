import { Resort, ResortSchema } from './zods';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { glob } from 'glob';

// File path to resort data directory
const RESORT_DATA_DIR = join(process.cwd(), 'public/resort-data');

// Convert camelCase to snake_case for filename matching
function camelToSnake(str: string): string {
  return str
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    .replace(/^_/, '');
}

// Convert snake_case to camelCase for property names
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Fetch and parse a single resort file
export async function fetchResort(slug: string): Promise<Resort | null> {
  try {
    const data = await readFile(join(RESORT_DATA_DIR, `${slug}.json`), 'utf-8');
    const json = JSON.parse(data);

    // Validate with Zod schema
    const validated = ResortSchema.parse(json);

    // Convert snake_case properties back to camelCase (Match Zod schema fields)
    const resort: Resort = validated as unknown as Resort;

    // Post-processing to convert file names to what users expect
    if (!('image' in resort) || !resort.image.src) {
      console.warn(`Missing image data for resort: ${slug}`);
    }

    return resort;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('ENOENT')) {
        return null; // Resort file not found
      }
      console.error(`Error loading resort ${slug}:`, error.message);
    }
    return null;
  }
}

// Fetch all resort data
export async function fetchResorts(): Promise<Resort[]> {
  try {
    const files = await glob('*.json', {
      cwd: RESORT_DATA_DIR,
      absolute: true,
    });

    const resorts: Resort[] = [];

    for (const file of files) {
      const slug = file.replace(/\\.json$/, '');
      const resort = await fetchResort(slug);
      if (resort) {
        resorts.push(resort);
      }
    }

    return resorts.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error loading resorts:', error.message);
    }
    return [];
  }
}

// Filter resorts based on criteria
export function filterResorts(resorts: Resort[], filters: {
  country?: string;
  difficultyMin?: number;
  difficultyMax?: number;
  tags?: string[];
  hasSkiTouring?: boolean;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  liftAccessibleOffPiste?: boolean;
}): Resort[] {
  return resorts.filter((resort) => {
    // Country filter
    if (filters.country && resort.country !== filters.country) {
      return false;
    }

    // Difficulty filter
    if (filters.difficultyMin !== undefined && resort.terrainDifficulty < filters.difficultyMin) {
      return false;
    }
    if (filters.difficultyMax !== undefined && resort.terrainDifficulty > filters.difficultyMax) {
      return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasTag = filters.tags!.some((tag) => resort.tags.includes(tag));
      if (!hasTag) return false;
    }

    // Has ski touring
    if (filters.hasSkiTouring === true && !resort.skiTouringAccess) {
      return false;
    }

    // Price filter
    if (filters.minPrice !== undefined && resort.approxLiftPassPrice < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && resort.approxLiftPassPrice > filters.maxPrice) {
      return false;
    }

    // Lift-accessible off-piste
    if (filters.liftAccessibleOffPiste === true && !resort.liftAccessibleOffPiste) {
      return false;
    }

    // Search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const fullName = `${resort.name} ${resort.country} ${resort.region}`.toLowerCase();
      if (!fullName.includes(term)) {
        return false;
      }
    }

    return true;
  });
}

// Get unique values for filter dropdowns
export function getUniqueCountries(resorts: Resort[]): string[] {
  const countries = new Set(resorts.map((r) => r.country));
  return Array.from(countries).sort();
}

export function getUniqueTags(resorts: Resort[]): string[] {
  const allTags = resorts.flatMap((r) => r.tags);
  const uniqueTags = new Set(allTags);
  return Array.from(uniqueTags).sort();
}

// Get aggregated statistics
export function getResortStats(resorts: Resort[]) {
  const total = resorts.length;
  const verified = resorts.filter((r) => r.coverage.verified).length;
  const hasSkiTouring = resorts.filter((r) => r.skiTouringAccess).length;
  const liftAccessible = resorts.filter((r) => r.liftAccessibleOffPiste).length;
  const avgDifficulty = resorts.reduce((sum, r) => sum + r.terrainDifficulty, 0) / total;

  return {
    total,
    verified,
    hasSkiTouring,
    liftAccessible,
    avgDifficulty: Number(avgDifficulty.toFixed(1)),
  };
}