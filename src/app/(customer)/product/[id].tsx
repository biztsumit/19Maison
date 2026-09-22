import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  CustomerHeader,
  CustomerScreen,
  ErrorView,
  Skeleton,
  StarRating,
  Text,
} from '@/components/customer';
import { AddToCartBar } from '@/components/customer/product/AddToCartBar';
import { AddedToBagSheet } from '@/components/customer/product/AddedToBagSheet';
import { ColorSelector } from '@/components/customer/product/ColorSelector';
import type { ColorOption } from '@/components/customer/product/ColorSelector';
import { ProductAccordion } from '@/components/customer/product/ProductAccordion';
import { ProductGallery } from '@/components/customer/product/ProductGallery';
import { PromoBanner } from '@/components/customer/product/PromoBanner';
import { RelatedProducts } from '@/components/customer/product/RelatedProducts';
import { SizeSelector } from '@/components/customer/product/SizeSelector';
import type { SizeOption } from '@/components/customer/product/SizeSelector';
import { TrustBadgeRow } from '@/components/customer/product/TrustBadgeRow';
import { WishlistButton } from '@/components/customer/product/WishlistButton';
import { useCart } from '@/hooks/useCart';
import { useProduct } from '@/hooks/useProducts';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import type { ProductVariant } from '@/types/product.types';
import { formatPrice } from '@/utils/formatters';

const COUPON_CODE = 'FLAT10';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isLoading, isError, error } = useProduct(id);
  const { addToCart } = useCart();

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);

  const variants = useMemo(() => product?.variants ?? [], [product]);

  // Colour and size are both encoded on variants; there is no separate entity.
  const colorOptions: ColorOption[] = useMemo(() => {
    const seen = new Map<string, ColorOption>();
    for (const variant of variants) {
      if (!variant.frameColor || seen.has(variant.frameColor)) continue;
      seen.set(variant.frameColor, {
        id: variant.frameColor,
        label: variant.frameColor,
        hex: variant.frameColorCode,
        thumbnailUrl: variant.images?.[0]?.url,
      });
    }
    return [...seen.values()];
  }, [variants]);

  const activeColor = selectedColor ?? colorOptions[0]?.id ?? null;

  const sizeOptions: SizeOption[] = useMemo(() => {
    const matching = activeColor ? variants.filter(v => v.frameColor === activeColor) : variants;
    const seen = new Map<string, SizeOption>();
    for (const variant of matching) {
      if (variant.size == null) continue;
      const key = String(variant.size);
      if (seen.has(key)) continue;
      seen.set(key, { id: key, label: key, available: variant.inStock !== false });
    }
    return [...seen.values()];
  }, [variants, activeColor]);

  const activeSize = selectedSize ?? sizeOptions[0]?.id ?? null;

  const selectedVariant: ProductVariant | undefined = useMemo(
    () =>
      variants.find(
        v =>
          (!activeColor || v.frameColor === activeColor) &&
          (!activeSize || String(v.size) === activeSize),
      ),
    [variants, activeColor, activeSize],
  );

  const galleryImages = selectedVariant?.images?.length
    ? selectedVariant.images
    : (product?.images ?? []);

  const price =
    selectedVariant?.discountedPrice ?? selectedVariant?.salePrice ?? product?.price ?? 0;
  const comparePrice =
    selectedVariant?.discountedPrice != null &&
    selectedVariant.discountedPrice < selectedVariant.salePrice
      ? selectedVariant.salePrice
      : undefined;

  const inStock = selectedVariant?.inStock !== false;
  const maxQuantity = selectedVariant?.stock;

  const handleAdd = async (goToCheckout: boolean) => {
    if (!selectedVariant) return;
    const setBusy = goToCheckout ? setBuying : setAdding;
    setBusy(true);
    try {
      await addToCart({ variantId: selectedVariant.id, quantity });
      if (goToCheckout) {
        router.push('/(customer)/checkout');
      } else {
        setBagOpen(true);
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Could not add to bag' });
    } finally {
      setBusy(false);
    }
  };

  const header = <CustomerHeader variant="shop" title="" showCart />;

  if (isLoading) {
    return (
      <CustomerScreen header={header}>
        <Skeleton height={320} />
        <View style={styles.body}>
          <Skeleton width="50%" height={14} />
          <Skeleton width="80%" height={22} />
          <Skeleton width="35%" height={20} />
        </View>
      </CustomerScreen>
    );
  }

  if (isError || !product) {
    return (
      <CustomerScreen header={header} scroll={false}>
        <ErrorView
          title="Product unavailable"
          message={error instanceof Error ? error.message : undefined}
          onBack={() => router.back()}
        />
      </CustomerScreen>
    );
  }

  return (
    <CustomerScreen
      header={header}
      footer={
        <AddToCartBar
          quantity={quantity}
          onQuantityChange={setQuantity}
          maxQuantity={maxQuantity}
          onAddToCart={() => handleAdd(false)}
          onBuyNow={() => handleAdd(true)}
          adding={adding}
          buying={buying}
          disabled={!selectedVariant || !inStock}
          disabledReason={!inStock ? 'This variant is out of stock' : undefined}
        />
      }
    >
      <ProductGallery
        images={galleryImages}
        overlay={<WishlistButton productId={product.id} style={styles.wishlist} />}
      />

      <View style={styles.body}>
        <Text variant="cardBrand">{product.brand?.name}</Text>
        <Text variant="screenTitle">{product.name}</Text>

        {product.rating !== undefined && product.rating > 0 && (
          <StarRating value={product.rating} showValue reviewCount={product.reviewCount} />
        )}

        <View style={styles.priceRow}>
          <Text variant="priceLarge">{formatPrice(price)}</Text>
          {comparePrice !== undefined && (
            <Text variant="priceStrike">{formatPrice(comparePrice)}</Text>
          )}
        </View>

        <ColorSelector
          colors={colorOptions}
          selectedId={activeColor}
          onSelect={colorId => {
            setSelectedColor(colorId);
            setSelectedSize(null);
          }}
        />

        <SizeSelector sizes={sizeOptions} selectedId={activeSize} onSelect={setSelectedSize} />

        <PromoBanner code={COUPON_CODE} description="10% off your first order" />

        <TrustBadgeRow />

        <ProductAccordion description={product.description} />
      </View>

      <RelatedProducts brandSlug={product.brand?.slug} excludeId={product.id} />

      <AddedToBagSheet
        visible={bagOpen}
        onClose={() => setBagOpen(false)}
        product={product}
        variantLabel={[activeColor, activeSize].filter(Boolean).join(' / ')}
        quantity={quantity}
      />
    </CustomerScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing[4],
    paddingHorizontal: CustomerLayout.screenPaddingH,
    paddingVertical: Spacing[5],
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  wishlist: { position: 'absolute', top: Spacing[3], left: Spacing[3] },
});
