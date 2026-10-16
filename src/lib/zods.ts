import { z } from 'zod';

// Base schemas
const BaseResortData = z.object({
  name: z.string().min(1),
  slug: z.string().refine(
    (val) => /^[a-z0-9-]+$/.test(val),
    'Slug must contain only lowercase letters, numbers, and hyphens'
  ),
  country: z.string().min(1),
  region: z.string().min(1),
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
});

const ElevationSchema = z.object({
  minElevation: z.number().int().min(0),
  maxElevation: z.number().int().min(0),
  verticalDrop: z.number().int().min(0),
});

const LinkSchema = z.object({
  resort: z.string().url(),
  snowReport: z.string().url().optional(),
  webcam: z.string().url().optional(),
});

const ImageSchema = z.object({
  src: z.string().url(),
  alt: z.string().optional(),
  attribution: z.string().optional(),
});

export const ResortSchema = z.object({
  // Basic info
  ...BaseResortData,
  minElevation: z.number().int().min(0),
  maxElevation: z.number().int().min(0),
  verticalDrop: z.number().int().min(0),

  // Large mountain / terrain
  numberOfLifts: z.number().int().min(0),
  lifts: z.array(z.enum(['chairlift', 'draglift', 'cablecar', 'gondola', 't-bar', 'magic carpet'])),
  liftAccessibleOffPiste: z.boolean(),
  skiTouringAccess: z.boolean(),
  terrainDifficulty: z.number().min(1).max(5), // 1-5 scale
  averageSnowfall: z.number().int().min(0), // cm per season
  seasonStart: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  seasonEnd: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),

  // Practical info
  approxLiftPassPrice: z.number().int().min(0), // EUR
  nearestAirport: z.string().min(1),
  transferTime: z.number().int().min(0), // minutes

  // Data verification
  coverage: z.object({
    verified: z.boolean(),
    lastVerified: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
    notes: z.string().optional(),
  }),

  // Target audience
  suitability: z.object({
    beginners: z.number().min(0).max(5),
    intermediates: z.number().min(0).max(5),
    experts: z.number().min(0).max(5),
  }),

  // Tags and content
  tags: z.array(z.enum([
    'powder', 'couloirs', 'trees', 'heliskiing', 'skiTouring', 'park', 'glades'
  ])).min(1),
  description: z.string().min(50),

  // Links and media
  officialLinks: LinkSchema,
  image: ImageSchema,
});

export type Resort = z.infer<typeof ResortSchema>;

// Filter schemas
export const ResortFilters = z.object({
  country: z.string().optional(),
  difficultyMin: z.number().min(1).max(5).optional(),
  difficultyMax: z.number().min(1).max(5).optional(),
  tags: z.array(z.enum([
    'powder', 'couloirs', 'trees', 'heliskiing', 'skiTouring', 'park', 'glades'
  ])).optional(),
  hasSkiTouring: z.boolean().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  liftAccessibleOffPiste: z.boolean().optional(),
  searchTerm: z.string().optional(),
});

export type ResortFiltersInput = z.infer<typeof ResortFilters>;

// Sort options
export type ResortSortOption = 'difficulty' | 'snowfall' | 'price' | 'verticalDrop' | 'name';

// Schemas for extensions
export const ExtendedResortSchema = ResortSchema.extend({
  areas: z.array(z.object({
    name: z.string(),
    minElevation: z.number().int().min(0),
    maxElevation: z.number().int().min(0),
    lifts: z.array(z.string()),
    tags: z.array(z.string()),
  })).optional(),
});

// Date helpers
export const Today = new Date().toISOString().split('T')[0];

// Validation error message builder
export function buildValidationError(error: z.ZodError) {
  return error.errors.map((err) => ({
    path: err.path.join('.'),
    message: err.message,
  }));
}