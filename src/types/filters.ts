import type { PlaceCategory } from '@/types/place';

export const ALL_CATEGORIES: PlaceCategory[] = ['restaurant', 'cafe', 'museum', 'park'];

export type VisitFilter = 'all' | 'visited' | 'notVisited';

export type PlaceFilters = {
  categories: PlaceCategory[];
  visited: VisitFilter;
};

export const defaultFilters: PlaceFilters = {
  categories: ALL_CATEGORIES,
  visited: 'all',
};

export function isFiltering(filters: PlaceFilters): boolean {
  return filters.categories.length !== ALL_CATEGORIES.length || filters.visited !== 'all';
}
