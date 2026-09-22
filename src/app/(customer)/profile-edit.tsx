import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useConfirm } from '@/providers/ConfirmProvider';
import Toast from 'react-native-toast-message';
import {
  BottomSheet,
  CustomerHeader,
  CustomerScreen,
  Divider,
  Skeleton,
  Text,
} from '@/components/customer';
import { AddressCard } from '@/components/customer/account/AddressCard';
import { ProfileField } from '@/components/customer/account/ProfileField';
import { DeliveryAddressForm } from '@/components/customer/checkout/DeliveryAddressForm';
import { useAuth } from '@/hooks/useAuth';
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useUpdateAddress,
} from '@/hooks/useAddresses';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import type { Address, AddressRequest } from '@/types/user.types';

export default function ProfileEditScreen() {
  const confirm = useConfirm();
  const { user, displayName } = useAuth();
  const { data: addresses = [], isLoading } = useAddresses();

  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [editing, setEditing] = useState<Address | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setSheetOpen(true);
  };

  const openEdit = (address: Address) => {
    setEditing(address);
    setSheetOpen(true);
  };

  const handleSubmit = async (data: AddressRequest) => {
    try {
      if (editing) {
        await updateAddress.mutateAsync({ id: editing.id, data });
      } else {
        // First address becomes the default, so checkout always has one selected.
        await createAddress.mutateAsync({
          ...data,
          isDefault: data.isDefault || addresses.length === 0,
        });
      }
      setSheetOpen(false);
      Toast.show({ type: 'success', text1: editing ? 'Address updated' : 'Address added' });
    } catch {
      Toast.show({ type: 'error', text1: 'Could not save address' });
    }
  };

  const confirmDelete = async (address: Address) => {
    const ok = await confirm({
      title: 'Delete address',
      message: 'Remove this saved address?',
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;
    try {
      await deleteAddress.mutateAsync(address.id);
    } catch {
      Toast.show({ type: 'error', text1: 'Could not delete address' });
    }
  };

  return (
    <CustomerScreen header={<CustomerHeader variant="back" title="Profile" />}>
      <View style={styles.body}>
        {/* Read-only: there is no confirmed profile-update endpoint yet. */}
        <ProfileField label="Name" value={displayName ?? undefined} />
        <ProfileField label="Phone number" value={user?.phone} />

        <Divider />

        <View style={styles.sectionHead}>
          <Text variant="sectionHeading">Addresses</Text>
          <Pressable onPress={openCreate} hitSlop={8} accessibilityRole="button">
            <Text variant="link">Add +</Text>
          </Pressable>
        </View>

        {isLoading ? (
          <View style={styles.list}>
            <Skeleton height={120} />
            <Skeleton height={120} />
          </View>
        ) : addresses.length === 0 ? (
          <Text variant="bodyMuted">No saved addresses yet.</Text>
        ) : (
          <View style={styles.list}>
            {addresses.map((address, index) => (
              <AddressCard
                key={address.id}
                address={address}
                index={index}
                onEdit={openEdit}
                onDelete={confirmDelete}
              />
            ))}
          </View>
        )}
      </View>

      <BottomSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={editing ? 'Edit address' : 'Add address'}
        snap="full"
      >
        <View style={styles.sheetBody}>
          <DeliveryAddressForm
            // Remount per target so the form never shows the previous address.
            key={editing?.id ?? 'new'}
            initial={editing ?? undefined}
            onSubmit={handleSubmit}
            isSubmitting={createAddress.isPending || updateAddress.isPending}
            submitLabel={editing ? 'Update address' : 'Save address'}
          />
        </View>
      </BottomSheet>
    </CustomerScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing[4],
    paddingHorizontal: CustomerLayout.screenPaddingH,
    paddingVertical: Spacing[5],
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  list: { gap: Spacing[3] },
  sheetBody: { padding: CustomerLayout.screenPaddingH },
});
