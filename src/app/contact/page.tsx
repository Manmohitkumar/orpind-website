'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Send, Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { whatsappNumber } from '@/data/products';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-green-900">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Contact</span>
          </nav>
          <h1 className="heading-xl text-white mb-4">Get in Touch</h1>
          <p className="text-body-lg text-neutral-400 max-w-2xl">
            Have a question, suggestion, or want to partner with us? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="heading-sm text-neutral-800 mb-6">Contact Information</h2>
                <div className="divider mb-6" />
              </div>

              {[
                {
                  icon: MapPin,
                  title: 'Visit Us',
                  details: ['Orpind Foods Pvt. Ltd.', 'GT Road, Phagwara', 'Punjab, India - 144401'],
                },
                {
                  icon: Phone,
                  title: 'Call Us',
                  details: ['+91 62833 48561', '+91 181 234 5678'],
                },
                {
                  icon: Mail,
                  title: 'Email Us',
                  details: ['mohitchetiwal291@gmail.com', 'wholesale@orpind.com'],
                },
                {
                  icon: Clock,
                  title: 'Working Hours',
                  details: ['Mon - Sat: 9:00 AM - 7:00 PM', 'Sunday: Closed'],
                },
              ].map(({ icon: Icon, title, details }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 bg-gold-50 rounded-sm flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800 mb-1">{title}</h3>
                    {details.map((d, i) => (
                      <p key={i} className="text-sm text-neutral-500">{d}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${whatsappNumber.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-green-500 text-white rounded-sm hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 md:p-10 rounded-sm shadow-sm border border-neutral-100">
                <h2 className="heading-sm text-neutral-800 mb-6">Send Us a Message</h2>
                <div className="divider mb-8" />

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <Send className="w-7 h-7 text-green-600" />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-neutral-800 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-neutral-500">
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                      }}
                      className="mt-6 btn-outline"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="input-field"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="input-field"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="input-field"
                          placeholder="+91 62833 48561"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Subject *
                        </label>
                        <select
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="input-field"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="wholesale">Wholesale Inquiry</option>
                          <option value="order">Order Support</option>
                          <option value="feedback">Feedback</option>
                          <option value="partnership">Partnership</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="input-field resize-none"
                        placeholder="Tell us how we can help..."
                      />
                    </div>

                    <button type="submit" className="btn-primary group">
                      Send Message
                      <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-96 bg-neutral-200 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-10 h-10 text-gold-500 mx-auto mb-3" />
            <p className="text-neutral-600 font-medium">Orpind HQ — Phagwara, Punjab</p>
            <p className="text-sm text-neutral-400">Google Maps integration coming soon</p>
          </div>
        </div>
      </section>
    </>
  );
}
