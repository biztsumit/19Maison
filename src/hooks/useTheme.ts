import { useColorScheme } from 'react-native';
import { Colors } from '@/theme/colors';
import { Spacing, BorderRadius } from '@/theme/spacing';
import { TextStyles } from '@/theme/typography';
import { Shadows } from '@/theme/shadows';

export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme !== 'light';

  return {
    isDark,
    colors: Colors,
    spacing: Spacing,
    borderRadius: BorderRadius,
    textStyles: TextStyles,
    shadows: Shadows,
  };
}
