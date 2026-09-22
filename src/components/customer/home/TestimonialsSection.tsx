import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomerColors } from '@/theme/customer';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { Text } from '../ui/Text';
import { HorizontalRail } from '../layout/HorizontalRail';
import { Section } from '../layout/Section';
import { SectionHeader } from '../layout/SectionHeader';
import { TESTIMONIALS } from './constants';

// Web uses a masonry column layout; a snap rail is the phone equivalent.
export function TestimonialsSection() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.round(width * 0.78);

  return (
    <Section background="offWhite" gutter={false}>
      <View style={styles.headerWrap}>
        <SectionHeader title="What our clients say" />
      </View>

      <HorizontalRail
        data={TESTIMONIALS}
        itemWidth={cardWidth}
        snap
        keyExtractor={item => item.name}
        renderItem={item => (
          <View style={[styles.card, { width: cardWidth }]}>
            <Text variant="bodySmall">{item.text}</Text>
            <View style={styles.author}>
              <LinearGradient colors={CustomerColors.accentGradient} style={styles.avatar} />
              <View>
                <Text variant="cardBrand">{item.name}</Text>
                <Text variant="caption">{item.location}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </Section>
  );
}

const styles = StyleSheet.create({
  headerWrap: { paddingHorizontal: Spacing[6] },
  card: {
    gap: Spacing[4],
    padding: Spacing[5],
    backgroundColor: CustomerColors.bg,
    borderWidth: 1,
    borderColor: CustomerColors.border,
  },
  author: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  avatar: { width: 40, height: 40, borderRadius: BorderRadius.full },
});
