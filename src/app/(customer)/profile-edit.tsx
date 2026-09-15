import { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';
import { Font, FontSize } from '@/theme/typography';
import { Text } from '@/components/common/Text';
import { useAuth } from '@/hooks/useAuth';

function BackHeader({ title }: { title: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.backHeader,
        { paddingTop: insets.top + 8 },
      ]}
    >
      <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>
      <Text style={styles.backTitle}>{title}</Text>
      <View style={styles.backSpacer} />
    </View>
  );
}

const MOCK_ADDRESSES = [
  {
    id: '1',
    label: 'Default Address',
    lines: ['Full Name', '123 Luxury Lane', 'Apt 4B', 'Mumbai, Maharashtra, India', '400001', '+91 98765-43210'],
  },
  {
    id: '2',
    label: 'Work Address',
    lines: ['Full Name', '456 Business Park', 'Building C, Floor 2', 'Mumbai, Maharashtra, India', '400051', '+91 98765-43210'],
  },
];

export default function ProfileEditScreen() {
  const { user, displayName } = useAuth();
  const [name, setName] = useState(displayName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <BackHeader title="Profile" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Fields section */}
        <View style={styles.fieldsSection}>
          {/* Name field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={Colors.textGray}
            />
          </View>

          {/* Phone field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Phone number *</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor={Colors.textGray}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Addresses section */}
        <View style={styles.addressesSection}>
          {/* Section heading row */}
          <View style={styles.addressHeadRow}>
            <Text style={styles.addressHeadText}>Addresses</Text>
            <TouchableOpacity hitSlop={8}>
              <Text style={styles.addBtn}>Add +</Text>
            </TouchableOpacity>
          </View>

          {/* Address cards */}
          {MOCK_ADDRESSES.map((addr) => (
            <View key={addr.id} style={styles.addressCard}>
              <View style={styles.addressCardHead}>
                <Text style={styles.addressCardLabel}>{addr.label}</Text>
                <TouchableOpacity hitSlop={8}>
                  <Text style={styles.editIcon}>✎</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.addressCardBody}>
                {addr.lines.map((line, idx) => (
                  <Text key={idx} style={styles.addressLine}>{line}</Text>
                ))}
              </View>
            </View>
          ))}
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

  // Fields
  fieldsSection: {
    padding: 24,
    gap: 24,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontFamily: Font.semibold,
    fontSize: FontSize.base,
    color: '#000000',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(221,221,221,0.87)',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontFamily: Font.regular,
    fontSize: FontSize.md,
    color: '#000000',
  },

  // Addresses
  addressesSection: {
    paddingHorizontal: 24,
    gap: 16,
  },
  addressHeadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressHeadText: {
    fontFamily: Font.medium,
    fontSize: FontSize.lg,
    color: '#000000',
  },
  addBtn: {
    fontFamily: Font.regular,
    fontSize: FontSize.lg,
    color: '#D4AF37',
    textDecorationLine: 'underline',
  },
  addressCard: {
    borderWidth: 1,
    borderColor: 'rgba(221,221,221,0.87)',
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  addressCardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressCardLabel: {
    fontFamily: Font.medium,
    fontSize: FontSize.base,
    color: '#000000',
  },
  editIcon: {
    fontSize: 18,
    color: '#626262',
  },
  addressCardBody: {
    gap: 4,
  },
  addressLine: {
    fontFamily: Font.regular,
    fontSize: FontSize.md,
    color: '#626262',
    lineHeight: FontSize.md * 1.5,
  },
});
