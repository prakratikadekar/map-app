import AppTabs from '@/components/app-tabs';

// The floating pill nav (AppTabs) is built on expo-router/ui's headless Tabs, which
// only knows about the routes wired up as <TabTrigger>s below it (map/list/profile).
// Keeping that navigator inside this (tabs) group layout — instead of at the app root —
// lets the root Stack (src/app/_layout.tsx) also own the "add-place" modal route as a
// sibling, so it can be presented on top of the whole tab UI.
export const unstable_settings = {
  initialRouteName: 'map',
};

export default AppTabs;
