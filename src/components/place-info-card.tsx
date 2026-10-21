import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { CategoryTag } from '@/components/category-tag';
import { EditDeleteButtons } from '@/components/edit-delete-buttons';
import { ReflectionEntry } from '@/components/reflection-entry';
import { StarRating } from '@/components/star-rating';
import { ThemedText } from '@/components/themed-text';
import { VisitToggle } from '@/components/visit-toggle';
import { Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Place } from '@/types/place';

type PlaceInfoCardProps = {
  place: Place;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onChangeRating: (rating: number) => void;
  onChangeVisited: (visited: boolean) => void;
  onChangeReflection: (reflection: string) => void;
};

export function PlaceInfoCard({
  place,
  onClose,
  onEdit,
  onDelete,
  onChangeRating,
  onChangeVisited,
  onChangeReflection,
}: PlaceInfoCardProps) {
  const theme = useTheme();

  // Figma's spec always has a photo, with the close button floating over it (see the
  // design-system "Tap icon info card"). Photos aren't wired up yet (no image-picker —
  // see TODO.md), so without one the button needs its own slot in the header row
  // instead of absolute-positioning over nothing, where it collided with CategoryTag.
  const closeButton = (
    <Pressable
      onPress={onClose}
      hitSlop={8}
      style={place.photoUri ? styles.closeButtonOverPhoto : undefined}>
      <Image
        source={require('@/assets/images/close.svg')}
        style={place.photoUri ? styles.closeIconOverPhoto : styles.closeIcon}
        tintColor={place.photoUri ? '#FFFFFF' : theme.text}
      />
    </Pressable>
  );

  return (
    <View style={[styles.card, { backgroundColor: theme.segmentedControlSelectedFill }]}>
      {place.photoUri && (
        <>
          <Image source={{ uri: place.photoUri }} style={styles.photo} />
          {closeButton}
        </>
      )}

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleBlock}>
            <ThemedText style={styles.name}>{place.name}</ThemedText>
            {place.address && <ThemedText style={styles.address}>{place.address}</ThemedText>}
          </View>
          <View style={styles.headerRight}>
            <CategoryTag category={place.category} selected />
            {!place.photoUri && closeButton}
          </View>
        </View>

        <StarRating rating={place.rating ?? 0} onChange={onChangeRating} />

        <VisitToggle visited={place.visited} onChange={onChangeVisited} />

        <ReflectionEntry value={place.reflection ?? ''} onChangeText={onChangeReflection} />

        <EditDeleteButtons onEdit={onEdit} onDelete={onDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  photo: {
    width: '100%',
    height: 160,
  },
  closeButtonOverPhoto: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  closeIconOverPhoto: {
    width: 24,
    height: 24,
  },
  closeIcon: {
    width: 16,
    height: 16,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  name: {
    fontFamily: Typography.headings.fontFamily,
    fontSize: Typography.headings.fontSize,
  },
  address: {
    fontFamily: Typography.labels.fontFamily,
    fontSize: Typography.labels.fontSize,
  },
});
