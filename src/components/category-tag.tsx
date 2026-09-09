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

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    height: 18,
    paddingHorizontal: 8,
    borderRadius: 13,
    borderWidth: 0.5,
    backgroundColor: '#FFFFFF',
  },
  icon: {
    width: 12,
    height: 12,
  },
  label: {
    fontFamily: Typography.miniLabel.fontFamily,
    fontSize: Typography.miniLabel.fontSize,
    lineHeight: Typography.miniLabel.fontSize,
  },
});
