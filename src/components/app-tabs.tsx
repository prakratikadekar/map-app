import { Image, type ImageProps } from 'expo-image';
import { Tabs, TabList, TabTrigger, TabSlot, type TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <FloatingNavBar>
          <TabTrigger name="list" href="/list" asChild>
            <NavIcon
              source={require('@/assets/images/tabIcons/list.svg')}
              accessibilityLabel="List"
            />
          </TabTrigger>
          <TabTrigger name="map" href="/map" asChild>
            <NavIcon
              source={require('@/assets/images/tabIcons/map.svg')}
              accessibilityLabel="Map"
            />
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <NavIcon
              source={require('@/assets/images/tabIcons/profile.svg')}
              accessibilityLabel="Profile"
            />
          </TabTrigger>
        </FloatingNavBar>
      </TabList>
    </Tabs>
  );
}

function FloatingNavBar({ children }: { children?: React.ReactNode }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + 16 }]} pointerEvents="box-none">
      <View style={[styles.pill, { backgroundColor: theme.segmentedControlSelectedFill }]}>
        {children}
      </View>
    </View>
  );
}

function NavIcon({
  source,
  isFocused,
  accessibilityLabel,
  ...props
}: TabTriggerSlotProps & { source: ImageProps['source']; accessibilityLabel: string }) {
  const theme = useTheme();

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: isFocused }}
      hitSlop={12}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
      <Image
        source={source}
        style={styles.icon}
        tintColor={isFocused ? theme.primary : theme.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    flex: 1,
  },
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 64,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  icon: {
    width: 28,
    height: 28,
  },
});
