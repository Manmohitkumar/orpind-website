import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function BrandStory() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="aspect-[4/3] rounded-lg bg-warm-gradient relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-gold-500" />
              <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-green-500" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl opacity-20">🌾</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gold-500 font-medium uppercase tracking-widest mb-3">Our Story</p>
            <h2 className="heading-2 text-green-800 mb-6">Rooted in the Spirit of Punjab</h2>
            <p className="text-body mb-8">
              Born in the heart of Punjab, ORPIND brings the authentic taste of organic spices and grains from our family farms to your kitchen. For generations, our farmers have nurtured the land with traditional wisdom, growing spices the way nature intended — without chemicals, without compromise.
            </p>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <p className="text-2xl font-display font-bold text-gold-500">50+</p>
                <p className="text-sm text-neutral-500">Partner Farms</p>
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-gold-500">100%</p>
                <p className="text-sm text-neutral-500">Organic</p>
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-gold-500">Direct</p>
                <p className="text-sm text-neutral-500">to Table</p>
              </div>
            </div>
            <Link href="/about" className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-600 font-medium group">
              Read Our Full Story
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
