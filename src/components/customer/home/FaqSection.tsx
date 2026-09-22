import { Text } from '../ui/Text';
import { AccordionGroup } from '../ui/Accordion';
import { Section } from '../layout/Section';
import { FAQ_ITEMS } from './constants';
import type { FaqItem } from './constants';

interface Props {
  items?: FaqItem[];
  title?: string;
}

export function FaqSection({ items = FAQ_ITEMS, title = 'Commonly asked questions' }: Props) {
  if (items.length === 0) return null;

  return (
    <Section>
      <Text variant="sectionHeading">{title}</Text>
      <AccordionGroup
        items={items.map(item => ({
          key: item.q,
          label: item.q,
          content: <Text variant="bodyMuted">{item.a}</Text>,
        }))}
      />
    </Section>
  );
}
