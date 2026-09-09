/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

const light = {
  // Base (Figma: "Supporting neutral" / "Base")
  background: '#FAF6F0',
  backgroundElement: '#E8DDD0',
  backgroundSelected: '#E8E0D0',

  // Text (Figma: "Text" / "Labels/Primary")
  text: '#2C1F14',
  textSecondary: '#6B5A4E',
  labelsPrimary: '#000000',

  // Brand (Figma: "Primary accent" / "Secondary accent")
  primary: '#2D4F52',
  accent: '#C4913A',

  // Categories (Figma: "Restaurant" / "Cafe" / "Museum" / "Park")
  restaurant: '#B5562E',
  cafe: '#8C6D3F',
  museum: '#5C7A8A',
  park: '#6B8754',

  // Misc (Figma: "Star Rating Color" / "Miscellaneous/Segmented Control - Selected Fill")
  starRating: '#E2C966',
  segmentedControlSelectedFill: '#FFFFFF',
} as const;

// The Figma file defines no dark-mode palette yet, so dark mirrors light for now.
export const Colors = {
  light,
  dark: light,
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// Text styles defined in the Figma "Design System" page.
export const Typography = {
  headings: {
    fontFamily: 'DM Serif Display',
    fontWeight: '400',
    fontSize: 24,
    lineHeight: 24,
    letterSpacing: 0,
  },
  body: {
    fontFamily: 'DM Sans',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0,
  },
  labels: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: 0,
  },
  miniLabel: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '400',
    fontSize: 8,
    lineHeight: 8,
    letterSpacing: 0,
  },
  handwriting: {
    fontFamily: 'Gloria Hallelujah',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 29,
    letterSpacing: 0,
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
