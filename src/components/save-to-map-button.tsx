import { Image } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Typography } from '@/constants/theme';

type SaveToMapButtonProps = {
  variant?: 'save' | 'dropPin';
  onPress?: () => void;
};

const variantConfig = {
  save: {
    label: 'Save to map',
    backgroundColor: Colors.light.primary,
    icon: require('@/assets/images/tabIcons/map.svg'),
  },
  dropPin: {
    label: 'Drop pin',
    backgroundColor: Colors.light.accent,
    icon: require('@/assets/images/map-pin.svg'),
  },
};

export function SaveToMapButton({ variant = 'save', onPress }: SaveToMapButtonProps) {
  const config = variantConfig[variant];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: config.backgroundColor },
        pressed && styles.pressed,
      ]}>
      <Image source={config.icon} style={styles.icon} tintColor="#FFFFFF" />
      <ThemedText style={styles.label}>{config.label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 9,
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.85,
  },
  icon: {
    width: 17,
    height: 17,
  },
  label: {
    fontFamily: Typography.labels.fontFamily,
    fontSize: Typography.labels.fontSize,
    color: '#FFFFFF',
  },
});
