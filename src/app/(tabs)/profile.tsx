import Constants from 'expo-constants';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryTag } from '@/components/category-tag';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Spacing, Typography } from '@/constants/theme';
import { usePlaces } from '@/hooks/use-places';
import { useTheme } from '@/hooks/use-theme';
import { ALL_CATEGORIES } from '@/types/filters';
import type { PlaceCategory } from '@/types/place';

// No design reference exists for this screen anywhere in the Figma file (see
// TODO.md's "Open decisions"). The app has no accounts/auth at all — everything is
// local, single-device AsyncStorage (see PlacesProvider) — so there's nothing to log
// into. Built as a simple stats-and-about view instead: a snapshot of your own saved
// data plus the app version, using data that already exists rather than new state.
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { places } = usePlaces();

  const stats = useMemo(() => {
    const byCategory = Object.fromEntries(
      ALL_CATEGORIES.map((category) => [category, 0]),
    ) as Record<PlaceCategory, number>;
    let visited = 0;
    for (const place of places) {
      byCategory[place.category] += 1;
      if (place.visited) visited += 1;
    }
    return { total: places.length, byCategory, visited, notVisited: places.length - visited };
  }, [places]);

  const appName = Constants.expoConfig?.name ?? 'my-map-app';
  const appVersion = Constants.expoConfig?.version;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + BottomTabInset + Spacing.three,
          },
        ]}>
        <ThemedText style={styles.title}>Profile</ThemedText>

        <View style={[styles.card, { backgroundColor: theme.segmentedControlSelectedFill }]}>
          <ThemedText style={styles.bigNumber}>{stats.total}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.bigNumberLabel}>
            {stats.total === 1 ? 'place saved' : 'places saved'}
          </ThemedText>
        </View>

        <ThemedText style={styles.sectionLabel}>By category</ThemedText>
        <View style={[styles.card, { backgroundColor: theme.segmentedControlSelectedFill }]}>
          {ALL_CATEGORIES.map((category) => (
            <View key={category} style={styles.statRow}>
              <CategoryTag category={category} selected />
              <ThemedText style={styles.statCount}>{stats.byCategory[category]}</ThemedText>
            </View>
          ))}
        </View>

        <ThemedText style={styles.sectionLabel}>Visit status</ThemedText>
        <View style={[styles.card, { backgroundColor: theme.segmentedControlSelectedFill }]}>
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Visited</ThemedText>
            <ThemedText style={styles.statCount}>{stats.visited}</ThemedText>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Not been yet</ThemedText>
            <ThemedText style={styles.statCount}>{stats.notVisited}</ThemedText>
          </View>
        </View>

        <View style={styles.about}>
          <ThemedText themeColor="textSecondary" style={styles.aboutText}>
            {appName}
            {appVersion ? ` · v${appVersion}` : ''}
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  title: {
    fontFamily: Typography.headings.fontFamily,
    fontSize: Typography.headings.fontSize,
    marginBottom: Spacing.two,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  bigNumber: {
    fontFamily: Typography.headings.fontFamily,
    fontSize: 40,
    textAlign: 'center',
  },
  bigNumberLabel: {
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
    textAlign: 'center',
  },
  sectionLabel: {
    fontFamily: Typography.labels.fontFamily,
    fontSize: Typography.labels.fontSize,
    marginTop: Spacing.two,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
  },
  statCount: {
    fontFamily: Typography.headings.fontFamily,
    fontSize: 18,
  },
  about: {
    marginTop: Spacing.four,
    alignItems: 'center',
  },
  aboutText: {
    fontFamily: Typography.labels.fontFamily,
    fontSize: Typography.labels.fontSize,
  },
});
