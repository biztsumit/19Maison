// Where to send the user after they sign in, when they arrived at a protected
// route directly (deep link, notification tap).
//
// The web encodes this as a `callbackUrl` query param because Next.js middleware
// has no other channel. expo-router already gives us structured path + params, so
// a module-scoped value avoids re-encoding typed routes through a query string.
// Session-scoped by design: it must survive an AuthGate re-render, not a relaunch.

export interface RedirectIntent {
  pathname: string;
  params?: Record<string, string>;
}

let intent: RedirectIntent | null = null;

export function setRedirectIntent(next: RedirectIntent): void {
  intent = next;
}

export function takeRedirectIntent(): RedirectIntent | null {
  const current = intent;
  intent = null;
  return current;
}

export function clearRedirectIntent(): void {
  intent = null;
}

// Only deep targets are worth resuming. A cold start that merely landed on a tab
// root should just go to the default screen after login.
const NON_RESUMABLE = new Set(['', 'index', '(auth)']);

export function isResumableTarget(segments: string[]): boolean {
  const [group, ...rest] = segments;
  if (!group || NON_RESUMABLE.has(group)) return false;
  // A bare group with no child route is a tab root.
  return rest.length > 0;
}
