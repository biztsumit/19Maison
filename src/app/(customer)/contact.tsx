import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { CustomerHeader, CustomerScreen, Divider, Icon, Text } from '@/components/customer';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import type { IconName } from '@/components/customer';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

const PHONE = '+919876543210';
const EMAIL = 'care@19maison.com';
const WHATSAPP = '919876543210';

interface Row {
  key: string;
  icon: IconName;
  label: string;
  value: string;
  url: string;
}

const ROWS: Row[] = [
  {
    key: 'whatsapp',
    icon: 'phone',
    label: 'WhatsApp',
    value: 'Chat with us',
    url: `https://wa.me/${WHATSAPP}`,
  },
  { key: 'phone', icon: 'phone', label: 'Call us', value: PHONE, url: `tel:${PHONE}` },
  { key: 'mail', icon: 'mail', label: 'Email', value: EMAIL, url: `mailto:${EMAIL}` },
];

export default function ContactScreen() {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  const open = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) Linking.openURL(url);
  };

  return (
    <CustomerScreen header={<CustomerHeader variant="back" title="Contact us" />}>
      <View style={styles.body}>
        <Text variant="screenTitle">Let us connect</Text>
        <Text variant="bodyMuted">
          Our specialists are available Monday to Saturday, 10am to 7pm.
        </Text>

        <View style={styles.rows}>
          {ROWS.map(row => (
            <Pressable
              key={row.key}
              onPress={() => open(row.url)}
              accessibilityRole="link"
              accessibilityLabel={`${row.label}: ${row.value}`}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
              <View style={styles.iconBox}>
                <Icon name={row.icon} size={20} color={colors.onInverse} />
              </View>
              <View style={styles.rowText}>
                <Text variant="cardTitle">{row.label}</Text>
                <Text variant="bodySmallMuted">{row.value}</Text>
              </View>
              <Icon name="chevron-right" size={18} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>

        <Divider />

        <Text variant="sectionHeading">Visit the boutique</Text>
        <Text variant="bodyMuted">
          19 Maison flagship store. Tap below to open directions in your maps app.
        </Text>
        <Pressable
          onPress={() => open('https://maps.google.com/?q=19+Maison')}
          accessibilityRole="link"
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        >
          <View style={styles.iconBox}>
            <Icon name="map-pin" size={20} color={colors.onInverse} />
          </View>
          <View style={styles.rowText}>
            <Text variant="cardTitle">Get directions</Text>
            <Text variant="bodySmallMuted">Open in maps</Text>
          </View>
          <Icon name="chevron-right" size={18} color={colors.textMuted} />
        </Pressable>
      </View>
    </CustomerScreen>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    body: {
      gap: Spacing[4],
      paddingHorizontal: CustomerLayout.screenPaddingH,
      paddingVertical: Spacing[5],
    },
    rows: { gap: Spacing[3] },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing[4],
      padding: Spacing[4],
      borderWidth: 1,
      borderColor: c.border,
    },
    pressed: { opacity: 0.7 },
    iconBox: {
      width: 40,
      height: 40,
      backgroundColor: c.inverseSurface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowText: { flex: 1, gap: Spacing[0.5] },
  });
