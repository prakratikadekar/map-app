import type { PlaceFilters } from '@/types/filters';
import type { Place } from '@/types/place';

export function filterPlaces(places: Place[], filters: PlaceFilters): Place[] {
  return places.filter((place) => {
    if (!filters.categories.includes(place.category)) return false;
    if (filters.visited === 'visited' && !place.visited) return false;
    if (filters.visited === 'notVisited' && place.visited) return false;
    return true;
  });
}
