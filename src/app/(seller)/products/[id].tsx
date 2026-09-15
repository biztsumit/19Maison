import { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Divider } from '@/components/common/Divider';
import { Skeleton } from '@/components/loaders/SkeletonLoader';
import { SellerService } from '@/api/services/seller.service';

const editSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0),
  comparePrice: z.string().optional(),
  tags: z.string().optional(),
});
type EditSchema = z.infer<typeof editSchema>;

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isActive, setIsActive] = useState(true);

  const { data: product, isLoading } = useQuery({
    queryKey: ['seller-product', id],
    queryFn: () => SellerService.getProducts({ search: id }).then(r => r.data[0]),
    enabled: !!id,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditSchema>({
    resolver: zodResolver(editSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: String(product.price),
        comparePrice: product.comparePrice ? String(product.comparePrice) : '',
        tags: ( product.tags ?? [] ).join(', '),
      });
      setIsActive(product.isActive ?? false);
    }
  }, [product, reset]);

  const mutation = useMutation({
    mutationFn: (data: Partial<typeof product>) => SellerService.updateProduct(id, data!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      Toast.show({ type: 'success', text1: 'Product updated' });
      router.back();
    },
    onError: () => Toast.show({ type: 'error', text1: 'Update failed' }),
  });

  const onSubmit = (data: EditSchema) => {
    mutation.mutate({
      name: data.name,
      description: data.description,
      price: Number(data.price),
      comparePrice: data.comparePrice ? Number(data.comparePrice) : undefined,
      tags: data.tags?.split(',').map(t => t.trim()).filter(Boolean),
      isActive,
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text color="muted">← Back</Text>
          </TouchableOpacity>
          <Text variant="label" style={styles.headerTitle}>
            EDIT PRODUCT
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
            {isLoading ? (
              <View style={styles.section}>
                {Array(4)
                  .fill(null)
                  .map((_, i) => (
                    <Skeleton key={i} height={52} />
                  ))}
              </View>
            ) : (
              <>
                <View style={styles.section}>
                  <Text variant="label" color="secondary" style={styles.sectionTitle}>
                    PRODUCT DETAILS
                  </Text>

                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Product Name"
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
                        label="Description"
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
                          label="MRP (₹)"
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

                <View style={styles.section}>
                  <Controller
                    control={control}
                    name="tags"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Tags (comma separated)"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value ?? ''}
                      />
                    )}
                  />
                </View>

                <Divider />

                <View style={styles.section}>
                  <View style={styles.toggleRow}>
                    <View>
                      <Text variant="titleMedium" color="primary">
                        Active Listing
                      </Text>
                      <Text variant="bodySmall" color="muted">
                        Product is visible to customers
                      </Text>
                    </View>
                    <Switch
                      value={isActive}
                      onValueChange={setIsActive}
                      trackColor={{ false: Colors.border, true: Colors.amber }}
                      thumbColor={Colors.textPrimary}
                    />
                  </View>
                </View>

                <View style={styles.submitSection}>
                  <Button
                    label="Save Changes"
                    onPress={handleSubmit(onSubmit)}
                    isLoading={mutation.isPending}
                    fullWidth
                    variant="gold"
                  />
                </View>
              </>
            )}
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
  sectionTitle: { letterSpacing: 3 },
  priceRow: { flexDirection: 'row', gap: Spacing[3] },
  priceInput: { flex: 1 },
  textArea: { height: 100, textAlignVertical: 'top', paddingTop: Spacing[3] },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submitSection: { padding: Spacing[4] },
});
