import type { IconName } from '../ui/Icon';

export const GENDER_LABEL: Record<string, string> = {
  MEN: 'Men',
  WOMEN: 'Women',
  UNISEX: 'Unisex',
};

export interface TrustBadge {
  key: string;
  icon: IconName;
  title: string;
  description: string;
}

export const TRUST_BADGES: TrustBadge[] = [
  {
    key: 'shipping',
    icon: 'shipping',
    title: 'Complimentary Shipping',
    description: 'Free insured delivery on every order across India.',
  },
  {
    key: 'authenticity',
    icon: 'shield',
    title: 'Guaranteed Authenticity',
    description: 'Every piece is sourced directly and certified genuine.',
  },
  {
    key: 'service',
    icon: 'user',
    title: 'Dedicated Service',
    description: 'Personal styling advice from our eyewear specialists.',
  },
  {
    key: 'exchange',
    icon: 'rotate-ccw',
    title: 'Easy Exchange',
    description: 'Seven-day exchange window, no questions asked.',
  },
];

export const PRODUCT_TRUST_BADGES: TrustBadge[] = [
  {
    key: 'shipping',
    icon: 'shipping',
    title: 'Fast Shipping',
    description: 'Dispatched within 24 hours',
  },
  {
    key: 'secure',
    icon: 'shield',
    title: 'Secure Payment',
    description: 'Encrypted checkout',
  },
  {
    key: 'exchange',
    icon: 'rotate-ccw',
    title: '7-Day Exchange',
    description: 'Hassle-free returns',
  },
];

export interface Testimonial {
  name: string;
  location: string;
  text: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Rahul Verma',
    location: 'Gurgaon',
    text: "I've owned a few premium eyewear brands before, but 19 Maison truly stands out. The craftsmanship is exceptional, and the design feels both modern and timeless. The frames are incredibly comfortable for all-day wear.",
  },
  {
    name: 'Karan Singh',
    location: 'Chandigarh',
    text: 'Absolutely love my frames from 19 Maison. The quality is top-notch, and the customer service was exceptional. Will definitely be ordering again soon!',
  },
  {
    name: 'Priya Mehta',
    location: 'Mumbai',
    text: 'You can tell this brand focuses on quality over everything else. Received multiple compliments already. Premium feel throughout the whole experience.',
  },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'What makes 19 Maison eyewear different?',
    a: 'At 19 Maison, we focus on refined design, premium materials, and timeless aesthetics. Each piece is crafted to balance modern minimalism with luxury, ensuring you wear something that feels as exceptional as it looks.',
  },
  {
    q: 'Are the frames suitable for everyday wear?',
    a: 'Yes, our frames are designed for daily wear with premium materials ensuring durability and comfort.',
  },
  {
    q: 'Do you offer prescription lenses?',
    a: 'Yes, we offer prescription lens fitting for all our frames at our stores.',
  },
  {
    q: 'What materials are used?',
    a: 'We use premium acetate, titanium, and gold-plated materials sourced from the finest manufacturers.',
  },
  {
    q: 'How should I care for my eyewear?',
    a: 'Clean with the provided microfiber cloth, store in the case when not in use, and avoid exposure to extreme heat.',
  },
  {
    q: 'Is 19 Maison eyewear unisex?',
    a: 'Many of our styles are unisex. We also have dedicated collections for men and women.',
  },
];
