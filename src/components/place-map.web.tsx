import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import type { Place } from '@/types/place';

type PlaceMapProps = {
  places: Place[];
  onMarkerPress?: (place: Place) => void;
};

export function PlaceMap(_props: PlaceMapProps) {
  const theme = useTheme();

  return (
    <View style={[styles.webFallback, { backgroundColor: theme.backgroundElement }]}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
        Map preview isn&apos;t available on web. expo-maps is native-only — run this app in a
        development build on iOS or Android to see it.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  webFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  centerText: {
    textAlign: 'center',
  },
});
