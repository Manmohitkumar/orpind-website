'use client';

import { Leaf, Truck, ShieldCheck, RotateCcw } from 'lucide-react';

const features = [
  { icon: Leaf, label: '100% Organic' },
  { icon: Truck, label: 'Free Shipping' },
  { icon: ShieldCheck, label: 'Quality Assured' },
  { icon: RotateCcw, label: 'Easy Returns' },
];

export default function TrustBar() {
  return (
    <section className="bg-neutral-50 border-y border-neutral-100">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center gap-8 md:gap-16 overflow-x-auto">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 flex-shrink-0">
              <Icon className="w-4 h-4 text-gold-500" />
              <span className="text-sm font-medium text-neutral-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
