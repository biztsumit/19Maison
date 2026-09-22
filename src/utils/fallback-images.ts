import type { ImageSourcePropType } from 'react-native';

// Bundled artwork for cases where we have something genuinely representative.
// Anything without a meaningful image falls back to Thumbnail's icon placeholder
// rather than an unrelated stock photo.
const GENDER_ARTWORK: Record<string, ImageSourcePropType> = {
  MEN: require('../../assets/images/gender-men.png'),
  WOMEN: require('../../assets/images/gender-women.png'),
};

export const genderArtwork = (gender: string): ImageSourcePropType | undefined =>
  GENDER_ARTWORK[gender?.toUpperCase()];
