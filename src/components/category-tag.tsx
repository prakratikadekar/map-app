import { Image, type ImageProps } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Typography } from '@/constants/theme';
import type { PlaceCategory } from '@/types/place';

const categoryConfig: Record<
  PlaceCategory,
  { label: string; color: string; icon: ImageProps['source'] }
> = {
  restaurant: {
    label: 'Restaurant',
    color: Colors.light.restaurant,
    icon: require('@/assets/images/categoryIcons/restaurant.svg'),
  },
  cafe: {
    label: 'Cafe',
    color: Colors.light.cafe,
    icon: require('@/assets/images/categoryIcons/cafe.svg'),
  },
  museum: {
    label: 'Museum',
    color: Colors.light.museum,
    icon: require('@/assets/images/categoryIcons/museum.svg'),
  },
  park: {
    label: 'Park',
    color: Colors.light.park,
    icon: require('@/assets/images/categoryIcons/park.svg'),
  },
};

type CategoryTagProps = {
  category: PlaceCategory;
  selected?: boolean;
};

export function CategoryTag({ category, selected = false }: CategoryTagProps) {
  const config = categoryConfig[category];
  const tint = selected ? config.color : Colors.light.text;

  return (
    <View style={[styles.pill, { borderColor: tint }]}>
      <Image source={config.icon} style={styles.icon} tintColor={tint} />
      <ThemedText style={[styles.label, { color: tint }]}>{config.label}</ThemedText>
    </View>
  );
}

// Figma's "miniLabel" token is 8px — accurate to the design-system spec sheet, but
// too small to read on a real device (the same issue already fixed once for
// VisitToggle's label, see theme.ts/TODO.md). Tags render at a bumped-up 12px instead,
// with the pill's other dimensions scaled up to match.
const LABEL_SIZE = 12;

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 0.5,
    backgroundColor: '#FFFFFF',
  },
  icon: {
    width: 14,
    height: 14,
  },
  label: {
    fontFamily: Typography.miniLabel.fontFamily,
    fontSize: LABEL_SIZE,
    lineHeight: LABEL_SIZE,
  },
});
