import Hero from '@/components/home/Hero';
import BrandStory from '@/components/home/BrandStory';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Categories from '@/components/home/Categories';
import Certifications from '@/components/home/Certifications';
import Testimonials from '@/components/home/Testimonials';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <BrandStory />
      <Categories />
      <Certifications />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}
