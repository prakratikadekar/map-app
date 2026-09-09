import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilterPanel } from '@/components/filter-panel';
import { PlaceInfoCard } from '@/components/place-info-card';
import { PlaceMap } from '@/components/place-map';
import { SearchBar } from '@/components/search-bar';
import { Colors } from '@/constants/theme';
import { usePlaces } from '@/hooks/use-places';
import { filterPlaces } from '@/lib/filter-places';
import { defaultFilters, isFiltering } from '@/types/filters';
import type { Place } from '@/types/place';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { focusPlaceId } = useLocalSearchParams<{ focusPlaceId?: string }>();
  const { places, updatePlace, removePlace } = usePlaces();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  // Coming back from the Add-a-Place flow: pop that new pin's info card open as a
  // confirmation. Adjusting state during render (comparing against the last id we've
  // already handled) rather than in an effect avoids an extra render/cascade — see
  // https://react.dev/reference/react/useState#storing-information-from-previous-renders.
  const [handledFocusId, setHandledFocusId] = useState<string | undefined>(undefined);
  if (focusPlaceId && focusPlaceId !== handledFocusId) {
    setHandledFocusId(focusPlaceId);
    setSelectedPlaceId(focusPlaceId);
  }

  // Clearing the param is a call to the router (an external system), not local state,
  // so it stays in an effect — just not bundled with the setState above.
  useEffect(() => {
    if (focusPlaceId) {
      router.setParams({ focusPlaceId: undefined });
    }
  }, [focusPlaceId, router]);

  const visiblePlaces = useMemo(() => {
    const byFilters = filterPlaces(places, filters);
    const query = search.trim().toLowerCase();
    if (!query) return byFilters;
    return byFilters.filter(
      (place) =>
        place.name.toLowerCase().includes(query) ||
        place.address?.toLowerCase().includes(query),
    );
  }, [places, filters, search]);

  const selectedPlace: Place | undefined = places.find((place) => place.id === selectedPlaceId);

  return (
    <View style={styles.container}>
      <PlaceMap
        places={visiblePlaces}
        onMarkerPress={(place) => {
          setShowFilterPanel(false);
          setSelectedPlaceId(place.id);
        }}
      />

      <View style={[styles.topOverlay, { top: insets.top + 12 }]} pointerEvents="box-none">
        <View style={styles.searchRow}>
          <View style={styles.searchBarWrapper}>
            <SearchBar value={search} onChangeText={setSearch} />
          </View>
          <Pressable
            onPress={() => {
              setSelectedPlaceId(null);
              setShowFilterPanel((shown) => !shown);
            }}
            style={[
              styles.filterButton,
              isFiltering(filters) && { backgroundColor: Colors.light.accent },
            ]}>
            <Image
              source={require('@/assets/images/filter.svg')}
              style={styles.filterIcon}
              tintColor={isFiltering(filters) ? '#FFFFFF' : Colors.light.text}
            />
          </Pressable>
        </View>
      </View>

      <Pressable
        onPress={() => router.push('/add-place')}
        style={[styles.addButton, { bottom: insets.bottom + 90 }]}>
        <Image source={require('@/assets/images/plus.svg')} style={styles.addIcon} tintColor="#FFFFFF" />
      </Pressable>

      {(selectedPlace || showFilterPanel) && (
        <Pressable
          style={styles.backdrop}
          onPress={() => {
            setSelectedPlaceId(null);
            setShowFilterPanel(false);
          }}
        />
      )}

      {selectedPlace && (
        <ScrollView
          style={[styles.sheet, { maxHeight: '70%' }]}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}>
          <PlaceInfoCard
            place={selectedPlace}
            onClose={() => setSelectedPlaceId(null)}
            onEdit={() =>
              router.push({ pathname: '/edit-place', params: { placeId: selectedPlace.id } })
            }
            onDelete={() => {
              removePlace(selectedPlace.id);
              setSelectedPlaceId(null);
            }}
            onChangeRating={(rating) => updatePlace(selectedPlace.id, { rating })}
            onChangeVisited={(visited) => updatePlace(selectedPlace.id, { visited })}
            onChangeReflection={(reflection) => updatePlace(selectedPlace.id, { reflection })}
          />
        </ScrollView>
      )}

      {showFilterPanel && (
        <View style={styles.sheet}>
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onClose={() => setShowFilterPanel(false)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topOverlay: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  searchBarWrapper: {
    flex: 1,
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  filterIcon: {
    width: 18,
    height: 18,
  },
  addButton: {
    position: 'absolute',
    right: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  addIcon: {
    width: 26,
    height: 26,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  sheet: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },
});
