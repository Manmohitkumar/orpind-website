import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { siteConfig } from '@/data/products';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Orpind',
  description: `Learn how ${siteConfig.name} collects, uses, and protects your personal information.`,
};

const sections = [
  {
    id: 'information-collection',
    title: 'Information Collection',
    content: [
      'We collect personal information you provide directly to us, such as when you create an account, make a purchase, subscribe to our newsletter, or contact us.',
      'This information may include your name, email address, phone number, shipping address, billing address, and payment information.',
      'We automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, pages viewed, and the time and date of your visit.',
      'We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookies through your browser settings.',
    ],
  },
  {
    id: 'use-of-information',
    title: 'Use of Information',
    content: [
      'We use the information we collect to process and fulfill your orders, including sending you order confirmations, shipping notifications, and delivery updates.',
      'To communicate with you about products, services, promotions, and events, and to provide other news or information about ${siteConfig.name} that may be of interest to you.',
      'To improve our website, products, and services, and to better understand how users access and use our offerings.',
      'To detect, investigate, and prevent fraudulent transactions and other illegal activities, and to protect the rights and property of ${siteConfig.name} and others.',
    ],
  },
  {
    id: 'data-sharing',
    title: 'Data Sharing',
    content: [
      'We may share your personal information with third-party service providers who perform services on our behalf, such as payment processing, order fulfillment, shipping, data analysis, email delivery, and customer service.',
      'We may share your information with our business partners for marketing purposes, only with your consent.',
      'We may disclose your information if required to do so by law or in response to valid requests by public authorities.',
      'In the event of a merger, acquisition, or sale of all or a portion of our assets, your personal information may be transferred as part of that transaction.',
    ],
  },
  {
    id: 'data-security',
    title: 'Data Security',
    content: [
      'We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process.',
      'These measures include encryption of data in transit (SSL/TLS), secure server infrastructure, regular security audits, and restricted access to personal information.',
      'However, no method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee its absolute security.',
      'If you have any questions about the security of your personal information, please contact us at ${siteConfig.email}.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies',
    content: [
      'Our website uses cookies to distinguish you from other users. This helps us to provide you with a good experience when you browse our website and allows us to improve our site.',
      'Essential cookies are necessary for the website to function properly. These cannot be disabled.',
      'Analytics cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      'Marketing cookies are used to track visitors across websites to display relevant advertisements.',
      'You can set your browser to refuse all or some cookies, but this may affect your ability to access certain parts of our website.',
    ],
  },
  {
    id: 'third-party-links',
    title: 'Third-Party Links',
    content: [
      'Our website may contain links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you.',
      'We do not control these third-party websites and are not responsible for their privacy statements. We encourage you to read the privacy statement of every website you visit.',
    ],
  },
  {
    id: 'childrens-privacy',
    title: "Children's Privacy",
    content: [
      'Our website is not intended for children under the age of 18, and we do not knowingly collect personal information from children under 18.',
      'If we learn that we have collected personal information from a child under 18 without verification of parental consent, we will delete that information promptly.',
      'If you believe that a child under 18 has provided us with personal information, please contact us immediately.',
    ],
  },
  {
    id: 'changes-to-policy',
    title: 'Changes to This Policy',
    content: [
      'We may update this privacy policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.',
      'We will notify you of any material changes by posting the new privacy policy on this page and updating the "Last Updated" date at the top.',
      'We encourage you to review this privacy policy periodically for any changes. Changes to this privacy policy are effective when they are posted on this page.',
    ],
  },
  {
    id: 'contact-us',
    title: 'Contact Us',
    content: [
      `If you have any questions about this privacy policy or our data practices, please contact us at:`,
      `${siteConfig.name} Pvt. Ltd.`,
      `${siteConfig.address}`,
      `Email: ${siteConfig.email}`,
      `Phone: ${siteConfig.phone}`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-green-900 overflow-hidden">
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
            <span className="text-white">Privacy Policy</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="heading-xl text-white mb-6">
              Privacy <span className="text-gold-400">Policy</span>
            </h1>
            <p className="text-body-lg text-neutral-300">
              Your privacy is important to us. This policy outlines how we collect, use, and
              protect your personal information.
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
                  At {siteConfig.name}, we are committed to protecting your privacy. This
                  Privacy Policy explains how we collect, use, disclose, and safeguard your
                  information when you visit our website and purchase our products. Please read
                  this policy carefully.
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
