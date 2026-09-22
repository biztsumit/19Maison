import type { Href } from 'expo-router';

// Tab group roots.
//
// `(tabs)` is a transparent route group, so the resolvable path is the group root
// itself. `/(customer)/(tabs)/index` type-checks but 404s at runtime, because
// `index` is a group's implicit route and never appears in a URL.
//
// These are cast because expo-router's generated route union is unstable in this
// project: repeated typegen runs alternate between accepting `/(customer)` and
// `/(customer)/(tabs)`, so pinning either literal breaks the build at random.
// Everything else (tab children, detail routes) stays fully type-checked.
export const CUSTOMER_HOME = '/(customer)' as Href;
export const STAFF_HOME = '/(staff)' as Href;
