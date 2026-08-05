import Link from 'next/link';
import { Instagram, Leaf } from 'lucide-react';

const posts = [
  {
    id: 1,
    title: 'The Art of Making Authentic Punjabi Garam Masala',
    slug: 'art-of-punjabi-garam-masala',
    image: '/images/blog/garam-masala.svg',
    date: 'March 15, 2024',
    readTime: '5 min read',
    category: 'Recipes',
  },
  {
    id: 2,
    title: 'Why Organic Spices Matter for Your Health',
    slug: 'why-organic-spices-matter',
    image: '/images/blog/organic-spices.svg',
    date: 'March 10, 2024',
    readTime: '4 min read',
    category: 'Health',
  },
  {
    id: 3,
    title: 'Punjab\'s Spice Heritage: A Journey Through Time',
    slug: 'punjab-spice-heritage',
    image: '/images/blog/punjab-heritage.svg',
    date: 'March 5, 2024',
    readTime: '6 min read',
    category: 'Stories',
  },
];

export default function InstagramFeed() {
  return (
    <section className="section-padding bg-neutral-50">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm text-gold-600 font-medium uppercase tracking-widest mb-3">
            From Our Kitchen
          </p>
          <h2 className="heading-lg text-neutral-800 mb-4">
            Spice Stories &amp; Recipes
          </h2>
          <div className="divider-center" />
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="card group">
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                  <Leaf className="w-12 h-12 text-neutral-400" />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium text-gold-600 uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span className="text-xs text-neutral-400">·</span>
                  <span className="text-xs text-neutral-400">{post.readTime}</span>
                </div>
                <h3 className="font-display font-semibold text-neutral-800 mb-2 group-hover:text-gold-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-neutral-500">{post.date}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Follow CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://instagram.com/orpind"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium"
          >
            <Instagram className="w-5 h-5" />
            Follow @orpind on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
