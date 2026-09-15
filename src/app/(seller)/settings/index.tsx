import { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchSellerProfileThunk } from '@/store/slices/seller.slice';
import { useAuth } from '@/hooks/useAuth';
import { SellerService } from '@/api/services/seller.service';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Divider } from '@/components/common/Divider';
import { Skeleton } from '@/components/loaders/SkeletonLoader';

const storeSchema = z.object({
  name: z.string().min(2, 'Store name is required'),
  description: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, '6-digit pincode required'),
  gstin: z.string().optional(),
});

type StoreSchema = z.infer<typeof storeSchema>;

export default function SellerSettingsScreen() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const { profile, isLoading } = useAppSelector(state => state.seller);
  const store = profile?.store;

  useEffect(() => {
    dispatch(fetchSellerProfileThunk());
  }, [dispatch]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StoreSchema>({
    resolver: zodResolver(storeSchema),
  });

  useEffect(() => {
    if (store) {
      reset({
        name: store.name,
        description: store.description ?? '',
        address: store.address,
        city: store.city,
        state: store.state,
        pincode: store.pincode,
        gstin: store.gstin ?? '',
      });
    }
  }, [store, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: StoreSchema) => SellerService.updateProfile(data),
    onSuccess: () => {
      dispatch(fetchSellerProfileThunk());
      Toast.show({ type: 'success', text1: 'Store settings saved' });
    },
    onError: () => Toast.show({ type: 'error', text1: 'Failed to save settings' }),
  });

  const pickBanner = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 5],
      quality: 0.8,
    });
    if (!result.canceled) {
      Toast.show({ type: 'info', text1: 'Banner upload coming soon' });
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text variant="label" style={styles.headerTitle}>
            STORE SETTINGS
          </Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            {/* Store Banner */}
            <TouchableOpacity style={styles.bannerContainer} onPress={pickBanner} activeOpacity={0.8}>
              {store?.banner ? (
                <Image source={{ uri: store.banner }} style={styles.banner} contentFit="cover" />
              ) : (
                <View style={styles.bannerPlaceholder}>
                  <Text style={styles.bannerIcon}>⊕</Text>
                  <Text variant="label" color="muted">
                    Upload Store Banner
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Store Profile Card */}
            <View style={styles.storeCard}>
              <View style={styles.storeAvatar}>
                <Text style={styles.storeAvatarText}>
                  {store?.name?.charAt(0)?.toUpperCase() ?? 'S'}
                </Text>
              </View>
              <View style={styles.storeCardInfo}>
                <Text variant="headingSmall" color="primary">
                  {store?.name ?? 'Your Store'}
                </Text>
                {store?.isVerified && (
                  <Text variant="caption" color="gold">
                    ✓ Verified Seller
                  </Text>
                )}
              </View>
            </View>

            <Divider />

            {/* Form */}
            {isLoading ? (
              <View style={styles.section}>
                {Array(5).fill(null).map((_, i) => <Skeleton key={i} height={52} />)}
              </View>
            ) : (
              <>
                <View style={styles.section}>
                  <Text variant="label" color="secondary" style={styles.sectionTitle}>
                    STORE INFORMATION
                  </Text>

                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Store Name"
                        placeholder="Your store name"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.name?.message}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Store Description (optional)"
                        placeholder="Tell customers about your store…"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value ?? ''}
                        multiline
                        numberOfLines={3}
                        style={styles.textArea}
                      />
                    )}
                  />
                </View>

                <Divider />

                <View style={styles.section}>
                  <Text variant="label" color="secondary" style={styles.sectionTitle}>
                    ADDRESS
                  </Text>

                  <Controller
                    control={control}
                    name="address"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Street Address"
                        placeholder="Building, Street"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.address?.message}
                      />
                    )}
                  />

                  <View style={styles.twoCol}>
                    <Controller
                      control={control}
                      name="city"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          label="City"
                          placeholder="City"
                          onChangeText={onChange}
                          onBlur={onBlur}
                          value={value}
                          error={errors.city?.message}
                          containerStyle={styles.colInput}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="state"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          label="State"
                          placeholder="State"
                          onChangeText={onChange}
                          onBlur={onBlur}
                          value={value}
                          error={errors.state?.message}
                          containerStyle={styles.colInput}
                        />
                      )}
                    />
                  </View>

                  <Controller
                    control={control}
                    name="pincode"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Pincode"
                        placeholder="6-digit pincode"
                        keyboardType="number-pad"
                        maxLength={6}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.pincode?.message}
                      />
                    )}
                  />
                </View>

                <Divider />

                <View style={styles.section}>
                  <Text variant="label" color="secondary" style={styles.sectionTitle}>
                    BUSINESS DETAILS
                  </Text>

                  <Controller
                    control={control}
                    name="gstin"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="GSTIN (optional)"
                        placeholder="15-character GST number"
                        autoCapitalize="characters"
                        maxLength={15}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value ?? ''}
                      />
                    )}
                  />
                </View>

                <View style={styles.saveSection}>
                  <Button
                    label="Save Settings"
                    onPress={handleSubmit(data => updateMutation.mutate(data))}
                    isLoading={updateMutation.isPending}
                    fullWidth
                    variant="gold"
                  />
                </View>

                <Divider />

                {/* Account Actions */}
                <View style={styles.section}>
                  <Text variant="label" color="secondary" style={styles.sectionTitle}>
                    ACCOUNT
                  </Text>
                  <Button
                    label="Sign Out"
                    variant="outline"
                    fullWidth
                    onPress={logout}
                    style={styles.logoutBtn}
                    labelStyle={{ color: Colors.error }}
                  />
                </View>
              </>
            )}

            <View style={{ height: 80 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  safe: { flex: 1 },
  header: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { letterSpacing: 5 },
  scroll: { paddingBottom: Spacing[6] },

  // Banner
  bannerContainer: { height: 120, overflow: 'hidden' },
  banner: { width: '100%', height: '100%' },
  bannerPlaceholder: {
    flex: 1,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  bannerIcon: { fontSize: 28, color: Colors.textMuted },

  // Store card
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[4],
    padding: Spacing[4],
  },
  storeAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeAvatarText: { fontSize: 22, fontWeight: '700', color: Colors.textInverse },
  storeCardInfo: { flex: 1, gap: Spacing[0.5] },

  // Form
  section: { padding: Spacing[4], gap: Spacing[4] },
  sectionTitle: { letterSpacing: 3 },
  textArea: { height: 80, textAlignVertical: 'top', paddingTop: Spacing[3] },
  twoCol: { flexDirection: 'row', gap: Spacing[3] },
  colInput: { flex: 1 },
  saveSection: { paddingHorizontal: Spacing[4], paddingBottom: Spacing[2] },
  logoutBtn: { borderColor: Colors.error },
});
