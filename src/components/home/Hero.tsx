import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-green-900 texture-overlay">
      <div className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full bg-gold-500 opacity-5" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-gold-500 opacity-5" />

      <div className="container-custom px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <span className="text-gold-500 text-xs tracking-widest uppercase font-medium mb-6">
            Premium Organic Spices & Grains
          </span>

          <h1 className="heading-hero text-white mb-6">
            Spices Rooted in<br/>Punjab&apos;s Soil
          </h1>

          <p className="text-lg md:text-xl text-beige-300/80 max-w-xl mb-10">
            Premium organic spices & grains, grown with tradition and harvested with care.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link href="/shop" className="btn-primary-lg">
              Explore Collection
            </Link>
            <Link
              href="/about"
              className="btn-secondary border-white text-white hover:bg-white/10 hover:border-white active:bg-white/10"
            >
              Our Story
            </Link>
          </div>

          <div className="flex items-center gap-4 text-sm text-beige-400">
            <span>50+ Farms</span>
            <span className="w-1 h-1 rounded-full bg-beige-400/40" />
            <span>100% Organic</span>
            <span className="w-1 h-1 rounded-full bg-beige-400/40" />
            <span>Since 2024</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse-soft">
        <span className="text-xs text-beige-400 uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-5 h-5 text-beige-400" />
      </div>
    </section>
  );
}
