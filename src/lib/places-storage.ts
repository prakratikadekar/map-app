import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Place } from '@/types/place';

const STORAGE_KEY = 'places';

export async function loadPlaces(): Promise<Place[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Place[]) : [];
}

export async function savePlaces(places: Place[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(places));
}
