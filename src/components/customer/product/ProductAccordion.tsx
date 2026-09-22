import { View } from 'react-native';
import { AccordionGroup } from '../ui/Accordion';
import { Text } from '../ui/Text';

// Only Description comes from the API; the rest are policy copy that is identical
// for every product, matching the web.
const STATIC_SECTIONS = [
  {
    key: 'authenticity',
    label: 'Authenticity & Warranty Information',
    body: 'All products are sourced directly from official brand distributors and come with a manufacturer warranty. Certificate of authenticity included.',
  },
  {
    key: 'care',
    label: 'Product Care',
    body: 'Clean lenses with the included microfiber cloth. Store in the provided case when not in use. Avoid prolonged exposure to heat or moisture.',
  },
  {
    key: 'shipping',
    label: 'Shipping & Returns Policy',
    body: 'Free shipping across India with tracked delivery. Returns and exchanges accepted within 7 days of delivery in original condition.',
  },
  {
    key: 'after-sales',
    label: 'After-Sales Service',
    body: 'Free frame adjustments and repairs at any of our flagship stores. Our dedicated service team is available Monday to Saturday, 10am to 7pm.',
  },
];

const DEFAULT_DESCRIPTION =
  'Premium luxury eyewear crafted with the finest materials. Each piece reflects meticulous attention to detail and timeless design.';

interface Props {
  description?: string;
}

export function ProductAccordion({ description }: Props) {
  const items = [
    {
      key: 'description',
      label: 'Description',
      content: <Text variant="bodyMuted">{description || DEFAULT_DESCRIPTION}</Text>,
    },
    ...STATIC_SECTIONS.map(section => ({
      key: section.key,
      label: section.label,
      content: <Text variant="bodyMuted">{section.body}</Text>,
    })),
  ];

  return (
    <View>
      <AccordionGroup items={items} defaultOpenKey="description" />
    </View>
  );
}
