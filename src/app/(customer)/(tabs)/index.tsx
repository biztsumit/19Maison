import { useMemo } from 'react';
import Toast from 'react-native-toast-message';
import { NewsletterService } from '@/api/services/newsletter.service';
import { CustomerHeader, CustomerScreen, FooterBar } from '@/components/customer';
import { BrandBannerSection } from '@/components/customer/home/BrandBannerSection';
import { BrandsStrip } from '@/components/customer/home/BrandsStrip';
import { FaqSection } from '@/components/customer/home/FaqSection';
import { FlagshipSection } from '@/components/customer/home/FlagshipSection';
import { HeroSlider } from '@/components/customer/home/HeroSlider';
import { InstagramSection } from '@/components/customer/home/InstagramSection';
import { LatestDropSection } from '@/components/customer/home/LatestDropSection';
import { NewsletterSection } from '@/components/customer/home/NewsletterSection';
import { ShopByGenderSection } from '@/components/customer/home/ShopByGenderSection';
import { TestimonialsSection } from '@/components/customer/home/TestimonialsSection';
import { TrustBadgesSection } from '@/components/customer/home/TrustBadgesSection';
import { useActiveBrands } from '@/hooks/useBrands';
import { useHomepage, useLatestDrop } from '@/hooks/useHomepage';
import { mapHomepageProduct } from '@/types/homepage.types';

export default function HomeScreen() {
  const { data: homepage, isLoading: homepageLoading, refetch } = useHomepage();
  const { data: latestDrop, isLoading: latestLoading } = useLatestDrop();
  // Brands come from the dedicated /brands/active endpoint, as on the web.
  const { data: brands, isLoading: brandsLoading } = useActiveBrands();

  const latestProducts = useMemo(() => (latestDrop ?? []).map(mapHomepageProduct), [latestDrop]);

  const handleSubscribe = async (email: string) => {
    try {
      await NewsletterService.subscribe(email);
      Toast.show({ type: 'success', text1: 'Subscribed', text2: 'You are on the list.' });
    } catch {
      Toast.show({ type: 'error', text1: 'Could not subscribe', text2: 'Please try again later.' });
    }
  };

  return (
    <CustomerScreen
      header={<CustomerHeader variant="logo" showSearch />}
      refreshing={homepageLoading}
      onRefresh={refetch}
    >
      {/* Figma: the brand circles sit on the black header block, under the search bar. */}
      <BrandsStrip brands={brands ?? []} isLoading={brandsLoading} />

      <HeroSlider banners={homepage?.heroSection ?? []} isLoading={homepageLoading} />

      <LatestDropSection products={latestProducts} isLoading={latestLoading} />

      <BrandBannerSection banner={homepage?.brandBannerSection ?? null} />

      <ShopByGenderSection sections={homepage?.shopByGenderSections ?? []} />

      {/* Collectors Edition is in the design but has no API yet, so it is not
          rendered rather than shown with placeholder data. */}

      <FlagshipSection store={homepage?.storeSection ?? null} />

      <TrustBadgesSection />

      <InstagramSection images={homepage?.gallerySection ?? []} />

      <TestimonialsSection />

      <NewsletterSection onSubscribe={handleSubscribe} />

      <FaqSection />

      <FooterBar />
    </CustomerScreen>
  );
}
