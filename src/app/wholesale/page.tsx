import Link from 'next/link';
import { ChevronRight, ArrowRight, Truck, Package, Building2, Phone } from 'lucide-react';
import { whatsappNumber } from '@/data/products';

const benefits = [
  {
    icon: Package,
    title: 'Bulk Pricing',
    description: 'Competitive wholesale rates with volume discounts starting from 10kg orders.',
  },
  {
    icon: Truck,
    title: 'Pan-India Delivery',
    description: 'Reliable logistics network ensuring timely delivery across all states.',
  },
  {
    icon: Building2,
    title: 'White Label Options',
    description: 'Custom branding and packaging for restaurants and businesses.',
  },
  {
    icon: Phone,
    title: 'Dedicated Support',
    description: 'Personal account manager for all wholesale partners.',
  },
];

const tiers = [
  {
    name: 'Retail',
    minOrder: 'No minimum',
    discount: 'Standard pricing',
    features: ['Access to all products', 'Free shipping above ₹999', 'Standard packaging', 'Online support'],
  },
  {
    name: 'Wholesale',
    minOrder: '10 kg+',
    discount: '15-25% off',
    features: ['Volume discounts', 'Priority shipping', 'Bulk packaging', 'Dedicated support', 'Payment terms available'],
    popular: true,
  },
  {
    name: 'Enterprise',
    minOrder: '100 kg+',
    discount: 'Custom pricing',
    features: ['Custom pricing', 'White label options', 'Custom blends', 'API integration', 'Credit facilities', 'Account manager'],
  },
];

export default function WholesalePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-green-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 70% 50%, rgba(215, 104, 31, 0.4) 0%, transparent 50%)`,
            }}
          />
        </div>
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Wholesale</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="heading-xl text-white mb-6">
              Wholesale <span className="text-gold-400">Partnerships</span>
            </h1>
            <p className="text-body-lg text-neutral-300 mb-8">
              Partner with Orpind for premium organic spices at wholesale rates. 
              Perfect for restaurants, caterers, retailers, and distributors.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber.replace('+', '')}?text=Hi, I'm interested in wholesale partnership with Orpind.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary group"
            >
              Get Wholesale Quote
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-gold-600 font-medium uppercase tracking-widest mb-3">
              Why Partner With Us
            </p>
            <h2 className="heading-lg text-neutral-800 mb-4">Wholesale Benefits</h2>
            <div className="divider-center" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="p-6 bg-neutral-50 rounded-sm border border-neutral-100">
                <div className="w-12 h-12 bg-gold-50 rounded-sm flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-gold-600" />
                </div>
                <h3 className="font-display font-semibold text-neutral-800 mb-2">{benefit.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-gold-600 font-medium uppercase tracking-widest mb-3">
              Pricing Plans
            </p>
            <h2 className="heading-lg text-neutral-800 mb-4">Choose Your Tier</h2>
            <div className="divider-center" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative bg-white rounded-sm p-8 border ${
                  tier.popular
                    ? 'border-gold-500 shadow-xl shadow-gold-500/10'
                    : 'border-neutral-100'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge bg-gold-500 text-white px-4 py-1">Most Popular</span>
                  </div>
                )}
                <h3 className="text-xl font-display font-bold text-neutral-800 mb-2">{tier.name}</h3>
                <p className="text-sm text-gold-600 font-semibold mb-1">{tier.discount}</p>
                <p className="text-sm text-neutral-500 mb-6">Min. order: {tier.minOrder}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-neutral-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={`https://wa.me/${whatsappNumber.replace('+', '')}?text=Hi, I'm interested in the ${tier.name} plan.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={tier.popular ? 'btn-primary w-full text-center' : 'btn-outline w-full text-center'}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ideal For */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="heading-lg text-neutral-800 mb-4">Ideal For</h2>
            <div className="divider-center" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { emoji: '🍽️', label: 'Restaurants' },
              { emoji: '🏪', label: 'Retail Stores' },
              { emoji: '🏨', label: 'Hotels & Resorts' },
              { emoji: '📦', label: 'Distributors' },
              { emoji: '🎂', label: 'Caterers' },
              { emoji: '🛒', label: 'Online Sellers' },
              { emoji: '🏭', label: 'Food Manufacturers' },
              { emoji: '✈️', label: 'Exporters' },
            ].map((item) => (
              <div key={item.label} className="text-center p-6 bg-neutral-50 rounded-sm border border-neutral-100">
                <span className="text-4xl mb-3 block">{item.emoji}</span>
                <p className="font-medium text-neutral-800">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
