import { useState } from 'react';
import { StyleSheet, TextInput, View, type LayoutChangeEvent } from 'react-native';

import { Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const LINE_COUNT = 8;
const LINE_HEIGHT = Typography.handwriting.lineHeight;

type ReflectionEntryProps = {
  value: string;
  onChangeText: (text: string) => void;
  /** Grow to fill the available space instead of a fixed 8-line height — for screens
   * (like Add a place) where the reflection box is the last, most open-ended field. */
  fill?: boolean;
};

export function ReflectionEntry({ value, onChangeText, fill = false }: ReflectionEntryProps) {
  const theme = useTheme();
  // Ruled lines are absolutely positioned at fixed offsets, so a flexible-height card
  // needs to know its actual rendered height to know how many lines fit.
  const [measuredHeight, setMeasuredHeight] = useState(LINE_HEIGHT * LINE_COUNT);
  const lineCount = fill ? Math.max(1, Math.floor(measuredHeight / LINE_HEIGHT)) : LINE_COUNT;

  function handleLayout(event: LayoutChangeEvent) {
    if (fill) setMeasuredHeight(event.nativeEvent.layout.height);
  }

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.card,
        fill ? styles.cardFill : { height: LINE_HEIGHT * LINE_COUNT },
        { backgroundColor: theme.backgroundElement },
      ]}>
      {Array.from({ length: lineCount }, (_, index) => (
        <View
          key={index}
          style={[styles.line, { top: (index + 1) * LINE_HEIGHT, borderColor: theme.textSecondary }]}
        />
      ))}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Leave a comment on what you thought about this place."
        placeholderTextColor={theme.textSecondary}
        multiline
        style={[styles.input, { color: theme.text }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 6,
    overflow: 'hidden',
  },
  cardFill: {
    flex: 1,
    minHeight: LINE_HEIGHT * LINE_COUNT,
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    opacity: 0.4,
  },
  input: {
    flex: 1,
    fontFamily: Typography.handwriting.fontFamily,
    fontSize: Typography.handwriting.fontSize,
    lineHeight: LINE_HEIGHT,
    padding: 12,
    textAlignVertical: 'top',
  },
});
