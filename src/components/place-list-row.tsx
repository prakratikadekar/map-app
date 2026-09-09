import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { CategoryTag } from '@/components/category-tag';
import { StarRating } from '@/components/star-rating';
import { ThemedText } from '@/components/themed-text';
import { Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Place } from '@/types/place';

type PlaceListRowProps = {
  place: Place;
  onPress?: () => void;
};

export function PlaceListRow({ place, onPress }: PlaceListRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <Image
        source={require('@/assets/images/pin.svg')}
        style={styles.pin}
        tintColor={theme[place.category]}
      />
      <View style={styles.text}>
        <ThemedText style={styles.name} numberOfLines={1}>
          {place.name}
        </ThemedText>
        {place.address && (
          <ThemedText style={styles.address} numberOfLines={1}>
            {place.address}
          </ThemedText>
        )}
      </View>
      <View style={styles.meta}>
        <CategoryTag category={place.category} selected />
        {!!place.rating && <StarRating rating={place.rating} size={14} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  pressed: {
    opacity: 0.6,
  },
  pin: {
    width: 32,
    height: 32,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: Typography.headings.fontFamily,
    fontSize: Typography.headings.fontSize,
  },
  address: {
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
  },
  meta: {
    alignItems: 'flex-end',
    gap: 6,
  },
});
