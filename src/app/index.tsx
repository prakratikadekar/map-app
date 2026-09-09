import { Redirect } from 'expo-router';

// A native cold launch always resolves to the bare "/" path first — there's no address
// bar to land on a specific screen like there is on web. But "/" itself isn't one of
// our real screens: the map tab was renamed from index.tsx to map.tsx for consistency
// with the "list"/"map"/"profile" feature names (see TODO.md's "Follow-up fixes").
// This redirect exists purely so a fresh app launch has somewhere valid to land instead
// of hitting expo-router's Unmatched/404 screen.
export default function RootIndex() {
  return <Redirect href="/map" />;
}
