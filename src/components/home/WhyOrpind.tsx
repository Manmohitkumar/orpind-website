import { Wheat, Leaf, Sparkles, Heart } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: '100% Organic',
    description: 'Every product is certified organic, grown without pesticides or synthetic fertilizers.',
  },
  {
    icon: Wheat,
    title: 'Farm Direct',
    description: 'Sourced directly from Punjab\'s finest farms, eliminating middlemen for the freshest produce.',
  },
  {
    icon: Sparkles,
    title: 'Small Batch',
    description: 'Ground and blended in small batches to preserve natural oils, aroma, and flavor.',
  },
  {
    icon: Heart,
    title: 'Heritage Recipe',
    description: 'Traditional recipes passed down through generations of Punjabi spice makers.',
  },
];

export default function WhyOrpind() {
  return (
    <section className="section-padding bg-green-900 texture-overlay">
      <div className="container-custom mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm text-gold-400 font-medium uppercase tracking-widest mb-3">
            The Orpind Difference
          </p>
          <h2 className="heading-lg text-white mb-4">
            Why Choose Orpind?
          </h2>
          <div className="divider-center mb-6" />
          <p className="text-body-lg text-neutral-400 max-w-2xl mx-auto">
            We don&apos;t just sell spices — we preserve a legacy. Every product 
            carries the warmth of Punjab&apos;s soil and the wisdom of generations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group text-center p-8 rounded-sm bg-neutral-800/50 border border-neutral-800/50 hover:border-gold-500/30 transition-all duration-500"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-sm bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
                <feature.icon className="w-7 h-7 text-gold-400" />
              </div>
              <h3 className="text-lg font-display font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 pt-16 border-t border-neutral-800/50 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '500+', label: 'Happy Customers' },
            { value: '50+', label: 'Products' },
            { value: '15+', label: 'Years Heritage' },
            { value: '100%', label: 'Organic Certified' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-display font-bold text-gold-400 mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-neutral-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
