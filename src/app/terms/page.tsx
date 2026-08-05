import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { siteConfig } from '@/data/products';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Orpind',
  description: `Read the terms and conditions governing your use of ${siteConfig.name} website and services.`,
};

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    content: [
      `By accessing and using the ${siteConfig.name} website (orpind.com) and its services, you accept and agree to be bound by these Terms of Service.`,
      `If you do not agree to these terms, please do not use our website or services. We reserve the right to modify these terms at any time, and your continued use of the website constitutes acceptance of any changes.`,
      `You must be at least 18 years of age to use our website and services. By using our website, you represent and warrant that you are at least 18 years old.`,
    ],
  },
  {
    id: 'use-of-website',
    title: 'Use of Website',
    content: [
      `You agree to use our website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website.`,
      `You may not use our website to send spam, chain letters, pyramid schemes, or other unsolicited communications.`,
      `You may not attempt to gain unauthorized access to our website, user accounts, computer systems, or networks connected to the website.`,
      `We reserve the right to terminate or restrict your access to our website at any time, without notice, for any reason.`,
    ],
  },
  {
    id: 'products-pricing',
    title: 'Products & Pricing',
    content: [
      `We strive to provide accurate descriptions and images of our products. However, we do not warrant that product descriptions, images, or other content on the website are accurate, complete, reliable, current, or error-free.`,
      `All prices displayed on the website are in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.`,
      `We reserve the right to change prices at any time without prior notice. However, price changes will not affect orders that have already been confirmed.`,
      `Product availability is subject to change without notice. We may discontinue any product at any time.`,
    ],
  },
  {
    id: 'orders-payment',
    title: 'Orders & Payment',
    content: [
      `By placing an order through our website, you are making an offer to purchase products subject to these Terms.`,
      `We reserve the right to accept or decline your order for any reason, including product unavailability, errors in product or pricing information, or errors in your order.`,
      `We accept payment via UPI, credit/debit cards, net banking, wallets, and cash on delivery (COD) for eligible orders.`,
      `For COD orders, full payment must be made at the time of delivery. Failure to pay may result in order cancellation and future COD restrictions.`,
      `All payments are processed through secure third-party payment gateways. We do not store your payment card details on our servers.`,
    ],
  },
  {
    id: 'shipping-delivery',
    title: 'Shipping & Delivery',
    content: [
      `We aim to dispatch all orders within 1-2 business days of receiving them. Delivery times may vary based on your location and the shipping method selected.`,
      `Standard delivery typically takes 3-5 business days across India. Express delivery (1-2 days) is available in select metro cities.`,
      `Free shipping is available on all orders above ₹999. A flat shipping fee of ₹49 applies to orders below this threshold.`,
      `Risk of loss and title for items purchased from our website pass to you upon delivery of the items to the carrier.`,
      `We are not responsible for delays caused by the shipping carrier, natural disasters, or other circumstances beyond our control.`,
    ],
  },
  {
    id: 'returns-refunds',
    title: 'Returns & Refunds',
    content: [
      `We offer a 7-day return policy for unopened and unused products in their original packaging.`,
      `To initiate a return, please contact our customer support team with your order number and reason for return.`,
      `Refunds will be processed within 5-7 business days after we receive and inspect the returned items.`,
      `Shipping costs are non-refundable unless the return is due to our error (wrong or damaged item).`,
      `Certain products, including opened spices and perishable items, may not be eligible for return due to hygiene and safety reasons.`,
    ],
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    content: [
      `All content on this website, including text, graphics, logos, images, product descriptions, audio clips, digital downloads, and software, is the property of ${siteConfig.name} or its content suppliers and is protected by Indian and international copyright laws.`,
      `The Orpind name, logo, and all related product names, design marks, and slogans are trademarks of ${siteConfig.name}.`,
      `You may not reproduce, duplicate, copy, sell, resell, or exploit any portion of the website without our express written consent.`,
      `You may not use any data mining, robots, spiders, or similar data gathering and extraction tools on the website.`,
    ],
  },
  {
    id: 'limitation-of-liability',
    title: 'Limitation of Liability',
    content: [
      `To the maximum extent permitted by applicable law, ${siteConfig.name} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the website or products.`,
      `Our total liability to you for all claims arising out of or relating to the use of or inability to use the website or products shall not exceed the amount paid by you, if any, for accessing or purchasing from the website during the twelve (12) months preceding the claim.`,
      `The products sold on our website are intended for culinary use. We are not liable for any allergic reactions or health issues arising from individual sensitivities to specific ingredients.`,
    ],
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    content: [
      `These Terms shall be governed by and construed in accordance with the laws of India.`,
      `Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in Phagwara, Punjab, India.`,
      `If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue to be valid and enforceable.`,
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    content: [
      `If you have any questions about these Terms of Service, please contact us at:`,
      `${siteConfig.name} Pvt. Ltd.`,
      `${siteConfig.address}`,
      `Email: ${siteConfig.email}`,
      `Phone: ${siteConfig.phone}`,
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-green-900 overflow-hidden">
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
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Terms of Service</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="heading-xl text-white mb-6">
              Terms of <span className="text-gold-400">Service</span>
            </h1>
            <p className="text-body-lg text-neutral-300">
              Please read these terms carefully before using our website or placing an order.
            </p>
            <p className="text-sm text-neutral-500 mt-4">Last Updated: March 15, 2024</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-[240px_1fr] gap-12 max-w-6xl mx-auto">
            {/* Table of Contents */}
            <nav className="hidden lg:block">
              <div className="sticky top-28">
                <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider mb-4">
                  Contents
                </h2>
                <div className="divider mb-6" />
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="text-sm text-neutral-500 hover:text-gold-600 transition-colors leading-relaxed block py-1"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            {/* Article */}
            <div className="max-w-3xl">
              <div className="mb-10">
                <p className="text-neutral-600 leading-relaxed">
                  Welcome to {siteConfig.name}. These Terms of Service govern your use of our
                  website located at orepind.com and any related services. By accessing or using
                  our website, you agree to be bound by these Terms.
                </p>
              </div>

              <div className="space-y-12">
                {sections.map((section, index) => (
                  <div key={section.id} id={section.id}>
                    <h2 className="heading-sm text-neutral-800 mb-4">
                      {index + 1}. {section.title}
                    </h2>
                    <div className="divider mb-6" />
                    <div className="space-y-4 text-neutral-600 leading-relaxed">
                      {section.content.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
