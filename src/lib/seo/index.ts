import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://orpind.com';
const SITE_NAME = 'Orpind';
const DEFAULT_DESCRIPTION = 'Premium organic spices and grains from Punjab, India. Farm-fresh turmeric, chilli, coriander, cumin, and traditional Punjabi spice blends delivered to your door.';

// ─── Generate Product Metadata ───────────────────────
export function generateProductMetadata(product: {
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category?: string;
}): Metadata {
  const title = `${product.name} | Orpind - Premium Organic Spices`;
  const description = product.description.slice(0, 160).replace(/<[^>]*>/g, '');
  const imageUrl = product.images[0] ? `${SITE_URL}${product.images[0]}` : `${SITE_URL}/og-default.jpg`;

  return {
    title,
    description,
    keywords: [product.name, 'organic', 'spices', 'Punjab', 'India', product.category || ''].filter(Boolean),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/products/${product.slug}`,
      siteName: SITE_NAME,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: product.name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${SITE_URL}/products/${product.slug}`,
    },
  };
}

// ─── Generate Category Metadata ──────────────────────
export function generateCategoryMetadata(category: {
  name: string;
  slug: string;
  description?: string;
}): Metadata {
  const title = `${category.name} | Orpind Organic Spices`;
  const description = category.description || `Shop ${category.name} from Orpind. Premium organic spices from Punjab, India.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/category/${category.slug}`,
      siteName: SITE_NAME,
      type: 'website',
    },
    alternates: {
      canonical: `${SITE_URL}/category/${category.slug}`,
    },
  };
}

// ─── Generate Blog Post Metadata ─────────────────────
export function generateBlogMetadata(post: {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  author?: string;
  featuredImage?: string;
}): Metadata {
  const title = `${post.title} | Orpind Blog`;
  const imageUrl = post.featuredImage ? `${SITE_URL}${post.featuredImage}` : `${SITE_URL}/og-blog.jpg`;

  return {
    title,
    description: post.excerpt.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: SITE_NAME,
      publishedTime: post.publishedAt,
      authors: [post.author || 'Orpind Team'],
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
  };
}

// ─── Generate Static Pages Metadata ──────────────────
export function generateStaticMetadata(page: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title: `${page.title} | Orpind`,
    description: page.description,
    openGraph: {
      title: `${page.title} | Orpind`,
      description: page.description,
      url: `${SITE_URL}${page.path}`,
      siteName: SITE_NAME,
      type: 'website',
    },
    alternates: {
      canonical: `${SITE_URL}${page.path}`,
    },
  };
}

// ─── Schema.org Structured Data ──────────────────────
export interface ProductSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image: string[];
  brand: { '@type': string; name: string };
  offers: {
    '@type': string;
    priceCurrency: string;
    price: number;
    availability: string;
    seller: { '@type': string; name: string };
  };
  aggregateRating?: {
    '@type': string;
    ratingValue: number;
    reviewCount: number;
  };
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  price: number;
  images: string[];
  rating?: { value: number; count: number };
}): ProductSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map(img => `${SITE_URL}${img}`),
    brand: { '@type': 'Brand', name: 'Orpind' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Orpind Foods Pvt. Ltd.' },
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.value,
        reviewCount: product.rating.count,
      },
    }),
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Orpind Foods Pvt. Ltd.',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Premium organic spices and grains from Punjab, India',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'GT Road, Phagwara',
      addressRegion: 'Punjab',
      postalCode: '144401',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-62833-48561',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi', 'Punjabi'],
    },
    sameAs: [
      'https://www.instagram.com/orpind',
      'https://www.facebook.com/orpind',
      'https://twitter.com/orpind',
    ],
  };
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'GroceryStore',
    name: 'Orpind',
    image: `${SITE_URL}/storefront.jpg`,
    url: SITE_URL,
    telephone: '+91-62833-48561',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'GT Road, Near Bus Stand',
      addressLocality: 'Phagwara',
      addressRegion: 'Punjab',
      postalCode: '144401',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.2186,
      longitude: 75.7700,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '20:00',
      },
    ],
    priceRange: '₹₹',
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
