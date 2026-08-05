import { Mail } from 'lucide-react';
import Newsletter from '@/components/ui/Newsletter';

export default function NewsletterSection() {
  return (
    <section className="section-padding bg-beige-100">
      <div className="container-custom mx-auto text-center">
        <div className="max-w-lg mx-auto">
          <div className="w-14 h-14 mx-auto mb-6 bg-gold-50 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-gold-600" />
          </div>
          <h2 className="heading-3 text-green-700 mb-3">Stay Connected with Orpind</h2>
          <p className="text-body text-neutral-500 mb-8">
            Subscribe for recipes, spice tips, and exclusive offers delivered to your inbox.
          </p>
          <Newsletter />
        </div>
      </div>
    </section>
  );
}
