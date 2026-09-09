import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Typography } from '@/constants/theme';
import type { PlaceCategory } from '@/types/place';

const categoryColor: Record<PlaceCategory, string> = {
  restaurant: Colors.light.restaurant,
  cafe: Colors.light.cafe,
  museum: Colors.light.museum,
  park: Colors.light.park,
};

type SearchResultRowProps = {
  name: string;
  address: string;
  category: PlaceCategory;
  onPress?: () => void;
};

export function SearchResultRow({ name, address, category, onPress }: SearchResultRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <Image
        source={require('@/assets/images/pin.svg')}
        style={styles.pin}
        tintColor={categoryColor[category]}
      />
      <View style={styles.text}>
        <ThemedText style={styles.name}>{name}</ThemedText>
        <ThemedText style={styles.address}>{address}</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
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
});
