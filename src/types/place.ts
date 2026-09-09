export type PlaceCategory = 'restaurant' | 'cafe' | 'museum' | 'park';

export type Place = {
  id: string;
  name: string;
  address?: string;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  rating?: number;
  reflection?: string;
  photoUri?: string;
  visited: boolean;
  createdAt: string;
};
