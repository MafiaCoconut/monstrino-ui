import type { DetailSeoLink } from '../DetailSeoContent';
import type { BreadcrumbItem } from './breadcrumbSchema';
import { buildBreadcrumbSchema } from './breadcrumbSchema';
import { serializeJsonLd } from '../jsonld';

// ─── Generic JSON-LD renderer ─────────────────────────────────────────────────

export function JsonLd({ schema }: { schema: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  return <JsonLd schema={buildBreadcrumbSchema(items)} />;
}

// ─── Legacy typed components (kept for backward compat) ───────────────────────

type BaseStructuredDataProps = {
  name: string;
  description?: string;
  url: string;
  relatedLinks?: DetailSeoLink[];
};

type ProductStructuredDataProps = BaseStructuredDataProps;
type PersonStructuredDataProps = BaseStructuredDataProps;
type CreativeWorkStructuredDataProps = BaseStructuredDataProps;

function createStructuredData(
  type: 'Product' | 'Person' | 'CreativeWorkSeries',
  props: BaseStructuredDataProps
) {
  const { name, description, url, relatedLinks } = props;
  
  return {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description: description || undefined,
    url,
    ...(relatedLinks && relatedLinks.length > 0
      ? {
          isRelatedTo: relatedLinks.map((link) => ({
            '@type': 'Thing',
            name: link.label,
            url: link.href.startsWith('http')
              ? link.href
              : `${url.split('/').slice(0, 3).join('/')}${link.href}`,
          })),
        }
      : {}),
  };
}

export function ProductStructuredData(props: ProductStructuredDataProps) {
  const structuredData = createStructuredData('Product', props);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
    />
  );
}

export function CharacterStructuredData(props: PersonStructuredDataProps) {
  const structuredData = createStructuredData('Person', props);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
    />
  );
}

export function SeriesStructuredData(props: CreativeWorkStructuredDataProps) {
  const structuredData = createStructuredData('CreativeWorkSeries', props);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
    />
  );
}
