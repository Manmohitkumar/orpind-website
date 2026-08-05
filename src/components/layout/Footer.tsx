import Link from 'next/link';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import Newsletter from '@/components/ui/Newsletter';

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'Whole Spices', href: '/shop?category=whole-spices' },
    { label: 'Ground Spices', href: '/shop?category=ground-spices' },
    { label: 'Spice Blends', href: '/shop?category=spice-blends' },
    { label: 'Grains & Flours', href: '/shop?category=grains' },
    { label: 'Gift Sets', href: '/shop?category=gift-sets' },
  ],
  learn: [
    { label: 'Our Story', href: '/about' },
    { label: 'Our Farmers', href: '/about#farmers' },
    { label: 'Sustainability', href: '/about#sustainability' },
    { label: 'Blog', href: '/blog' },
    { label: 'Recipes', href: '/blog?category=recipes' },
    { label: 'Careers', href: '/careers' },
  ],
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping & Delivery', href: '/shipping-policy' },
    { label: 'Returns & Refunds', href: '/returns' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Track Order', href: '/account' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/orpind' },
  { icon: Facebook, href: 'https://facebook.com/orpind' },
  { icon: Twitter, href: 'https://twitter.com/orpind' },
  { icon: Youtube, href: 'https://youtube.com/@orpind' },
];

export default function Footer() {
  return (
    <footer className="bg-green-800 text-beige-300">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div>
                <h2 className="text-2xl font-display font-bold tracking-wider text-white">
                  ORPIND<span className="text-gold-500">.</span>
                </h2>
                <p className="text-xs tracking-widest uppercase text-beige-500">
                  Organic Spices &amp; Grains
                </p>
              </div>
            </Link>
            <p className="text-beige-400 mb-6 max-w-sm leading-relaxed">
              Bringing the authentic flavors of Punjab to your kitchen. Farm-fresh, organic spices and grains sourced directly from the fertile fields of India.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>Phagwara, Punjab, India - 144401</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>+91 62833 48561</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>mohitchetiwal291@gmail.com</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-beige-300 hover:bg-gold-500 hover:text-white transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-display font-semibold uppercase tracking-wider text-sm mb-6">
              Stay Updated
            </h4>
            <p className="text-sm text-beige-400 mb-4">Get recipes, tips & exclusive offers.</p>
            <Newsletter variant="inline" />
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-display font-semibold uppercase tracking-wider text-sm mb-6">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-beige-300 hover:text-gold-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-green-700/50">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-beige-400">
              &copy; {new Date().getFullYear()} Orpind. All rights reserved. Made with love in Punjab.
            </p>
            <div className="flex items-center gap-6 text-sm text-beige-400">
              <div className="flex items-center gap-3">
                <span>Visa</span>
                <span>Mastercard</span>
                <span>UPI</span>
                <span>COD</span>
              </div>
              <Link href="/privacy" className="hover:text-gold-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gold-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
