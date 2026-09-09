import type { PlaceCategory } from '@/types/place';

export type PlaceSearchResult = {
  id: string;
  name: string;
  address: string;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
};

// Free, no-API-key place search backed by OpenStreetMap's Nominatim. There's no Google
// Places / Apple Maps search key configured for this app yet (see TODO.md Phase 0), and
// this is a single-user personal app right now, so Nominatim's public instance is a
// reasonable fit — just keep request volume low and identify the app, per its usage
// policy: https://operations.osmfoundation.org/policies/nominatim/
const SEARCH_ENDPOINT = 'https://nominatim.openstreetmap.org/search';
const APP_USER_AGENT = 'my-map-app (personal place-memory app)';

type NominatimResult = {
  place_id: number;
  lat: string;
  lon: string;
  name?: string;
  display_name: string;
  class?: string;
  type?: string;
  address?: Record<string, string>;
};

export async function searchPlaces(
  query: string,
  signal?: AbortSignal,
): Promise<PlaceSearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = `${SEARCH_ENDPOINT}?${new URLSearchParams({
    q: trimmed,
    format: 'json',
    addressdetails: '1',
    limit: '8',
  })}`;

  const response = await fetch(url, {
    signal,
    headers: {
      // Browsers silently drop custom User-Agent headers (a Fetch-spec forbidden
      // header), so this only actually reaches Nominatim on native — the Referer
      // header sent automatically covers identification on web.
      'User-Agent': APP_USER_AGENT,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Place search failed (${response.status})`);
  }

  const results = (await response.json()) as NominatimResult[];
  return results.map(toSearchResult);
}

function toSearchResult(result: NominatimResult): PlaceSearchResult {
  return {
    id: String(result.place_id),
    name: result.name || result.display_name.split(',')[0].trim(),
    address: formatAddress(result),
    category: inferCategory(result),
    latitude: Number(result.lat),
    longitude: Number(result.lon),
  };
}

function formatAddress(result: NominatimResult): string {
  const address = result.address;
  if (!address) return result.display_name;

  const street = [address.house_number, address.road].filter(Boolean).join(' ');
  const locality = address.city || address.town || address.village || address.suburb;
  const parts = [street, locality, address.state].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : result.display_name;
}

// Nominatim's OSM class/type tags don't map cleanly onto this app's 4 categories —
// this is a best-effort guess. It's shown as a preselected (but changeable) CategoryTag
// on the details step, so a wrong guess is a one-tap fix, not a dead end.
function inferCategory(result: NominatimResult): PlaceCategory {
  const cls = result.class;
  const type = result.type;

  if (cls === 'amenity' && (type === 'cafe' || type === 'coffee_shop')) return 'cafe';
  if (
    cls === 'amenity' &&
    ['restaurant', 'fast_food', 'bar', 'pub', 'food_court', 'ice_cream', 'biergarten'].includes(
      type ?? '',
    )
  ) {
    return 'restaurant';
  }
  if (cls === 'tourism' && ['museum', 'gallery', 'artwork'].includes(type ?? '')) return 'museum';
  if (
    (cls === 'leisure' &&
      ['park', 'garden', 'nature_reserve', 'playground', 'dog_park'].includes(type ?? '')) ||
    (cls === 'boundary' && type === 'national_park') ||
    (cls === 'landuse' && type === 'recreation_ground')
  ) {
    return 'park';
  }

  return 'restaurant';
}
