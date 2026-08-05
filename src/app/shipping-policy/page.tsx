import Link from 'next/link';
import { ChevronRight, Truck, Globe, AlertTriangle, ArrowRight } from 'lucide-react';
import { siteConfig, whatsappNumber } from '@/data/products';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | Orpind',
  description: `Learn about ${siteConfig.name}'s shipping coverage, rates, delivery times, and order tracking options.`,
};

const shippingRates = [
  { region: 'Punjab, Haryana, Chandigarh', rate: '₹49', delivery: '2-3 business days', freeAbove: '₹999' },
  { region: 'Delhi NCR', rate: '₹49', delivery: '2-3 business days', freeAbove: '₹999' },
  { region: 'North India (UP, HP, J&K, UK)', rate: '₹49', delivery: '3-4 business days', freeAbove: '₹999' },
  { region: 'West India (Rajasthan, Gujarat, Maharashtra)', rate: '₹49', delivery: '3-5 business days', freeAbove: '₹999' },
  { region: 'South India (Karnataka, Tamil Nadu, Kerala, AP)', rate: '₹49', delivery: '4-5 business days', freeAbove: '₹999' },
  { region: 'East India (West Bengal, Odisha, Bihar, Jharkhand)', rate: '₹49', delivery: '4-6 business days', freeAbove: '₹999' },
  { region: 'North-East India (Assam, Meghalaya, etc.)', rate: '₹99', delivery: '5-7 business days', freeAbove: '₹1499' },
];

const deliveryEstimates = [
  { type: 'Standard Delivery', timeframe: '3-5 business days', description: 'Available across India. Free on orders above ₹999.' },
  { type: 'Express Delivery', timeframe: '1-2 business days', description: 'Available in select metro cities (Delhi, Mumbai, Bangalore, Chandigarh, Hyderabad).' },
  { type: 'Same-Day Delivery', timeframe: 'Within 6 hours', description: 'Coming soon to Chandigarh and Phagwara areas.' },
];

export default function ShippingPolicyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-green-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(215, 104, 31, 0.4) 0%, transparent 50%)`,
            }}
          />
        </div>
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Shipping Policy</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="heading-xl text-white mb-6">
              Shipping <span className="text-gold-400">Policy</span>
            </h1>
            <p className="text-body-lg text-neutral-300">
              We ship our products with care across India. Learn about our shipping coverage,
              rates, and delivery timelines.
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Coverage */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: 'Pan-India Shipping',
                description: 'We deliver to all serviceable pin codes across India through our trusted logistics partners.',
              },
              {
                icon: Globe,
                title: 'Secure Packaging',
                description: 'Every order is packed with eco-friendly materials to ensure your spices arrive fresh and intact.',
              },
              {
                icon: AlertTriangle,
                title: 'Order Tracking',
                description: 'Track your order in real-time via SMS, email, or your Orpind account dashboard.',
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 bg-neutral-50 rounded-sm border border-neutral-100">
                <div className="w-12 h-12 mx-auto mb-4 bg-gold-50 rounded-full flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-gold-600" />
                </div>
                <h3 className="font-display font-semibold text-neutral-800 mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Rates Table */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm text-gold-600 font-medium uppercase tracking-widest mb-3">
              Transparent Pricing
            </p>
            <h2 className="heading-lg text-neutral-800 mb-4">Shipping Rates & Delivery Estimates</h2>
            <div className="divider-center" />
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-sm border border-neutral-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-green-900 text-white">
                  <th className="text-left px-6 py-4 text-sm font-semibold">Region</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Shipping Rate</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Delivery Time</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Free Shipping Above</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {shippingRates.map((row, index) => (
                  <tr key={row.region} className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}>
                    <td className="px-6 py-4 text-sm font-medium text-neutral-800">{row.region}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{row.rate}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{row.delivery}</td>
                    <td className="px-6 py-4 text-sm text-gold-600 font-medium">{row.freeAbove}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {shippingRates.map((row) => (
              <div key={row.region} className="bg-white p-4 rounded-sm border border-neutral-100">
                <h3 className="font-semibold text-neutral-800 text-sm mb-3">{row.region}</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-neutral-400 text-xs mb-1">Rate</p>
                    <p className="text-neutral-700 font-medium">{row.rate}</p>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-xs mb-1">Delivery</p>
                    <p className="text-neutral-700">{row.delivery}</p>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-xs mb-1">Free Above</p>
                    <p className="text-gold-600 font-medium">{row.freeAbove}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Shipping */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm text-gold-600 font-medium uppercase tracking-widest mb-3">
              Save on Shipping
            </p>
            <h2 className="heading-lg text-neutral-800 mb-4">Free Shipping</h2>
            <div className="divider-center" />
          </div>

          <div className="bg-gold-50 border border-gold-200 rounded-sm p-8 text-center">
            <div className="text-5xl font-display font-bold text-gold-600 mb-3">₹999</div>
            <p className="text-lg text-neutral-700 font-medium mb-2">
              Free shipping on all orders above ₹999
            </p>
            <p className="text-sm text-neutral-500 max-w-lg mx-auto">
              For orders below ₹999, a flat shipping fee of ₹49 applies (₹99 for North-East
              India). No hidden charges — what you see is what you pay.
            </p>
          </div>
        </div>
      </section>

      {/* Delivery Estimates */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm text-gold-600 font-medium uppercase tracking-widest mb-3">
              Delivery Options
            </p>
            <h2 className="heading-lg text-neutral-800 mb-4">Delivery Estimates</h2>
            <div className="divider-center" />
          </div>

          <div className="space-y-4">
            {deliveryEstimates.map((option) => (
              <div
                key={option.type}
                className="bg-white p-6 rounded-sm border border-neutral-100 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-neutral-800 mb-1">{option.type}</h3>
                  <p className="text-sm text-neutral-500">{option.description}</p>
                </div>
                <div className="sm:text-right flex-shrink-0">
                  <p className="text-lg font-display font-bold text-gold-600">{option.timeframe}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Tracking */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm text-gold-600 font-medium uppercase tracking-widest mb-3">
                Stay Updated
              </p>
              <h2 className="heading-md text-neutral-800 mb-4">Order Tracking</h2>
              <div className="divider mb-6" />
              <div className="space-y-4 text-neutral-600 text-sm leading-relaxed">
                <p>
                  Once your order is dispatched, you will receive a tracking link via SMS and
                  email. You can also track your order from your{' '}
                  <Link href="/account" className="text-gold-600 hover:text-gold-700 font-medium underline">
                    account dashboard
                  </Link>
                  .
                </p>
                <p>
                  Our logistics partners provide real-time tracking updates so you know exactly
                  when to expect your delivery.
                </p>
                <p>
                  If you face any issues with tracking or delivery, our support team is just a
                  message away.
                </p>
              </div>
            </div>
            <div className="bg-neutral-50 p-8 rounded-sm border border-neutral-100">
              <h3 className="font-display font-semibold text-neutral-800 mb-4">Tracking Steps</h3>
              <div className="space-y-4">
                {[
                  { label: 'Order Confirmed', detail: 'We have received your order' },
                  { label: 'Processing', detail: 'Your items are being prepared' },
                  { label: 'Shipped', detail: 'Package is on its way to you' },
                  { label: 'Out for Delivery', detail: 'Your order will arrive today' },
                  { label: 'Delivered', detail: 'Package has been delivered' },
                ].map((step, index) => (
                  <div key={step.label} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{step.label}</p>
                      <p className="text-xs text-neutral-400">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* International Shipping */}
      <section className="section-padding bg-green-900 texture-overlay">
        <div className="container-custom mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Globe className="w-12 h-12 text-gold-400 mx-auto mb-4" />
            <p className="text-sm text-gold-400 font-medium uppercase tracking-widest mb-3">
              Coming Soon
            </p>
            <h2 className="heading-md text-white mb-4">International Shipping</h2>
            <p className="text-neutral-300 mb-6">
              We are working hard to bring Orpind&apos;s authentic Punjabi spices to spice lovers
              worldwide. International shipping for NRI customers is launching soon.
            </p>
            <p className="text-sm text-neutral-500">
              Subscribe to our newsletter to be the first to know when we go global.
            </p>
          </div>
        </div>
      </section>

      {/* Damaged in Transit */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm text-gold-600 font-medium uppercase tracking-widest mb-3">
              We&apos;ve Got You Covered
            </p>
            <h2 className="heading-lg text-neutral-800 mb-4">Damaged in Transit?</h2>
            <div className="divider-center" />
          </div>

          <div className="max-w-2xl mx-auto space-y-4 text-neutral-600 leading-relaxed">
            <p>
              While we take every precaution to ensure your order arrives safely, damages can
              occasionally occur during transit. If your package arrives damaged:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Take clear photos of the damaged packaging and items.</li>
              <li>Contact us within 48 hours of delivery with your order number.</li>
              <li>We will arrange a free pickup and either reship or refund your order.</li>
            </ol>
            <p>
              Please do not discard the damaged items or packaging until instructed by our
              support team, as we may need them for investigation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gold-600 text-center">
        <div className="container-custom mx-auto">
          <h2 className="heading-md text-white mb-4">Questions About Shipping?</h2>
          <p className="text-lg text-gold-100 mb-8 max-w-xl mx-auto">
            Our team is here to help with any shipping questions or concerns about your order.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gold-700 font-semibold rounded-sm hover:bg-beige-100 transition-colors group">
              Contact Us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={`https://wa.me/${whatsappNumber.replace('+', '')}?text=Hi, I have a question about shipping.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white text-white font-medium rounded-sm hover:bg-white/10 transition-colors"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
