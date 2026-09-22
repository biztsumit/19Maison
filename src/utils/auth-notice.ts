// One-shot message handed to the login screen when the gate refuses a session
// (for example a staff account signing in to the customer app).
//
// Module-scoped rather than a route param: the notice is only meaningful within
// this app session, and it avoids depending on expo-router's generated route types.
let notice: string | null = null;

export function setAuthNotice(message: string): void {
  notice = message;
}

export function takeAuthNotice(): string | null {
  const current = notice;
  notice = null;
  return current;
}
