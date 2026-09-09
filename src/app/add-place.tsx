import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryTag } from '@/components/category-tag';
import { ReflectionEntry } from '@/components/reflection-entry';
import { SaveToMapButton } from '@/components/save-to-map-button';
import { SearchBar } from '@/components/search-bar';
import { SearchResultRow } from '@/components/search-result-row';
import { StarRating } from '@/components/star-rating';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { VisitToggle } from '@/components/visit-toggle';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { usePlaces } from '@/hooks/use-places';
import { useTheme } from '@/hooks/use-theme';
import { searchPlaces, type PlaceSearchResult } from '@/lib/place-search';
import { ALL_CATEGORIES } from '@/types/filters';
import type { PlaceCategory } from '@/types/place';

type Step = 'search' | 'details';

export default function AddPlaceScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { addPlace } = usePlaces();

  const [step, setStep] = useState<Step>('search');

  // Search step
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlaceSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Details step — seeded from whichever result was tapped
  const [selected, setSelected] = useState<PlaceSearchResult | null>(null);
  const [category, setCategory] = useState<PlaceCategory>('restaurant');
  const [rating, setRating] = useState(0);
  const [visited, setVisited] = useState(false);
  const [reflection, setReflection] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function handleQueryChange(text: string) {
    setQuery(text);
    if (text.trim().length < 2) {
      // Short-circuit here (an event handler, not the effect below) so clearing the
      // search box clears stale results immediately without a setState-in-effect.
      setResults([]);
      setSearchError(null);
      setIsSearching(false);
    }
  }

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    const controller = new AbortController();

    // Debounce + respect Nominatim's "no hammering" usage policy. All state updates
    // live inside this callback (not the effect body) so starting a search is itself
    // the "external system" event, not a synchronous effect-body setState.
    const timeout = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const found = await searchPlaces(trimmed, controller.signal);
        setResults(found);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setSearchError("Couldn't search right now — check your connection and try again.");
        }
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  function selectResult(result: PlaceSearchResult) {
    setSelected(result);
    setCategory(result.category);
    setRating(0);
    setVisited(false);
    setReflection('');
    setSaveError(null);
    setStep('details');
  }

  async function handleSave() {
    if (!selected || isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const newPlace = await addPlace({
        name: selected.name,
        address: selected.address,
        category,
        latitude: selected.latitude,
        longitude: selected.longitude,
        rating: rating > 0 ? rating : undefined,
        reflection: reflection.trim() || undefined,
        visited,
      });
      // Hand off to the map tab with the new pin's id so it can pop the info card
      // open right away — the "map after place added" confirmation state.
      router.dismissTo({ pathname: '/map', params: { focusPlaceId: newPlace.id } });
    } catch {
      setSaveError("Couldn't save this place — please try again.");
      setIsSaving(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          {step === 'details' ? (
            <Pressable onPress={() => setStep('search')} hitSlop={8}>
              <ThemedText style={styles.headerAction}>‹ Back</ThemedText>
            </Pressable>
          ) : (
            <View style={styles.headerActionSpacer} />
          )}
          <ThemedText style={styles.title}>Add a place</ThemedText>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Image
              source={require('@/assets/images/close.svg')}
              style={styles.closeIcon}
              tintColor={theme.text}
            />
          </Pressable>
        </View>

        {step === 'search' && (
          <View style={styles.searchStep}>
            <SearchBar
              value={query}
              onChangeText={handleQueryChange}
              placeholder="Search for a place or address"
            />
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.resultsContent}>
              {isSearching && (
                <ActivityIndicator color={Colors.light.primary} style={styles.spinner} />
              )}
              {!isSearching && searchError && (
                <ThemedText themeColor="textSecondary" style={styles.hint}>
                  {searchError}
                </ThemedText>
              )}
              {!isSearching && !searchError && query.trim().length === 0 && (
                <ThemedText themeColor="textSecondary" style={styles.hint}>
                  Search for a place — like &quot;Portland Art Museum&quot; — to add it to your
                  map.
                </ThemedText>
              )}
              {!isSearching &&
                !searchError &&
                query.trim().length >= 2 &&
                results.length === 0 && (
                  <ThemedText themeColor="textSecondary" style={styles.hint}>
                    No places found.
                  </ThemedText>
                )}
              {results.map((result) => (
                <SearchResultRow
                  key={result.id}
                  name={result.name}
                  address={result.address}
                  category={result.category}
                  onPress={() => selectResult(result)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {step === 'details' && selected && (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.detailsContent}>
            <View style={styles.titleBlock}>
              <ThemedText style={styles.placeName}>{selected.name}</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.placeAddress}>
                {selected.address}
              </ThemedText>
            </View>

            <ThemedText style={styles.sectionLabel}>Category</ThemedText>
            <View style={styles.categoryRow}>
              {ALL_CATEGORIES.map((option) => (
                <Pressable key={option} onPress={() => setCategory(option)}>
                  <CategoryTag category={option} selected={category === option} />
                </Pressable>
              ))}
            </View>

            <ThemedText style={styles.sectionLabel}>Your rating</ThemedText>
            <StarRating rating={rating} onChange={setRating} />

            <VisitToggle visited={visited} onChange={setVisited} />

            <ThemedText style={styles.sectionLabel}>Reflection</ThemedText>
            <ReflectionEntry value={reflection} onChangeText={setReflection} />

            {saveError && <ThemedText style={styles.errorText}>{saveError}</ThemedText>}

            <View style={styles.saveRow}>
              <SaveToMapButton onPress={handleSave} />
              {isSaving && <ActivityIndicator color={Colors.light.primary} />}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  headerAction: {
    fontFamily: Typography.labels.fontFamily,
    fontSize: Typography.labels.fontSize,
    color: Colors.light.primary,
  },
  headerActionSpacer: {
    width: 40,
  },
  title: {
    fontFamily: Typography.headings.fontFamily,
    fontSize: Typography.headings.fontSize,
  },
  closeIcon: {
    width: 22,
    height: 22,
  },
  searchStep: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  resultsContent: {
    paddingVertical: Spacing.two,
    gap: 4,
  },
  spinner: {
    marginTop: Spacing.four,
  },
  hint: {
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
    textAlign: 'center',
    marginTop: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
  detailsContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
    gap: Spacing.two,
  },
  titleBlock: {
    gap: 2,
    marginBottom: Spacing.two,
  },
  placeName: {
    fontFamily: Typography.headings.fontFamily,
    fontSize: Typography.headings.fontSize,
  },
  placeAddress: {
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
  },
  sectionLabel: {
    fontFamily: Typography.labels.fontFamily,
    fontSize: Typography.labels.fontSize,
    marginTop: Spacing.two,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  errorText: {
    fontFamily: Typography.labels.fontFamily,
    fontSize: Typography.labels.fontSize,
    color: Colors.light.restaurant,
  },
  saveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});
