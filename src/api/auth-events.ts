// Lets the axios interceptor signal an unrecoverable auth failure without
// importing the store (which would close the loop store → slices → services → client).
type UnauthorizedHandler = () => void;

let handler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(fn: UnauthorizedHandler | null): void {
  handler = fn;
}

export function emitUnauthorized(): void {
  handler?.();
}
