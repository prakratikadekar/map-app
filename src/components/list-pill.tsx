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

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    height: 18,
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderRadius: 13,
    borderWidth: 0.5,
    backgroundColor: '#FFFFFF',
  },
  dashed: {
    borderStyle: 'dashed',
  },
  label: {
    fontFamily: Typography.miniLabel.fontFamily,
    fontSize: Typography.miniLabel.fontSize,
    lineHeight: Typography.miniLabel.fontSize,
  },
});
