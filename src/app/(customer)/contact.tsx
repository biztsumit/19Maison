import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Font, FontSize } from '@/theme/typography';
import { Text } from '@/components/common/Text';

function BackHeader({ title }: { title: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.backHeader, { paddingTop: insets.top + 8 }]}>
      <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>
      <Text style={styles.backTitle}>{title}</Text>
      <View style={styles.backSpacer} />
    </View>
  );
}

interface ContactRowProps {
  icon: string;
  children: React.ReactNode;
}

function ContactRow({ icon, children }: ContactRowProps) {
  return (
    <View style={styles.contactRow}>
      <Text style={styles.contactIcon}>{icon}</Text>
      <View style={styles.contactContent}>{children}</View>
    </View>
  );
}

export default function ContactScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <BackHeader title="Contact Us" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Heading */}
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Let&apos;s Connect!</Text>
        </View>

        {/* Contact info rows */}
        <View style={styles.contactSection}>
          {/* WhatsApp */}
          <ContactRow icon="💬">
            <TouchableOpacity hitSlop={4}>
              <Text style={styles.contactLink}>Chat now</Text>
            </TouchableOpacity>
          </ContactRow>

          {/* Phone */}
          <ContactRow icon="📞">
            <Text style={styles.contactValue}>+91 78965-78545</Text>
          </ContactRow>

          {/* Email */}
          <ContactRow icon="✉">
            <Text style={styles.contactValue}>contact@19maison.com</Text>
          </ContactRow>

          {/* Address */}
          <ContactRow icon="📍">
            <Text style={styles.contactValue}>Address, City, State, Country, Zip code</Text>
          </ContactRow>
        </View>

        {/* Map image */}
        <View style={styles.mapContainer}>
          <Image
            source={require('../../../assets/images/contact-map.png')}
            style={styles.mapImage}
            contentFit="cover"
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Back header
  backHeader: {
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(221,221,221,0.87)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backArrow: {
    fontSize: 22,
    color: '#000000',
  },
  backTitle: {
    fontFamily: Font.semibold,
    fontSize: FontSize['2xl'],
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  backSpacer: {
    width: 38,
  },

  // Heading
  headingContainer: {
    padding: 24,
  },
  heading: {
    fontFamily: Font.semibold,
    fontSize: FontSize['2xl'],
    color: '#000000',
    lineHeight: FontSize['2xl'] * 1.3,
  },

  // Contact section
  contactSection: {
    paddingHorizontal: 24,
    gap: 24,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  contactIcon: {
    fontSize: 20,
    lineHeight: 26,
  },
  contactContent: {
    flex: 1,
    justifyContent: 'center',
  },
  contactValue: {
    fontFamily: Font.regular,
    fontSize: FontSize.md,
    color: '#626262',
    lineHeight: FontSize.md * 1.3,
  },
  contactLink: {
    fontFamily: Font.regular,
    fontSize: FontSize.md,
    color: '#626262',
    textDecorationLine: 'underline',
    lineHeight: FontSize.md * 1.3,
  },

  // Map
  mapContainer: {
    marginHorizontal: 24,
    marginTop: 32,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
});
