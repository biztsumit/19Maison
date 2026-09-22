import type { Address } from '@/types/user.types';

export function formatPrice(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(dateString);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

export function formatDiscount(original: number, sale: number): string {
  const pct = Math.round(((original - sale) / original) * 100);
  return `${pct}% OFF`;
}

export function formatOrderNumber(orderNumber: string): string {
  return `#${orderNumber.toUpperCase()}`;
}

export function formatAddressName(address: Address): string {
  return `${address.firstName} ${address.lastName}`.trim();
}

// Renders an address as display lines, skipping the parts that are absent.
// Shared by the checkout address cards, the profile address list and order detail.
export function formatAddressLines(address: Address): string[] {
  const street = [address.address, address.apartment].filter(Boolean).join(', ');
  const locality = [address.city, address.state].filter(Boolean).join(', ');

  return [
    formatAddressName(address),
    street,
    [locality, address.pincode].filter(Boolean).join(' '),
    address.country,
    address.phone,
  ].filter((line): line is string => Boolean(line && line.trim()));
}
