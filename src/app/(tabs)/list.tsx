import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilterPanel } from '@/components/filter-panel';
import { PlaceInfoCard } from '@/components/place-info-card';
import { PlaceListRow } from '@/components/place-list-row';
import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Colors, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { usePlaces } from '@/hooks/use-places';
import { filterPlaces } from '@/lib/filter-places';
import { defaultFilters, isFiltering } from '@/types/filters';
import type { Place } from '@/types/place';

export default function ListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const { places, updatePlace, removePlace } = usePlaces();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  const visiblePlaces = useMemo(() => {
    const byFilters = filterPlaces(places, filters);
    const query = search.trim().toLowerCase();
    const matched = query
      ? byFilters.filter(
          (place) =>
            place.name.toLowerCase().includes(query) ||
            place.address?.toLowerCase().includes(query),
        )
      : byFilters;
    return [...matched].sort((a, b) => a.name.localeCompare(b.name));
  }, [places, filters, search]);

  const selectedPlace: Place | undefined = places.find((place) => place.id === selectedPlaceId);

  function openPlace(place: Place) {
    setShowFilterPanel(false);
    setSelectedPlaceId(place.id);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={visiblePlaces}
        keyExtractor={(place) => place.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + BottomTabInset + Spacing.three },
        ]}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: theme.backgroundElement }]} />
        )}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <ThemedText style={styles.title}>Places saved</ThemedText>
            <View style={styles.searchRow}>
              <View style={styles.searchBarWrapper}>
                <SearchBar value={search} onChangeText={setSearch} />
              </View>
              <Pressable
                onPress={() => setShowFilterPanel((shown) => !shown)}
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
        }
        ListEmptyComponent={
          <ThemedText style={styles.empty} themeColor="textSecondary">
            {places.length === 0
              ? 'No places saved yet — add one from the map.'
              : 'No places match your search or filters.'}
          </ThemedText>
        }
        renderItem={({ item }) => <PlaceListRow place={item} onPress={() => openPlace(item)} />}
      />

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
  listContent: {
    paddingHorizontal: Spacing.three,
    flexGrow: 1,
  },
  headerBlock: {
    gap: 12,
    marginBottom: 12,
  },
  title: {
    fontFamily: Typography.headings.fontFamily,
    fontSize: Typography.headings.fontSize,
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
  separator: {
    height: 1,
  },
  empty: {
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
    textAlign: 'center',
    marginTop: 24,
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
