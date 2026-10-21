import { DMSans_400Regular } from '@expo-google-fonts/dm-sans';
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import { GloriaHallelujah_400Regular } from '@expo-google-fonts/gloria-hallelujah';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { PlacesProvider } from '@/hooks/use-places';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    'DM Serif Display': DMSerifDisplay_400Regular,
    'DM Sans': DMSans_400Regular,
    'Plus Jakarta Sans': PlusJakartaSans_400Regular,
    'Gloria Hallelujah': GloriaHallelujah_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PlacesProvider>
        <AnimatedSplashOverlay />
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="add-place" options={{ presentation: 'modal' }} />
          <Stack.Screen name="edit-place" options={{ presentation: 'modal' }} />
        </Stack>
      </PlacesProvider>
    </ThemeProvider>
  );
}
