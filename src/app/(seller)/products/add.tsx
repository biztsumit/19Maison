import { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { z } from 'zod';
import Toast from 'react-native-toast-message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Divider } from '@/components/common/Divider';
import { SellerService } from '@/api/services/seller.service';

const CATEGORIES = ['sunglasses', 'optical', 'sports', 'collectors', 'kids'] as const;
const GENDERS = ['men', 'women', 'unisex', 'kids'] as const;

const addProductSchema = z.object({
  name: z.string().min(3, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, 'Enter a valid price'),
  comparePrice: z.string().optional(),
  category: z.enum(CATEGORIES),
  gender: z.enum(GENDERS),
  brand: z.string().min(2, 'Brand name is required'),
  tags: z.string().optional(),
});

type AddProductSchema = z.infer<typeof addProductSchema>;

export default function AddProductScreen() {
  const queryClient = useQueryClient();
  const [images, setImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]>('sunglasses');
  const [selectedGender, setSelectedGender] = useState<(typeof GENDERS)[number]>('unisex');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddProductSchema>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      comparePrice: '',
      category: 'sunglasses',
      gender: 'unisex',
      brand: '',
      tags: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (formData: FormData) => SellerService.createProduct(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      Toast.show({ type: 'success', text1: 'Product added successfully' });
      router.back();
    },
    onError: () => {
      Toast.show({ type: 'error', text1: 'Failed to add product' });
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5,
    });
    if (!result.canceled) {
      setImages(prev => [...prev, ...result.assets.map(a => a.uri)].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: AddProductSchema) => {
    if (images.length === 0) {
      Alert.alert('Images Required', 'Please add at least one product image.');
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, String(value));
    });
    formData.append('category', selectedCategory);
    formData.append('gender', selectedGender);
    images.forEach((uri, i) => {
      const filename = uri.split('/').pop() ?? `image_${i}.jpg`;
      formData.append('images', { uri, name: filename, type: 'image/jpeg' } as unknown as Blob);
    });

    mutation.mutate(formData);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text color="muted">← Back</Text>
          </TouchableOpacity>
          <Text variant="label" style={styles.headerTitle}>
            ADD PRODUCT
          </Text>
          <View style={{ width: 40 }} />
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
            {/* Image Picker */}
            <View style={styles.section}>
              <Text variant="label" color="secondary" style={styles.sectionTitle}>
                PRODUCT IMAGES
              </Text>
              <Text variant="bodySmall" color="muted">
                Add up to 5 images. First image is the cover.
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
                {images.map((uri, index) => (
                  <View key={uri} style={styles.imageWrapper}>
                    <Image source={{ uri }} style={styles.imageThumb} contentFit="cover" />
                    {index === 0 && (
                      <View style={styles.coverBadge}>
                        <Text variant="caption" style={{ color: Colors.textInverse, fontSize: 9 }}>
                          COVER
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.removeImageBtn}
                      onPress={() => removeImage(index)}
                    >
                      <Text style={styles.removeImageIcon}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                {images.length < 5 && (
                  <TouchableOpacity style={styles.addImageBtn} onPress={pickImage}>
                    <Text style={styles.addImageIcon}>+</Text>
                    <Text variant="caption" color="muted">
                      Add Photo
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>

            <Divider />

            {/* Basic Info */}
            <View style={styles.section}>
              <Text variant="label" color="secondary" style={styles.sectionTitle}>
                BASIC INFORMATION
              </Text>

              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Product Name"
                    placeholder="e.g. Classic Aviator Sunglasses"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.name?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="brand"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Brand"
                    placeholder="e.g. Ray-Ban, Gucci"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.brand?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Description"
                    placeholder="Describe the product in detail…"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.description?.message}
                    multiline
                    numberOfLines={4}
                    style={styles.textArea}
                  />
                )}
              />
            </View>

            <Divider />

            {/* Pricing */}
            <View style={styles.section}>
              <Text variant="label" color="secondary" style={styles.sectionTitle}>
                PRICING
              </Text>
              <View style={styles.priceRow}>
                <Controller
                  control={control}
                  name="price"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Selling Price (₹)"
                      placeholder="0.00"
                      keyboardType="decimal-pad"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      error={errors.price?.message}
                      containerStyle={styles.priceInput}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="comparePrice"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="MRP (₹) Optional"
                      placeholder="0.00"
                      keyboardType="decimal-pad"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value ?? ''}
                      containerStyle={styles.priceInput}
                    />
                  )}
                />
              </View>
            </View>

            <Divider />

            {/* Category */}
            <View style={styles.section}>
              <Text variant="label" color="secondary" style={styles.sectionTitle}>
                CATEGORY
              </Text>
              <View style={styles.chipGroup}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.chip, selectedCategory === cat && styles.chipActive]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text
                      variant="caption"
                      style={selectedCategory === cat ? styles.chipLabelActive : styles.chipLabel}
                    >
                      {cat.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Gender */}
            <View style={styles.section}>
              <Text variant="label" color="secondary" style={styles.sectionTitle}>
                GENDER
              </Text>
              <View style={styles.chipGroup}>
                {GENDERS.map(g => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.chip, selectedGender === g && styles.chipActive]}
                    onPress={() => setSelectedGender(g)}
                  >
                    <Text
                      variant="caption"
                      style={selectedGender === g ? styles.chipLabelActive : styles.chipLabel}
                    >
                      {g.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Divider />

            {/* Tags */}
            <View style={styles.section}>
              <Controller
                control={control}
                name="tags"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Tags (comma separated, optional)"
                    placeholder="e.g. polarized, UV400, lightweight"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value ?? ''}
                  />
                )}
              />
            </View>

            {/* Submit */}
            <View style={styles.submitSection}>
              <Button
                label="Publish Product"
                onPress={handleSubmit(onSubmit)}
                isLoading={mutation.isPending}
                fullWidth
                variant="gold"
              />
            </View>

            <View style={{ height: 60 }} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { letterSpacing: 5 },
  scroll: { paddingBottom: Spacing[6] },
  section: { padding: Spacing[4], gap: Spacing[4] },
  sectionTitle: { letterSpacing: 3, marginBottom: Spacing[1] },

  // Images
  imagesScroll: { flexGrow: 0 },
  imageWrapper: { position: 'relative', marginRight: Spacing[2] },
  imageThumb: { width: 90, height: 110, backgroundColor: Colors.surface },
  coverBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.amber,
    padding: 2,
    alignItems: 'center',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.overlay80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageIcon: { fontSize: 10, color: Colors.textPrimary, fontWeight: '700' },
  addImageBtn: {
    width: 90,
    height: 110,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[1],
    backgroundColor: Colors.surface,
  },
  addImageIcon: { fontSize: 28, color: Colors.textMuted },

  // Pricing
  priceRow: { flexDirection: 'row', gap: Spacing[3] },
  priceInput: { flex: 1 },

  // Chips
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2] },
  chip: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1.5],
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipActive: { borderColor: Colors.amber, backgroundColor: Colors.surfaceElevated },
  chipLabel: { color: Colors.textMuted },
  chipLabelActive: { color: Colors.amber },

  // Text area
  textArea: { height: 100, textAlignVertical: 'top', paddingTop: Spacing[3] },

  // Submit
  submitSection: { padding: Spacing[4], paddingTop: 0 },
});
