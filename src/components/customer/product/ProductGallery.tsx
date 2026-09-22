import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import type { ProductImage } from '@/types/product.types';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Icon } from '../ui/Icon';
import { ImageCarousel } from '../ui/ImageCarousel';
import { Thumbnail } from '../ui/Thumbnail';
import { ImageLightbox } from './ImageLightbox';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';

interface Props {
  images: ProductImage[];
  overlay?: React.ReactNode;
}

const THUMB = 64;

export function ProductGallery({ images, overlay }: Props) {
  const styles = useThemedStyles(makeStyles);
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const urls = images.map(image => image.url).filter(Boolean);

  const height = Math.round(width * 0.82);

  return (
    <View>
      <View>
        {urls.length > 0 ? (
          <ImageCarousel
            images={urls}
            width={width}
            height={height}
            contentFit="contain"
            activeIndex={index}
            onIndexChange={setIndex}
          />
        ) : (
          <Thumbnail style={{ width, height }} iconSize={56} />
        )}

        {urls.length > 0 && (
          <Pressable
            onPress={() => setLightbox(true)}
            hitSlop={10}
            accessibilityLabel="View full screen"
            style={styles.expand}
          >
            <Icon name="expand" size={18} />
          </Pressable>
        )}

        {overlay}
      </View>

      {urls.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbs}
        >
          {urls.map((url, i) => (
            <Pressable
              key={`${url}-${i}`}
              onPress={() => setIndex(i)}
              accessibilityLabel={`Image ${i + 1}`}
              style={[styles.thumb, i === index && styles.thumbActive]}
            >
              <Image source={{ uri: url }} style={styles.thumbImage} contentFit="cover" />
            </Pressable>
          ))}
        </ScrollView>
      )}

      <ImageLightbox
        visible={lightbox}
        images={urls}
        initialIndex={index}
        onClose={() => setLightbox(false)}
      />
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    expand: {
      position: 'absolute',
      top: Spacing[3],
      right: Spacing[3],
      padding: Spacing[2],
      backgroundColor: c.bg,
      borderWidth: 1,
      borderColor: c.border,
    },
    thumbs: {
      gap: Spacing[2],
      paddingHorizontal: CustomerLayout.screenPaddingH,
      paddingTop: Spacing[3],
    },
    thumb: { borderWidth: 2, borderColor: c.transparent },
    thumbActive: { borderColor: c.accent },
    thumbImage: { width: THUMB, height: THUMB },
  });
