import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryTag } from '@/components/category-tag';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { usePlaces } from '@/hooks/use-places';
import { useTheme } from '@/hooks/use-theme';
import { ALL_CATEGORIES } from '@/types/filters';
import type { PlaceCategory } from '@/types/place';

// Fixes the "Edit" no-op on PlaceInfoCard: name/address/category are set once at
// creation (from the Add-a-Place search result) and had no way to be corrected
// afterward short of delete-and-re-add. Rating/visited/reflection already edit
// live in place on PlaceInfoCard, so this screen only covers the 3 static fields.
export default function EditPlaceScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const { places, updatePlace } = usePlaces();
  const place = places.find((p) => p.id === placeId);

  const [name, setName] = useState(place?.name ?? '');
  const [address, setAddress] = useState(place?.address ?? '');
  const [category, setCategory] = useState<PlaceCategory>(place?.category ?? 'restaurant');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!place || isSaving) return;
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Give this place a name.');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await updatePlace(place.id, {
        name: trimmedName,
        address: address.trim() || undefined,
        category,
      });
      router.back();
    } catch {
      setError("Couldn't save changes — please try again.");
      setIsSaving(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <ThemedText style={styles.title}>Edit place</ThemedText>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Image
              source={require('@/assets/images/close.svg')}
              style={styles.closeIcon}
              tintColor={theme.text}
            />
          </Pressable>
        </View>

        {!place ? (
          <ThemedText themeColor="textSecondary" style={styles.hint}>
            This place has already been removed.
          </ThemedText>
        ) : (
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            <ThemedText style={styles.sectionLabel}>Name</ThemedText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Place name"
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.input,
                { color: theme.text, backgroundColor: theme.segmentedControlSelectedFill },
              ]}
            />

            <ThemedText style={styles.sectionLabel}>Address</ThemedText>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Address (optional)"
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.input,
                { color: theme.text, backgroundColor: theme.segmentedControlSelectedFill },
              ]}
            />

            <ThemedText style={styles.sectionLabel}>Category</ThemedText>
            <View style={styles.categoryRow}>
              {ALL_CATEGORIES.map((option) => (
                <Pressable key={option} onPress={() => setCategory(option)}>
                  <CategoryTag category={option} selected={category === option} />
                </Pressable>
              ))}
            </View>

            {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

            <View style={styles.saveRow}>
              <Pressable
                onPress={handleSave}
                style={({ pressed }) => [styles.saveButton, pressed && styles.savePressed]}>
                <ThemedText style={styles.saveLabel}>Save changes</ThemedText>
              </Pressable>
              {isSaving && <ActivityIndicator color={Colors.light.primary} />}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  headerSpacer: {
    width: 22,
  },
  title: {
    fontFamily: Typography.headings.fontFamily,
    fontSize: Typography.headings.fontSize,
  },
  closeIcon: {
    width: 16,
    height: 16,
  },
  hint: {
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
    textAlign: 'center',
    marginTop: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
    gap: Spacing.two,
  },
  sectionLabel: {
    fontFamily: Typography.labels.fontFamily,
    fontSize: Typography.labels.fontSize,
    marginTop: Spacing.two,
  },
  input: {
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  errorText: {
    fontFamily: Typography.labels.fontFamily,
    fontSize: Typography.labels.fontSize,
    color: Colors.light.restaurant,
  },
  saveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  saveButton: {
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
  },
  savePressed: {
    opacity: 0.85,
  },
  saveLabel: {
    fontFamily: Typography.labels.fontFamily,
    fontSize: Typography.labels.fontSize,
    color: '#FFFFFF',
  },
});
