import { Metadata } from 'next'

// Base metadata for the application
export const baseMetadata: Metadata = {
  title: {
    default: 'SellX - Buy & Sell Products Online',
    template: '%s | SellX'
  },
  description: 'Discover amazing products at great prices. Buy and sell electronics, fashion, home goods, and more on SellX - India\'s trusted marketplace.',
  keywords: ['buy', 'sell', 'marketplace', 'electronics', 'fashion', 'home', 'india', 'online shopping'],
  authors: [{ name: 'SellX Team' }],
  creator: 'SellX',
  publisher: 'SellX',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    title: 'SellX - Buy & Sell Products Online',
    description: 'Discover amazing products at great prices. Buy and sell electronics, fashion, home goods, and more on SellX.',
    siteName: 'SellX',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SellX - Online Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SellX - Buy & Sell Products Online',
    description: 'Discover amazing products at great prices on SellX.',
    images: ['/og-image.jpg'],
    creator: '@sellx',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

// Generate metadata for product pages
export function generateProductMetadata(product: {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  condition: string
  city: string
  state: string
  createdAt: string
}): Metadata {
  const productUrl = `${process.env.NEXT_PUBLIC_APP_URL}/product/${product.id}`
  const imageUrl = product.images?.[0] || '/product-placeholder.jpg'

  return {
    title: `${product.title} - ₹${product.price.toLocaleString('en-IN')} | SellX`,
    description: `${product.description.substring(0, 160)}... Condition: ${product.condition}. Location: ${product.city}, ${product.state}.`,
    keywords: [
      product.title,
      'buy',
      'sell',
      product.condition,
      product.city,
      product.state,
      'marketplace',
      'india'
    ],
    openGraph: {
      type: 'website',
      url: productUrl,
      title: `${product.title} - ₹${product.price.toLocaleString('en-IN')}`,
      description: product.description.substring(0, 200),
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
      siteName: 'SellX',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} - ₹${product.price.toLocaleString('en-IN')}`,
      description: product.description.substring(0, 200),
      images: [imageUrl],
    },
    alternates: {
      canonical: productUrl,
    },
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': 'INR',
      'product:condition': product.condition.toLowerCase(),
      'product:availability': 'in stock',
      'article:published_time': product.createdAt,
      'article:modified_time': product.createdAt,
    },
  }
}

// Generate metadata for category pages
export function generateCategoryMetadata(category: {
  name: string
  description?: string
}): Metadata {
  const categoryUrl = `${process.env.NEXT_PUBLIC_APP_URL}/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`

  return {
    title: `${category.name} - Buy & Sell Online | SellX`,
    description: category.description || `Browse ${category.name} products. Buy and sell ${category.name.toLowerCase()} online at great prices on SellX.`,
    keywords: [category.name, 'buy', 'sell', 'online', 'marketplace', 'india'],
    openGraph: {
      type: 'website',
      url: categoryUrl,
      title: `${category.name} - Buy & Sell Online`,
      description: `Browse ${category.name} products on SellX.`,
      siteName: 'SellX',
    },
    alternates: {
      canonical: categoryUrl,
    },
  }
}

// Generate metadata for user profile pages
export function generateProfileMetadata(user: {
  name: string
  bio?: string
}): Metadata {
  return {
    title: `${user.name} - Seller Profile | SellX`,
    description: user.bio || `${user.name} is a trusted seller on SellX. Browse their products and listings.`,
    openGraph: {
      type: 'profile',
      title: `${user.name} - Seller Profile`,
      description: user.bio || `${user.name} is selling products on SellX.`,
    },
  }
}

// Structured data generators
export function generateProductStructuredData(product: {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  condition: string
  city: string
  state: string
  createdAt: string
  seller: {
    name: string
    phone?: string
  }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      condition: `https://schema.org/${product.condition === 'New' ? 'NewCondition' : 'UsedCondition'}`,
      seller: {
        '@type': 'Person',
        name: product.seller.name,
        telephone: product.seller.phone,
      },
      areaServed: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: product.city,
          addressRegion: product.state,
          addressCountry: 'IN',
        },
      },
    },
    datePublished: product.createdAt,
    brand: {
      '@type': 'Brand',
      name: 'SellX',
    },
  }
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SellX',
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    description: 'India\'s trusted online marketplace for buying and selling products.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-XXXXXXXXXX',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
    sameAs: [
      'https://www.facebook.com/sellx',
      'https://www.twitter.com/sellx',
      'https://www.instagram.com/sellx',
    ],
  }
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SellX',
    url: process.env.NEXT_PUBLIC_APP_URL,
    description: 'Buy and sell products online in India',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${process.env.NEXT_PUBLIC_APP_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}