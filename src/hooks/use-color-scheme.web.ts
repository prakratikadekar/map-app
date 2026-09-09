import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

function subscribe() {
  return () => {};
}

/**
 * To support static rendering, this value needs to be re-calculated on the client side for
 * web. useSyncExternalStore's server/client snapshot split gives us that without a
 * setState-in-effect: it renders 'false' for both the server render and the initial client
 * hydration pass (so they match), then re-renders with 'true' right after hydration.
 */
function useHasHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function useColorScheme() {
  const hasHydrated = useHasHydrated();
  const colorScheme = useRNColorScheme();

  return hasHydrated ? colorScheme : 'light';
}
