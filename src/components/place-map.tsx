import { useImage, type ImageRef } from 'expo-image';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { Platform, StyleSheet } from 'react-native';

import type { Place, PlaceCategory } from '@/types/place';

type MarkerIcons = Record<PlaceCategory, { visited: ImageRef | null; notVisited: ImageRef | null }>;

function useMarkerIcons(): MarkerIcons {
  const restaurantVisited = useImage(require('@/assets/images/markers/restaurant-visited.png'));
  const restaurantNotVisited = useImage(
    require('@/assets/images/markers/restaurant-not-visited.png'),
  );
  const cafeVisited = useImage(require('@/assets/images/markers/cafe-visited.png'));
  const cafeNotVisited = useImage(require('@/assets/images/markers/cafe-not-visited.png'));
  const museumVisited = useImage(require('@/assets/images/markers/museum-visited.png'));
  const museumNotVisited = useImage(require('@/assets/images/markers/museum-not-visited.png'));
  const parkVisited = useImage(require('@/assets/images/markers/park-visited.png'));
  const parkNotVisited = useImage(require('@/assets/images/markers/park-not-visited.png'));

  return {
    restaurant: { visited: restaurantVisited, notVisited: restaurantNotVisited },
    cafe: { visited: cafeVisited, notVisited: cafeNotVisited },
    museum: { visited: museumVisited, notVisited: museumNotVisited },
    park: { visited: parkVisited, notVisited: parkNotVisited },
  };
}

function iconFor(icons: MarkerIcons, place: Place): ImageRef | undefined {
  const byCategory = icons[place.category];
  return (place.visited ? byCategory.visited : byCategory.notVisited) ?? undefined;
}

type PlaceMapProps = {
  places: Place[];
  onMarkerPress?: (place: Place) => void;
};

export function PlaceMap({ places, onMarkerPress }: PlaceMapProps) {
  const icons = useMarkerIcons();
  const placesById = new Map(places.map((place) => [place.id, place]));
  const handleMarkerClick = (marker: { id?: string }) => {
    const place = marker.id ? placesById.get(marker.id) : undefined;
    if (place) onMarkerPress?.(place);
  };
  const cameraPosition = places.length
    ? {
        coordinates: {
          latitude: places.reduce((sum, place) => sum + place.latitude, 0) / places.length,
          longitude: places.reduce((sum, place) => sum + place.longitude, 0) / places.length,
        },
        zoom: 12,
      }
    : undefined;

  if (Platform.OS === 'ios') {
    return (
      <AppleMaps.View
        style={styles.map}
        cameraPosition={cameraPosition}
        annotations={places.map((place) => ({
          id: place.id,
          coordinates: { latitude: place.latitude, longitude: place.longitude },
          title: place.name,
          icon: iconFor(icons, place),
        }))}
        onAnnotationClick={handleMarkerClick}
      />
    );
  }

  return (
    <GoogleMaps.View
      style={styles.map}
      cameraPosition={cameraPosition}
      markers={places.map((place) => ({
        id: place.id,
        coordinates: { latitude: place.latitude, longitude: place.longitude },
        title: place.name,
        icon: iconFor(icons, place),
      }))}
      onMarkerClick={handleMarkerClick}
    />
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
