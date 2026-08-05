import Link from 'next/link';
import { ChevronRight, ArrowRight, CheckCircle, Clock, AlertCircle, RefreshCw, Package, XCircle } from 'lucide-react';
import { siteConfig, whatsappNumber } from '@/data/products';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Return Policy | Orpind',
  description: `Learn about ${siteConfig.name}'s return and refund policy for orders.`,
};

const returnSteps = [
  {
    step: '1',
    title: 'Contact Us',
    description: 'Reach out to our customer support within 7 days of delivery via email or WhatsApp with your order number.',
  },
  {
    step: '2',
    title: 'Get Approval',
    description: 'Our team will review your request and provide return instructions and a return authorization number.',
  },
  {
    step: '3',
    title: 'Pack & Ship',
    description: 'Pack the items securely in original packaging and ship them to the address provided.',
  },
  {
    step: '4',
    title: 'Receive Refund',
    description: 'Once we receive and inspect the items, your refund will be processed within 5-7 business days.',
  },
];

const nonReturnableItems = [
  'Opened or used spice packets',
  'Perishable goods (fresh herbs, fresh grains)',
  'Gift cards and digital products',
  'Free promotional items',
  'Items purchased during clearance sales',
  'Custom or personalized orders',
];

export default function ReturnsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-green-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 50%, rgba(215, 104, 31, 0.4) 0%, transparent 50%)`,
            }}
          />
        </div>
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Return Policy</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="heading-xl text-white mb-6">
              Return <span className="text-gold-400">Policy</span>
            </h1>
            <p className="text-body-lg text-neutral-300">
              We want you to be completely satisfied with your purchase. If you&apos;re not happy,
              we&apos;re here to help with hassle-free returns.
            </p>
          </div>
        </div>
      </section>

      {/* Return Eligibility */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm text-gold-600 font-medium uppercase tracking-widest mb-3">
              Eligibility
            </p>
            <h2 className="heading-lg text-neutral-800 mb-4">Return Eligibility</h2>
            <div className="divider-center" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-green-50 rounded-sm border border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="font-display font-semibold text-neutral-800">Eligible for Return</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Unopened and unused products',
                  'Items in original sealed packaging',
                  'Wrong items delivered',
                  'Damaged or defective products',
                  'Items returned within 7 days of delivery',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-red-50 rounded-sm border border-red-100">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-6 h-6 text-red-500" />
                <h3 className="font-display font-semibold text-neutral-800">Not Eligible</h3>
              </div>
              <ul className="space-y-3">
                {nonReturnableItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                    <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How to Initiate */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm text-gold-600 font-medium uppercase tracking-widest mb-3">
              Simple Process
            </p>
            <h2 className="heading-lg text-neutral-800 mb-4">How to Initiate a Return</h2>
            <div className="divider-center" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {returnSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-gold-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-display font-bold">{step.step}</span>
                </div>
                <h3 className="font-display font-semibold text-neutral-800 mb-2">{step.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund + Exchange */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Refund Process */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gold-50 rounded-sm flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-gold-600" />
                </div>
                <h2 className="heading-sm text-neutral-800">Refund Process</h2>
              </div>
              <div className="space-y-4 text-neutral-600 text-sm leading-relaxed">
                <p>
                  Once we receive your returned items, our quality team will inspect them within
                  2 business days.
                </p>
                <p>
                  If approved, refunds will be credited to your original payment method within
                  5-7 business days. For COD orders, refunds will be made via bank transfer or
                  store credit.
                </p>
                <p>
                  You will receive an email notification once your refund has been processed.
                  Please note that shipping charges are non-refundable unless the return is due
                  to our error.
                </p>
              </div>
            </div>

            {/* Exchange Policy */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gold-50 rounded-sm flex items-center justify-center">
                  <Package className="w-5 h-5 text-gold-600" />
                </div>
                <h2 className="heading-sm text-neutral-800">Exchange Policy</h2>
              </div>
              <div className="space-y-4 text-neutral-600 text-sm leading-relaxed">
                <p>
                  We offer exchanges for items of equal or lesser value. If you&apos;d like a
                  different product, let us know when you contact us for the return.
                </p>
                <p>
                  Exchanges are subject to product availability. If the desired replacement item
                  is out of stock, we will process a refund instead.
                </p>
                <p>
                  For exchanges involving a higher-value item, you will be charged the
                  difference. For lower-value items, the difference will be refunded.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Damaged / Wrong Items */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-sm border border-neutral-100">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-gold-600" />
                <h3 className="font-display font-semibold text-neutral-800">Damaged in Transit</h3>
              </div>
              <div className="space-y-3 text-sm text-neutral-600 leading-relaxed">
                <p>
                  If your order arrives damaged, please contact us immediately with photos of
                  the damaged items and packaging.
                </p>
                <p>
                  We will arrange a free pickup and send a replacement or issue a full refund,
                  including shipping charges.
                </p>
                <p>
                  Please report damaged items within 48 hours of delivery for the fastest
                  resolution.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-sm border border-neutral-100">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-6 h-6 text-gold-600" />
                <h3 className="font-display font-semibold text-neutral-800">Wrong Item Received</h3>
              </div>
              <div className="space-y-3 text-sm text-neutral-600 leading-relaxed">
                <p>
                  If you received the wrong product, we sincerely apologize. Please contact us
                  with your order number and a description of the issue.
                </p>
                <p>
                  We will arrange a free pickup of the incorrect item and ship the correct
                  product to you at no additional cost.
                </p>
                <p>
                  In cases where the correct item is unavailable, we will issue a full refund.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Return Timeline */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm text-gold-600 font-medium uppercase tracking-widest mb-3">
              Timeline
            </p>
            <h2 className="heading-lg text-neutral-800 mb-4">Return Timeline</h2>
            <div className="divider-center" />
          </div>

          <div className="bg-white rounded-sm border border-neutral-100 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
              {[
                {
                  icon: Clock,
                  title: 'Report Within',
                  value: '7 Days',
                  detail: 'Contact us within 7 days of delivery',
                },
                {
                  icon: Package,
                  title: 'Ship Within',
                  value: '5 Days',
                  detail: 'Ship items within 5 days of return approval',
                },
                {
                  icon: RefreshCw,
                  title: 'Refund In',
                  value: '5-7 Days',
                  detail: 'Refund processed after inspection',
                },
              ].map((item) => (
                <div key={item.title} className="p-8 text-center">
                  <item.icon className="w-8 h-8 text-gold-500 mx-auto mb-3" />
                  <p className="text-sm text-neutral-500 mb-1">{item.title}</p>
                  <p className="text-2xl font-display font-bold text-neutral-800 mb-2">{item.value}</p>
                  <p className="text-xs text-neutral-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gold-600 text-center">
        <div className="container-custom mx-auto">
          <h2 className="heading-md text-white mb-4">Need to Start a Return?</h2>
          <p className="text-lg text-gold-100 mb-8 max-w-xl mx-auto">
            Our customer support team is ready to help you with returns, exchanges, or any
            questions about your order.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/${whatsappNumber.replace('+', '')}?text=Hi, I need help with a return for my order.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gold-700 font-semibold rounded-sm hover:bg-beige-100 transition-colors group"
            >
              Contact Support
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white text-white font-medium rounded-sm hover:bg-white/10 transition-colors">
              Visit Contact Page
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
