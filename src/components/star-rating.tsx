import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';

type StarRatingProps = {
  rating: number;
  onChange?: (rating: number) => void;
  size?: number;
};

const STAR_COUNT = 5;

export function StarRating({ rating, onChange, size = 19.2 }: StarRatingProps) {
  const stars = Array.from({ length: STAR_COUNT }, (_, index) => index < rating);

  return (
    <View style={styles.row}>
      {stars.map((filled, index) => {
        const star = (
          <Image
            source={require('@/assets/images/star.svg')}
            style={{ width: size, height: size }}
            tintColor={filled ? Colors.light.starRating : Colors.light.backgroundElement}
          />
        );

        if (!onChange) {
          return <View key={index}>{star}</View>;
        }

        return (
          <Pressable key={index} onPress={() => onChange(index + 1)} hitSlop={4}>
            {star}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
