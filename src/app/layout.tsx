import type { Metadata } from 'next';
import { Cormorant_Garamond } from 'next/font/google';
import Providers from '@/components/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ORPIND | Premium Organic Spices & Grains from Punjab',
    template: '%s | ORPIND',
  },
  description:
    'Discover authentic Punjabi spices and organic grains. Farm-fresh, handpicked, and traditionally crafted. Premium quality spices delivered to your doorstep across India.',
  keywords: [
    'organic spices', 'Punjabi spices', 'garam masala', 'basmati rice',
    'premium spices India', 'organic grains', 'Punjab spices',
    'buy spices online', 'wholesale spices', 'buy organic food online',
    'Punjabi masala', 'organic turmeric', 'best garam masala brand',
  ],
  authors: [{ name: 'ORPIND Foods Pvt. Ltd.' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://orpind.com',
    siteName: 'ORPIND',
    title: 'ORPIND | Premium Organic Spices & Grains from Punjab',
    description: 'Authentic Punjabi spices and organic grains. Farm-fresh, handpicked, traditionally crafted.',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'ORPIND - Premium Organic Spices' }],
  },
  twitter: { card: 'summary_large_image', title: 'ORPIND', description: 'Premium Organic Spices & Grains from Punjab', images: ['/og-image.svg'] },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://orpind.com' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cormorantGaramond.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="bg-beige-50 text-neutral-900 font-body antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
