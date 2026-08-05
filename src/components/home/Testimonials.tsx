'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Chef Harpal Singh',
    location: 'Executive Chef, Punjab Grill',
    content: 'Orpind\'s spices are exceptional. The Garam Masala has a depth of flavor that reminds me of my grandmother\'s kitchen.',
    rating: 5,
  },
  {
    name: 'Meera Kaur',
    location: 'Home Cook & Food Blogger',
    content: 'I switched to Orpind for all my cooking needs. The difference in taste is remarkable. My family noticed the change immediately.',
    rating: 5,
  },
  {
    name: 'Rajesh Sharma',
    location: 'Restaurant Owner, Chandigarh',
    content: 'As a restaurant owner, consistency is key. Orpind delivers the same exceptional quality every time.',
    rating: 5,
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setActive((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <p className="text-sm text-gold-500 font-medium uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="heading-2 text-green-800 mb-4">What Our Customers Say</h2>
          <div className="divider-center" />
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <div className="card-elevated p-10 relative">
            <Quote className="absolute top-6 left-6 w-12 h-12 text-beige-200" />
            <div className="flex items-center justify-center gap-1 mb-6">
              {[...Array(testimonials[active].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-semantic-star text-semantic-star" />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl font-display font-light italic text-green-700 leading-relaxed mb-8">
              &ldquo;{testimonials[active].content}&rdquo;
            </blockquote>
            <p className="font-semibold text-green-800">{testimonials[active].name}</p>
            <p className="text-sm text-neutral-500">{testimonials[active].location}</p>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-gold-500 hover:border-gold-500 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActive(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === active ? 'bg-gold-500 w-8' : 'bg-neutral-200 hover:bg-neutral-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-gold-500 hover:border-gold-500 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
