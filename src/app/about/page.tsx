import Link from 'next/link';
import { ChevronRight, Leaf, Heart, Users, Award, MapPin, ArrowRight } from 'lucide-react';

const timeline = [
  {
    year: '2008',
    title: 'The Beginning',
    description: 'Started as a small family-run spice shop in Phagwara, Punjab.',
  },
  {
    year: '2015',
    title: 'Going Organic',
    description: 'Transitioned to fully organic sourcing, partnering with local farmers.',
  },
  {
    year: '2019',
    title: 'Pan-India Expansion',
    description: 'Launched online store and began shipping across India.',
  },
  {
    year: '2024',
    title: 'Orpind Today',
    description: 'Serving 500+ customers with 50+ premium organic products.',
  },
];

const values = [
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'We partner with farmers who practice sustainable agriculture, protecting the soil for future generations.',
  },
  {
    icon: Heart,
    title: 'Authenticity',
    description: 'Every recipe is rooted in Punjab\'s rich culinary heritage, preserving flavors that have delighted for centuries.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We work directly with farming communities, ensuring fair prices and supporting rural livelihoods.',
  },
  {
    icon: Award,
    title: 'Quality',
    description: 'From farm to your kitchen, every product undergoes rigorous quality checks for purity and freshness.',
  },
];

export default function AboutPage() {
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
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">About Us</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="heading-xl text-white mb-6">
              Our <span className="text-gold-400">Story</span>
            </h1>
            <p className="text-body-lg text-neutral-300">
              Born in the heart of Punjab, Orpind is more than a spice brand — 
              it&apos;s a celebration of the land, the people, and the centuries-old 
              tradition of spice-making that runs through our veins.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm text-gold-600 font-medium uppercase tracking-widest mb-3">
                Our Mission
              </p>
              <h2 className="heading-lg text-neutral-800 mb-6">
                Bringing Punjab&apos;s Finest to Your Kitchen
              </h2>
              <div className="divider mb-6" />
              <div className="space-y-4 text-body text-neutral-600">
                <p>
                  At Orpind, we believe that great food starts with great ingredients. 
                  Our journey began in the spice markets of Punjab, where we saw how 
                  industrial processing was stripping spices of their natural oils, 
                  flavor, and nutritional value.
                </p>
                <p>
                  We set out to change that. By working directly with organic farmers 
                  across Punjab and India, we source the finest raw materials and 
                  process them in small batches using traditional methods — 
                  stone grinding, sun drying, and slow roasting.
                </p>
                <p>
                  The result? Spices that are bursting with flavor, rich in color, 
                  and packed with the natural goodness that nature intended.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-sm bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                <span className="text-9xl opacity-20">🫚</span>
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 bg-gold-500 rounded-sm p-6 text-white">
                <p className="text-3xl font-display font-bold mb-1">15+</p>
                <p className="text-sm text-gold-100">Years of Spice Heritage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-gold-600 font-medium uppercase tracking-widest mb-3">
              What We Stand For
            </p>
            <h2 className="heading-lg text-neutral-800 mb-4">Our Values</h2>
            <div className="divider-center" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center p-8 bg-white rounded-sm border border-neutral-100">
                <div className="w-14 h-14 mx-auto mb-5 bg-gold-50 rounded-full flex items-center justify-center">
                  <value.icon className="w-6 h-6 text-gold-600" />
                </div>
                <h3 className="font-display font-semibold text-neutral-800 mb-3">{value.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-white" id="timeline">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-gold-600 font-medium uppercase tracking-widest mb-3">
              Our Journey
            </p>
            <h2 className="heading-lg text-neutral-800 mb-4">Through the Years</h2>
            <div className="divider-center" />
          </div>
          <div className="max-w-2xl mx-auto">
            {timeline.map((item, index) => (
              <div key={item.year} className="flex gap-8 mb-12 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">{item.year.slice(2)}</span>
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-neutral-200 mt-3" />
                  )}
                </div>
                <div className="pb-8">
                  <p className="text-sm text-gold-600 font-semibold mb-1">{item.year}</p>
                  <h3 className="text-lg font-display font-semibold text-neutral-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="section-padding bg-green-900 texture-overlay" id="sustainability">
        <div className="container-custom mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm text-gold-400 font-medium uppercase tracking-widest mb-3">
                Sustainability
              </p>
              <h2 className="heading-lg text-white mb-6">
                From Soil to Soul
              </h2>
              <div className="w-16 h-0.5 bg-gold-500 mb-6" />
              <div className="space-y-4 text-neutral-300">
                <p>
                  We believe that great spices begin with healthy soil. Our partner 
                  farms use organic farming practices, crop rotation, and natural 
                  composting to maintain soil health.
                </p>
                <p>
                  Our packaging is designed with the environment in mind — using 
                  recyclable materials and minimal plastic. We&apos;re committed to 
                  reducing our carbon footprint while delivering the freshest 
                  spices to your door.
                </p>
              </div>
              <div className="flex items-center gap-3 mt-8 text-gold-400">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-medium">Carbon-neutral shipping across India</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '100%', label: 'Organic Sourcing' },
                { value: '50+', label: 'Partner Farms' },
                { value: '0', label: 'Chemicals Used' },
                { value: '100%', label: 'Recyclable Packaging' },
              ].map((stat) => (
                <div key={stat.label} className="bg-neutral-800/50 border border-neutral-800/50 rounded-sm p-6 text-center">
                  <p className="text-2xl font-display font-bold text-gold-400 mb-2">{stat.value}</p>
                  <p className="text-sm text-neutral-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gold-600 text-center">
        <div className="container-custom mx-auto">
          <h2 className="heading-md text-white mb-4">Ready to Experience the Difference?</h2>
          <p className="text-lg text-gold-100 mb-8 max-w-xl mx-auto">
            Join thousands of happy customers who have made the switch to authentic, 
            organic Punjabi spices.
          </p>
          <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gold-700 font-semibold rounded-sm hover:bg-beige-100 transition-colors group">
            Explore Our Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
