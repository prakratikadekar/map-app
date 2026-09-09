import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import { loadPlaces, savePlaces } from '@/lib/places-storage';
import type { Place } from '@/types/place';

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

type PlacesContextValue = {
  places: Place[];
  isLoading: boolean;
  addPlace: (place: Omit<Place, 'id' | 'createdAt'>) => Promise<Place>;
  updatePlace: (id: string, updates: Partial<Omit<Place, 'id'>>) => Promise<void>;
  removePlace: (id: string) => Promise<void>;
};

const PlacesContext = createContext<PlacesContextValue | null>(null);

export function PlacesProvider({ children }: PropsWithChildren) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mirrors `places` synchronously — state updates only land on the next render, so two
  // add/update/remove calls fired back-to-back (before React re-renders in between) would
  // otherwise both compute "next" from the same stale `places` closure and the second call
  // would silently clobber the first. Reading/writing this ref instead keeps every call
  // consistent with whatever the most recent call already did.
  const placesRef = useRef<Place[]>([]);
  // Chains AsyncStorage writes so they land in call order even if their promises settle out
  // of order — otherwise a slower-resolving earlier write could finish last and overwrite a
  // newer write with stale data.
  const saveQueueRef = useRef(Promise.resolve());

  useEffect(() => {
    loadPlaces().then((loaded) => {
      placesRef.current = loaded;
      setPlaces(loaded);
      setIsLoading(false);
    });
  }, []);

  const commit = useCallback((next: Place[]) => {
    placesRef.current = next;
    setPlaces(next);
    saveQueueRef.current = saveQueueRef.current.then(() => savePlaces(next));
    return saveQueueRef.current;
  }, []);

  const value = useMemo<PlacesContextValue>(
    () => ({
      places,
      isLoading,
      async addPlace(place) {
        const newPlace: Place = { ...place, id: generateId(), createdAt: new Date().toISOString() };
        await commit([...placesRef.current, newPlace]);
        return newPlace;
      },
      async updatePlace(id, updates) {
        await commit(
          placesRef.current.map((place) => (place.id === id ? { ...place, ...updates } : place)),
        );
      },
      async removePlace(id) {
        await commit(placesRef.current.filter((place) => place.id !== id));
      },
    }),
    [places, isLoading, commit],
  );

  return <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>;
}

export function usePlaces() {
  const context = useContext(PlacesContext);
  if (!context) {
    throw new Error('usePlaces must be used within a PlacesProvider');
  }
  return context;
}
