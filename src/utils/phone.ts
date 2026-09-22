// Every account on this storefront is Indian, and the API stores phone numbers in
// E.164 (`+919876543210`). Asking a shopper to type `+91` themselves was the single
// most common reason login failed validation, so the forms now hold the 10-digit
// national number and the country code is added on the way out.

export const INDIA_DIAL_CODE = '+91';
export const INDIA_PHONE_LENGTH = 10;

// Indian mobile numbers are 10 digits and never start below 6.
const NATIONAL_RE = /^[6-9]\d{9}$/;

/**
 * Anything a user can paste or type — `+91 98765 43210`, `09876543210`,
 * `91-98765-43210` — reduced to the bare national number. Never longer than 10
 * digits, so it is safe to feed straight back into a `TextInput`.
 */
export function toNationalPhone(input: string | null | undefined): string {
  if (!input) return '';
  let digits = input.replace(/\D/g, '');
  // Strip the country code however it arrived, then a trunk `0`.
  if (digits.length > INDIA_PHONE_LENGTH && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length > INDIA_PHONE_LENGTH && digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, INDIA_PHONE_LENGTH);
}

/** National digits → the E.164 string the API expects. Empty in, empty out. */
export function toE164Phone(national: string | null | undefined): string {
  const digits = toNationalPhone(national);
  return digits ? `${INDIA_DIAL_CODE}${digits}` : '';
}

export function isValidIndianPhone(value: string | null | undefined): boolean {
  return NATIONAL_RE.test(toNationalPhone(value));
}

/**
 * Display form: `+91 98765 43210`. Falls back to whatever was stored if it is not a
 * number we recognise, so an older or foreign record is shown rather than blanked.
 */
export function formatPhone(value: string | null | undefined): string {
  if (!value) return '';
  const national = toNationalPhone(value);
  if (national.length !== INDIA_PHONE_LENGTH) return value;
  return `${INDIA_DIAL_CODE} ${national.slice(0, 5)} ${national.slice(5)}`;
}
