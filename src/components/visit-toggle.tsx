import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type VisitToggleProps = {
  visited: boolean;
  onChange: (visited: boolean) => void;
};

export function VisitToggle({ visited, onChange }: VisitToggleProps) {
  const theme = useTheme();

  return (
    <View style={[styles.track, { backgroundColor: theme.backgroundElement }]}>
      <Segment
        label="Visited"
        selected={visited}
        onPress={() => onChange(true)}
        fillColor={theme.segmentedControlSelectedFill}
      />
      <Segment
        label="Not been"
        selected={!visited}
        onPress={() => onChange(false)}
        fillColor={theme.segmentedControlSelectedFill}
      />
    </View>
  );
}

function Segment({
  label,
  selected,
  onPress,
  fillColor,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  fillColor: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.segment, selected && { backgroundColor: fillColor }]}>
      <ThemedText style={styles.label}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    borderRadius: 50,
    alignSelf: 'flex-start',
  },
  segment: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 50,
  },
  label: {
    fontFamily: Typography.miniLabel.fontFamily,
    fontSize: 11,
    textAlign: 'center',
  },
});
