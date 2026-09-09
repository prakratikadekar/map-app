import { StyleSheet, TextInput, View } from 'react-native';

import { Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const LINE_COUNT = 8;
const LINE_HEIGHT = Typography.handwriting.lineHeight;

type ReflectionEntryProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export function ReflectionEntry({ value, onChangeText }: ReflectionEntryProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      {Array.from({ length: LINE_COUNT }, (_, index) => (
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
    height: LINE_HEIGHT * LINE_COUNT,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 6,
    overflow: 'hidden',
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
