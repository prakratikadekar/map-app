import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Typography } from '@/constants/theme';

type ListPillProps = {
  label: string;
  selected?: boolean;
  createNew?: boolean;
};

export function ListPill({ label, selected = false, createNew = false }: ListPillProps) {
  const tint = createNew ? Colors.light.text : selected ? Colors.light.accent : Colors.light.text;

  return (
    <View
      style={[
        styles.pill,
        { borderColor: tint },
        createNew && styles.dashed,
      ]}>
      <ThemedText style={[styles.label, { color: tint }]}>
        {createNew ? `+ ${label}` : label}
      </ThemedText>
    </View>
  );
}

// Same legibility bump as CategoryTag — Figma's 8px miniLabel token is spec-sheet scale,
// not a real on-device size.
const LABEL_SIZE = 12;

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    height: 24,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 0.5,
    backgroundColor: '#FFFFFF',
  },
  dashed: {
    borderStyle: 'dashed',
  },
  label: {
    fontFamily: Typography.miniLabel.fontFamily,
    fontSize: LABEL_SIZE,
    lineHeight: LABEL_SIZE,
  },
});
