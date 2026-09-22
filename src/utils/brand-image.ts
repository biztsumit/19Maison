import type { BrandItem } from '@/types/homepage.types';

// The API nests the brand asset under `image`; some payloads expose it flat.
export const brandImage = (brand: BrandItem): string | null =>
  brand.image?.imageUrl ?? brand.imageUrl ?? null;

// Monogram shown when a brand has no logo.
// Multi-word names take one letter per word ("Mont Blanc" -> "MB"); single-word
// names take two, so Lacoste / Levi's / Lindberg stay distinguishable.
export const brandInitials = (name: string): string => {
  const words = (name ?? '').split(/[s-]+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');
};
