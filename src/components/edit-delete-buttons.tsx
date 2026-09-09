import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Typography } from '@/constants/theme';

type EditDeleteButtonsProps = {
  onEdit?: () => void;
  onDelete?: () => void;
};

export function EditDeleteButtons({ onEdit, onDelete }: EditDeleteButtonsProps) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={onEdit}
        style={({ pressed }) => [styles.button, styles.edit, pressed && styles.pressed]}>
        <Image
          source={require('@/assets/images/edit.svg')}
          style={styles.icon}
          tintColor="#FFFFFF"
        />
        <ThemedText style={styles.editLabel}>Edit</ThemedText>
      </Pressable>
      <Pressable
        onPress={onDelete}
        style={({ pressed }) => [styles.button, styles.delete, pressed && styles.pressed]}>
        <ThemedText style={styles.deleteLabel}>Delete</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.85,
  },
  edit: {
    backgroundColor: Colors.light.primary,
  },
  delete: {
    backgroundColor: Colors.light.backgroundElement,
  },
  icon: {
    width: 18,
    height: 18,
  },
  editLabel: {
    fontFamily: Typography.labels.fontFamily,
    fontSize: Typography.labels.fontSize,
    color: Colors.light.background,
  },
  deleteLabel: {
    fontFamily: Typography.labels.fontFamily,
    fontSize: Typography.labels.fontSize,
    color: Colors.light.text,
  },
});
