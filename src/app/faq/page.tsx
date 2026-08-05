'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, Search, HelpCircle, MessageCircle, ArrowRight } from 'lucide-react';
import { faqs } from '@/data/products';
import type { Metadata } from 'next';

const faqCategories = ['General', 'Orders', 'Shipping', 'Returns', 'Wholesale'] as const;

const faqCategoryMap: Record<string, string[]> = {
  General: ['1', '8', '10'],
  Orders: ['6', '7'],
  Shipping: ['4', '5', '9'],
  Returns: ['3'],
  Wholesale: ['7', '10'],
};

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('General');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    let result = faqs;

    if (activeCategory !== 'General') {
      const ids = faqCategoryMap[activeCategory] || [];
      result = result.filter((faq) => ids.includes(faq.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(q) ||
          faq.answer.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">FAQ</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="heading-xl text-white mb-6">
              Frequently Asked <span className="text-gold-400">Questions</span>
            </h1>
            <p className="text-body-lg text-neutral-300">
              Find answers to the most common questions about our products, orders, shipping,
              and more.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container-custom mx-auto max-w-4xl">
          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-neutral-200 rounded-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all text-lg"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {faqCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchQuery('');
                }}
                className={`px-5 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                  activeCategory === cat && !searchQuery
                    ? 'bg-gold-600 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:border-gold-300 hover:text-gold-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16">
                <HelpCircle className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-xl text-neutral-500 mb-2">No questions found</p>
                <p className="text-sm text-neutral-400">
                  Try a different search term or category.
                </p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`bg-white rounded-sm border transition-colors ${
                      isExpanded ? 'border-gold-300 shadow-sm' : 'border-neutral-100'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left"
                      aria-expanded={isExpanded}
                    >
                      <h3 className="font-display font-semibold text-neutral-800 text-base">
                        {faq.question}
                      </h3>
                      <ChevronDown
                        className={`w-5 h-5 text-neutral-400 flex-shrink-0 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isExpanded ? 'max-h-96 pb-5' : 'max-h-0'
                      }`}
                    >
                      <div className="px-5 pt-0">
                        <div className="divider mb-4" />
                        <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 bg-gold-50 rounded-full flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-gold-600" />
            </div>
            <h2 className="heading-md text-neutral-800 mb-4">Still Have Questions?</h2>
            <p className="text-neutral-500 mb-8">
              Can&apos;t find what you&apos;re looking for? Our team is here to help. Reach out
              and we&apos;ll get back to you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="btn-primary group">
                Contact Us
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://wa.me/916283348561"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-green-500 text-white font-medium rounded-sm hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
