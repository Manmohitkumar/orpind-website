import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Clock, User, Calendar, ArrowRight, Share2, Facebook, Twitter } from 'lucide-react';
import { blogPosts, siteConfig } from '@/data/products';
import type { Metadata } from 'next';

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getRelatedPosts(currentSlug: string, tags: string[]) {
  return blogPosts
    .filter(
      (p) =>
        p.slug !== currentSlug && p.tags.some((t) => tags.includes(t))
    )
    .slice(0, 3);
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | Orpind Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${post.slug}`,
      type: 'article',
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, post.tags);
  const shareUrl = `${siteConfig.url}/blog/${post.slug}`;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-green-900">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white truncate max-w-xs">{post.title}</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="heading-xl text-white mb-6">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-300">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="bg-green-900 pb-16">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-[16/8] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-sm overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-9xl opacity-15">🫚</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12 max-w-5xl mx-auto">
            {/* Main Content */}
            <article>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium bg-gold-50 text-gold-600 rounded-sm capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Article Body */}
              <div className="prose-earth max-w-none">
                <p className="text-lg text-neutral-700 leading-relaxed mb-6 font-medium">
                  {post.excerpt}
                </p>

                <div className="space-y-6 text-neutral-600 leading-relaxed">
                  <p>
                    At Orpind, we take pride in bringing you the finest spices sourced directly
                    from the heart of Punjab. Each spice tells a story — of the rich soil it
                    grew in, the hands that harvested it, and the traditions that shaped its
                    journey from farm to your kitchen.
                  </p>

                  <h2 className="heading-sm text-neutral-800 mt-10 mb-4">The Heritage Behind Every Spice</h2>

                  <p>
                    Punjab&apos;s fertile plains and favorable climate have made it a cradle of
                    spice cultivation for centuries. The alluvial soil, fed by five mighty rivers,
                    creates the perfect conditions for growing spices that are rich in essential
                    oils, vibrant in color, and unmatched in flavor.
                  </p>

                  <p>
                    Our partner farmers use time-honored techniques passed down through
                    generations — from hand-picking the ripest seeds to sun-drying herbs under
                    the Punjab sun. This meticulous process ensures that every packet of Orpind
                    spice delivers authentic, uncompromised flavor.
                  </p>

                  <h2 className="heading-sm text-neutral-800 mt-10 mb-4">From Our Kitchen to Yours</h2>

                  <p>
                    {post.content !== 'Full article content here...'
                      ? post.content
                      : `Whether you are a seasoned chef or a home cook exploring Indian cuisine,
                    our spices are designed to elevate your cooking. The recipes and stories we
                    share here are inspired by generations of Punjabi cooking — simple,
                    flavorful, and made with love.`}
                  </p>

                  <p>
                    We believe that great food starts with great ingredients. That&apos;s why we
                    never compromise on quality, from sourcing to processing to packaging. Every
                    Orpind product carries the promise of purity, freshness, and authentic taste.
                  </p>

                  <blockquote className="border-l-4 border-gold-500 pl-6 py-2 my-8 bg-gold-50/50 rounded-r-sm">
                    <p className="text-neutral-700 italic font-display text-lg">
                      &ldquo;The secret to great cooking is not just technique — it&apos;s the
                      quality of your ingredients. When your spices are fresh and authentic,
                      every dish becomes extraordinary.&rdquo;
                    </p>
                    <cite className="text-sm text-neutral-500 mt-2 block not-italic">
                      — Orpind Kitchen
                    </cite>
                  </blockquote>

                  <p>
                    Stay tuned for more recipes, cooking tips, and stories from the heart of
                    Punjab. Follow us on social media and join our community of spice lovers who
                    are rediscovering the joy of authentic, home-style cooking.
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-12 p-6 bg-neutral-50 rounded-sm border border-neutral-100 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-display font-bold text-lg">
                      {getInitials(post.author)}
                    </span>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-neutral-800">{post.author}</p>
                    <p className="text-sm text-neutral-500">
                      Contributing writer at Orpind, sharing the flavors and stories of Punjab.
                    </p>
                  </div>
                </div>

                {/* Social Share */}
                <div className="mt-8 pt-8 border-t border-neutral-100">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                      <Share2 className="w-4 h-4" />
                      Share this article
                    </span>
                    <div className="flex items-center gap-3">
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-gold-500 hover:text-white transition-colors"
                      >
                        <Facebook className="w-4 h-4" />
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-gold-500 hover:text-white transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-green-500 hover:text-white transition-colors text-xs font-bold"
                      >
                        WA
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-8">
                {/* TOC placeholder */}
                <div className="bg-white p-6 rounded-sm border border-neutral-100 shadow-sm">
                  <h3 className="font-display font-semibold text-neutral-800 mb-4">In This Article</h3>
                  <div className="divider mb-4" />
                  <ul className="space-y-2 text-sm text-neutral-500">
                    <li>
                      <a href="#" className="hover:text-gold-600 transition-colors">
                        The Heritage Behind Every Spice
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-gold-600 transition-colors">
                        From Our Kitchen to Yours
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Related Tags */}
                <div className="bg-white p-6 rounded-sm border border-neutral-100 shadow-sm">
                  <h3 className="font-display font-semibold text-neutral-800 mb-4">Tags</h3>
                  <div className="divider mb-4" />
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-xs font-medium bg-neutral-50 text-neutral-600 rounded-sm capitalize hover:bg-gold-50 hover:text-gold-600 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="section-padding bg-neutral-50">
          <div className="container-custom mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm text-gold-600 font-medium uppercase tracking-widest mb-3">
                You Might Also Enjoy
              </p>
              <h2 className="heading-lg text-neutral-800 mb-4">Related Articles</h2>
              <div className="divider-center" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {related.map((rPost) => (
                <article key={rPost.id} className="card group">
                  <div className="aspect-[16/10] bg-gradient-to-br from-neutral-100 to-neutral-200 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl opacity-20">🫚</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-base font-display font-semibold text-neutral-800 mb-2 line-clamp-2 group-hover:text-gold-600 transition-colors">
                      <Link href={`/blog/${rPost.slug}`}>{rPost.title}</Link>
                    </h3>
                    <p className="text-sm text-neutral-500 line-clamp-2 mb-4">{rPost.excerpt}</p>
                    <Link
                      href={`/blog/${rPost.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors group/link"
                    >
                      Read More
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
