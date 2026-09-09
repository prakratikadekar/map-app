import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { CategoryTag } from '@/components/category-tag';
import { ThemedText } from '@/components/themed-text';
import { Colors, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ALL_CATEGORIES, defaultFilters, type PlaceFilters, type VisitFilter } from '@/types/filters';

type FilterPanelProps = {
  filters: PlaceFilters;
  onChange: (filters: PlaceFilters) => void;
  onClose: () => void;
};

const visitOptions: { value: VisitFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'visited', label: 'Visited' },
  { value: 'notVisited', label: 'Not been' },
];

export function FilterPanel({ filters, onChange, onClose }: FilterPanelProps) {
  const theme = useTheme();

  function toggleCategory(category: (typeof ALL_CATEGORIES)[number]) {
    const isSelected = filters.categories.includes(category);
    const categories = isSelected
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onChange({ ...filters, categories });
  }

  return (
    <View style={[styles.panel, { backgroundColor: theme.segmentedControlSelectedFill }]}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Filter</ThemedText>
        <Pressable onPress={onClose} hitSlop={8}>
          <Image
            source={require('@/assets/images/close.svg')}
            style={styles.closeIcon}
            tintColor={theme.text}
          />
        </Pressable>
      </View>

      <ThemedText style={styles.sectionLabel}>Category</ThemedText>
      <View style={styles.row}>
        {ALL_CATEGORIES.map((category) => (
          <Pressable key={category} onPress={() => toggleCategory(category)}>
            <CategoryTag category={category} selected={filters.categories.includes(category)} />
          </Pressable>
        ))}
      </View>

      <ThemedText style={styles.sectionLabel}>Visit status</ThemedText>
      <View style={[styles.track, { backgroundColor: theme.backgroundElement }]}>
        {visitOptions.map((option) => {
          const selected = filters.visited === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange({ ...filters, visited: option.value })}
              style={[
                styles.segment,
                selected && { backgroundColor: theme.segmentedControlSelectedFill },
              ]}>
              <ThemedText style={styles.segmentLabel}>{option.label}</ThemedText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          onPress={() => onChange(defaultFilters)}
          style={[styles.button, { backgroundColor: theme.background }]}>
          <ThemedText style={styles.resetLabel}>Reset</ThemedText>
        </Pressable>
        <Pressable
          onPress={onClose}
          style={[styles.button, { backgroundColor: Colors.light.primary }]}>
          <ThemedText style={styles.applyLabel}>Apply filters</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 28,
    padding: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: Typography.body.fontFamily,
    fontSize: 20,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  sectionLabel: {
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    borderRadius: 50,
    alignSelf: 'flex-start',
  },
  segment: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 50,
  },
  segmentLabel: {
    fontFamily: Typography.miniLabel.fontFamily,
    fontSize: 11,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 13,
    justifyContent: 'center',
    marginTop: 8,
  },
  button: {
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 124,
  },
  resetLabel: {
    fontFamily: Typography.labels.fontFamily,
    fontSize: Typography.labels.fontSize,
    color: Colors.light.text,
  },
  applyLabel: {
    fontFamily: Typography.labels.fontFamily,
    fontSize: Typography.labels.fontSize,
    color: Colors.light.background,
  },
});
