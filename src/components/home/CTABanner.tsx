import Link from 'next/link';
import { ArrowRight, Truck, ShieldCheck, Clock, BadgeIndianRupee } from 'lucide-react';

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gold-600 via-gold-700 to-gold-800" />
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%),
                             radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <h2 className="heading-md text-white mb-4">
              Taste the Authentic Flavors of Punjab
            </h2>
            <p className="text-lg text-gold-100 mb-8 max-w-lg">
              Order now and get free shipping on your first order. 
              Experience the Orpind difference — where quality meets tradition.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gold-700 font-semibold rounded-sm hover:bg-beige-100 transition-colors group"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/wholesale"
                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/30 text-white font-medium rounded-sm hover:bg-white/10 transition-colors"
              >
                Wholesale Inquiry
              </Link>
            </div>
          </div>

          {/* Right - Benefits */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' },
              { icon: ShieldCheck, title: 'Quality Promise', desc: '100% organic certified' },
              { icon: Clock, title: 'Same Day Dispatch', desc: 'Orders before 2 PM' },
              { icon: BadgeIndianRupee, title: 'Best Prices', desc: 'Direct from farms' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/10 backdrop-blur-sm rounded-sm p-5 border border-white/10">
                <Icon className="w-6 h-6 text-white mb-3" />
                <h4 className="text-white font-semibold text-sm mb-1">{title}</h4>
                <p className="text-gold-200 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
