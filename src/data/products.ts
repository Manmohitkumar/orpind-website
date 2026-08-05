import { Product, CartItem, Coupon, Order, User, BlogPost, Category, Testimonial, Review, Banner, WholesaleTier, Address } from '@/types';

export const whatsappNumber = '+916283348561';
export const whatsappLink = `https://wa.me/${whatsappNumber.replace('+', '')}`;

export const siteConfig = {
  name: 'Orpind',
  tagline: 'Premium Organic Spices & Grains from Punjab',
  description: 'Discover authentic Punjabi spices and organic grains. Farm-fresh, handpicked, and traditionally crafted.',
  url: 'https://orpind.com',
  email: 'mohitchetiwal291@gmail.com',
  phone: '+91 62833 48561',
  address: 'GT Road, Phagwara, Punjab, India - 144401',
  fssai: 'FSSAI License No: 12345678901234',
  gstin: '03XXXXXXXXX',
  social: {
    instagram: 'https://instagram.com/orpind',
    facebook: 'https://facebook.com/orpind',
    twitter: 'https://twitter.com/orpind',
    youtube: 'https://youtube.com/@orpind',
  },
};

export const categories: Category[] = [
  { id: '1', name: 'Whole Spices', slug: 'whole-spices', description: 'Handpicked whole spices from the heart of Punjab', image: '/images/categories/whole-spices.svg', productCount: 24 },
  { id: '2', name: 'Ground Spices', slug: 'ground-spices', description: 'Freshly ground spices for authentic flavors', image: '/images/categories/ground-spices.svg', productCount: 18 },
  { id: '3', name: 'Spice Blends', slug: 'spice-blends', description: 'Signature blends crafted by master spice makers', image: '/images/categories/spice-blends.svg', productCount: 12 },
  { id: '4', name: 'Premium Grains', slug: 'grains', description: 'Organic grains from Punjab\'s golden fields', image: '/images/categories/grains.svg', productCount: 15 },
  { id: '5', name: 'Flours', slug: 'flours', description: 'Stone-ground organic flours', image: '/images/categories/flours.svg', productCount: 8 },
  { id: '6', name: 'Herbs & Seasonings', slug: 'herbs', description: 'Dried herbs and seasonings for every kitchen', image: '/images/categories/herbs.svg', productCount: 10 },
  { id: '7', name: 'Gift Sets', slug: 'gift-sets', description: 'Curated spice collections, perfect for gifting', image: '/images/categories/gift-sets.svg', productCount: 6 },
];

export const products: Product[] = [
  {
    id: '1', name: 'Punjabi Garam Masala', slug: 'punjabi-garam-masala',
    description: 'Our signature Garam Masala is a carefully crafted blend of 15 whole spices, slow-roasted and ground in small batches. This authentic Punjabi recipe has been passed down through generations, delivering warmth and depth to every dish.',
    shortDescription: 'Traditional 15-spice blend from Punjab',
    price: 349, originalPrice: 449, category: 'spice-blends',
    images: ['/images/products/garam-masala-1.svg', '/images/products/garam-masala-2.svg'],
    weight: ['100g', '250g', '500g'], inStock: true, isBestseller: true, isOrganic: true,
    origin: 'Punjab, India', fssaiNumber: '12345678901234',
    ingredients: ['Cinnamon', 'Cardamom', 'Cloves', 'Black Pepper', 'Cumin', 'Coriander', 'Nutmeg', 'Bay Leaf', 'Mace', 'Star Anise', 'Fennel', 'Black Cardamom', 'Long Pepper', 'Stone Flower', 'Saffron'],
    nutritionalInfo: { servingSize: '5g', calories: 18, fat: '0.6g', carbs: '3.2g', protein: '0.4g', fiber: '1.1g', sodium: '2mg' },
    tags: ['bestseller', 'organic', 'punjabi', 'blend'], rating: 4.8, reviewCount: 342, createdAt: '2024-01-15', sku: 'OP-SP-001',
  },
  {
    id: '2', name: 'Kashmiri Red Chilli', slug: 'kashmiri-red-chilli',
    description: 'Premium Kashmiri red chillies known for their vibrant color and mild heat. Perfect for adding rich red hues to curries, biryanis, and tandoori dishes without overwhelming heat.',
    shortDescription: 'Vibrant color, mild heat chilli',
    price: 299, category: 'whole-spices',
    images: ['/images/products/kashmiri-chilli-1.svg'],
    weight: ['100g', '250g', '500g'], inStock: true, isBestseller: true, isOrganic: true,
    origin: 'Kashmir, India', fssaiNumber: '12345678901234',
    tags: ['bestseller', 'organic', 'whole'], rating: 4.7, reviewCount: 218, createdAt: '2024-02-10', sku: 'OP-SP-002',
  },
  {
    id: '3', name: 'Organic Basmati Rice', slug: 'organic-basmati-rice',
    description: 'Aged for 2 years, our organic Basmati rice grains are Extra Long, aromatic, and fluffy. Sourced directly from the fertile plains of Punjab, each grain tells a story of heritage and quality.',
    shortDescription: '2-year aged extra long grain rice',
    price: 599, originalPrice: 699, category: 'grains',
    images: ['/images/products/basmati-rice-1.svg'],
    weight: ['1kg', '5kg', '10kg'], inStock: true, isNew: true, isOrganic: true,
    origin: 'Punjab, India', fssaiNumber: '12345678901234',
    tags: ['new', 'organic', 'grain', 'premium'], rating: 4.9, reviewCount: 156, createdAt: '2024-03-01', sku: 'OP-GR-001',
  },
  {
    id: '4', name: 'Haldi (Turmeric) Powder', slug: 'haldi-turmeric-powder',
    description: 'High-curcumin turmeric powder sourced from organic farms. Our turmeric is stone-ground to preserve its natural oils and therapeutic properties. Rich golden color and earthy aroma.',
    shortDescription: 'High-curcumin organic turmeric',
    price: 199, category: 'ground-spices',
    images: ['/images/products/haldi-1.svg'],
    weight: ['100g', '250g', '500g'], inStock: true, isBestseller: true, isOrganic: true,
    origin: 'Erode, India', fssaiNumber: '12345678901234',
    nutritionalInfo: { servingSize: '5g', calories: 18, fat: '0.5g', carbs: '3g', protein: '0.5g', fiber: '1g', sodium: '1mg' },
    tags: ['bestseller', 'organic', 'health'], rating: 4.8, reviewCount: 289, createdAt: '2024-01-20', sku: 'OP-SP-003',
  },
  {
    id: '5', name: 'Amchur (Dry Mango) Powder', slug: 'amchur-powder',
    description: 'Tangy and fruity dry mango powder made from sun-dried raw mangoes. Adds a bright, sour kick to chaats, curries, and street food preparations.',
    shortDescription: 'Tangy sun-dried mango powder',
    price: 179, category: 'ground-spices',
    images: ['/images/products/amchur-1.svg'],
    weight: ['100g', '250g'], inStock: true, isOrganic: true,
    origin: 'Punjab, India', fssaiNumber: '12345678901234',
    tags: ['organic', 'tangy'], rating: 4.5, reviewCount: 98, createdAt: '2024-02-15', sku: 'OP-SP-004',
  },
  {
    id: '6', name: 'Sabji Masala', slug: 'sabji-masala',
    description: 'Our house-blend Sabji Masala is the secret to restaurant-style vegetables at home. A balanced mix of coriander, cumin, turmeric, and aromatic spices that elevates everyday cooking.',
    shortDescription: 'Restaurant-style vegetable spice blend',
    price: 249, category: 'spice-blends',
    images: ['/images/products/sabji-masala-1.svg'],
    weight: ['100g', '250g'], inStock: true, isOrganic: true,
    origin: 'Punjab, India', fssaiNumber: '12345678901234',
    tags: ['blend', 'everyday'], rating: 4.6, reviewCount: 167, createdAt: '2024-01-25', sku: 'OP-SP-005',
  },
  {
    id: '7', name: 'Whole Black Pepper', slug: 'whole-black-pepper',
    description: 'Bold and pungent Malabar black peppercorns, handpicked for their intense flavor. Essential for tempering, grinding fresh, and adding depth to any dish.',
    shortDescription: 'Bold Malabar peppercorns',
    price: 329, category: 'whole-spices',
    images: ['/images/products/black-pepper-1.svg'],
    weight: ['100g', '250g'], inStock: true, isOrganic: true,
    origin: 'Malabar, India', fssaiNumber: '12345678901234',
    tags: ['organic', 'whole', 'bold'], rating: 4.7, reviewCount: 134, createdAt: '2024-02-20', sku: 'OP-SP-006',
  },
  {
    id: '8', name: 'Tandoori Chicken Masala', slug: 'tandoori-chicken-masala',
    description: 'Get that authentic tandoori char and flavor at home. Our blend combines Kashmiri chilli, roasted cumin, and a touch of smoked paprika for restaurant-quality tandoori every time.',
    shortDescription: 'Authentic tandoori blend for home cooking',
    price: 289, category: 'spice-blends',
    images: ['/images/products/tandoori-masala-1.svg'],
    weight: ['100g', '250g'], inStock: true, isNew: true, isOrganic: true,
    origin: 'Punjab, India', fssaiNumber: '12345678901234',
    tags: ['new', 'blend', 'nonveg'], rating: 4.8, reviewCount: 87, createdAt: '2024-03-10', sku: 'OP-SP-007',
  },
  {
    id: '9', name: 'Multi-Grain Atta', slug: 'multi-grain-atta',
    description: 'A nutritious blend of whole wheat, ragi, jowar, bajra, and soybean flours. Stone-ground to retain fiber and nutrients. Makes soft, wholesome rotis the whole family will love.',
    shortDescription: '5-grain nutritious flour blend',
    price: 449, category: 'flours',
    images: ['/images/products/multigrain-atta-1.svg'],
    weight: ['1kg', '5kg'], inStock: true, isOrganic: true,
    origin: 'Punjab, India', fssaiNumber: '12345678901234',
    tags: ['healthy', 'organic', 'flour'], rating: 4.6, reviewCount: 203, createdAt: '2024-02-01', sku: 'OP-FL-001',
  },
  {
    id: '10', name: 'Organic Chana Dal', slug: 'organic-chana-dal',
    description: 'Premium quality chana dal sourced from certified organic farms. Perfect for making dal, snacks, and traditional Punjabi dishes. High protein, naturally gluten-free.',
    shortDescription: 'Premium organic split chickpeas',
    price: 279, category: 'grains',
    images: ['/images/products/chana-dal-1.svg'],
    weight: ['500g', '1kg', '5kg'], inStock: true, isOrganic: true,
    origin: 'Punjab, India', fssaiNumber: '12345678901234',
    tags: ['organic', 'protein', 'pulse'], rating: 4.7, reviewCount: 178, createdAt: '2024-01-30', sku: 'OP-GR-002',
  },
  {
    id: '11', name: 'Heritage Spice Box', slug: 'heritage-spice-box',
    description: 'Our premium handcrafted wooden spice box contains 7 essential Indian spices in brass containers. A perfect gift for food lovers and a beautiful addition to any kitchen.',
    shortDescription: 'Handcrafted wooden box with 7 spices',
    price: 2499, originalPrice: 2999, category: 'gift-sets',
    images: ['/images/products/spice-box-1.svg'],
    weight: ['7 x 50g'], inStock: true, isNew: true, isOrganic: true,
    origin: 'Punjab, India', fssaiNumber: '12345678901234',
    tags: ['gift', 'premium', 'handcrafted'], rating: 4.9, reviewCount: 45, createdAt: '2024-03-15', sku: 'OP-GS-001',
  },
  {
    id: '12', name: 'Jeera (Cumin) Seeds', slug: 'jeera-cumin-seeds',
    description: 'Aromatic whole cumin seeds from Rajasthan. Essential for tempering, raita, and spice blends. Our cumin is sun-dried and hand-sorted for consistent quality.',
    shortDescription: 'Aromatic whole cumin from Rajasthan',
    price: 219, category: 'whole-spices',
    images: ['/images/products/jeera-1.svg'],
    weight: ['100g', '250g', '500g'], inStock: true, isBestseller: true, isOrganic: true,
    origin: 'Rajasthan, India', fssaiNumber: '12345678901234',
    tags: ['essential', 'organic', 'tempering'], rating: 4.7, reviewCount: 256, createdAt: '2024-01-18', sku: 'OP-SP-008',
  },
  {
    id: '13', name: 'Dhania (Coriander) Powder', slug: 'dhania-coriander-powder',
    description: 'Freshly ground coriander powder from whole seeds. Our slow-grinding process preserves the natural citrusy, nutty flavor essential for Indian curries and gravies.',
    shortDescription: 'Freshly ground citrusy coriander',
    price: 169, category: 'ground-spices',
    images: ['/images/products/dhania-1.svg'],
    weight: ['100g', '250g', '500g'], inStock: true, isOrganic: true,
    origin: 'Rajasthan, India', fssaiNumber: '12345678901234',
    tags: ['essential', 'organic', 'curry'], rating: 4.6, reviewCount: 189, createdAt: '2024-02-05', sku: 'OP-SP-009',
  },
  {
    id: '14', name: 'Biryani Masala', slug: 'biryani-masala',
    description: 'Our royal Biryani Masala blend captures the essence of authentic Hyderabadi and Lucknowi biryani. A complex blend of 18 spices for the perfect aromatic biryani.',
    shortDescription: '18-spice royal biryani blend',
    price: 329, category: 'spice-blends',
    images: ['/images/products/biryani-masala-1.svg'],
    weight: ['100g', '250g'], inStock: true, isBestseller: true, isOrganic: true,
    origin: 'Punjab, India', fssaiNumber: '12345678901234',
    tags: ['bestseller', 'blend', 'biryani'], rating: 4.9, reviewCount: 278, createdAt: '2024-01-22', sku: 'OP-SP-010',
  },
  {
    id: '15', name: 'Organic Sella Basmati Rice', slug: 'organic-sella-basmati-rice',
    description: 'Parboiled sella basmati rice that stays separate and fluffy after cooking. Ideal for biryani, pulao, and fried rice. Extra long grains with incredible aroma.',
    shortDescription: 'Parboiled extra long grain rice',
    price: 549, category: 'grains',
    images: ['/images/products/sella-rice-1.svg'],
    weight: ['1kg', '5kg', '10kg'], inStock: true, isOrganic: true,
    origin: 'Punjab, India', fssaiNumber: '12345678901234',
    tags: ['organic', 'grain', 'biryani'], rating: 4.7, reviewCount: 134, createdAt: '2024-02-18', sku: 'OP-GR-003',
  },
  {
    id: '16', name: 'Methi (Fenugreek) Leaves', slug: 'methi-fenugreek-leaves',
    description: 'Air-dried organic fenugreek leaves that retain their characteristic bitter-sweet flavor. Perfect for butter chicken, methi paratha, and dal tadka.',
    shortDescription: 'Air-dried organic fenugreek',
    price: 149, category: 'herbs',
    images: ['/images/products/methi-1.svg'],
    weight: ['50g', '100g'], inStock: true, isOrganic: true,
    origin: 'Punjab, India', fssaiNumber: '12345678901234',
    tags: ['organic', 'herb', 'dried'], rating: 4.5, reviewCount: 87, createdAt: '2024-03-05', sku: 'OP-HB-001',
  },
];

export const reviews: Review[] = [
  { id: '1', productId: '1', userId: '1', userName: 'Priya Sharma', rating: 5, title: 'Best garam masala I have ever used!', comment: 'The aroma is incredible. You can clearly taste the difference compared to store-bought brands. My butter chicken has never tasted better.', isVerified: true, helpfulCount: 24, createdAt: '2024-03-20' },
  { id: '2', productId: '1', userId: '2', userName: 'Arjun Singh', rating: 5, title: 'Authentic Punjabi flavor', comment: 'Reminds me of my grandmother\'s homemade masala. The freshness is unmatched. Will keep ordering from Orpind.', isVerified: true, helpfulCount: 18, createdAt: '2024-03-18' },
  { id: '3', productId: '2', userId: '3', userName: 'Neha Gupta', rating: 4, title: 'Great color, mild heat', comment: 'Perfect for my tandoori marinade. Gives a beautiful red color without being too spicy. Slightly pricey but worth it for the quality.', isVerified: true, helpfulCount: 12, createdAt: '2024-03-15' },
  { id: '4', productId: '3', userId: '4', userName: 'Vikram Patel', rating: 5, title: 'The best basmati rice', comment: 'The grains are incredibly long and aromatic. Makes the fluffiest rice I have ever cooked. The 2-year aging really makes a difference.', isVerified: true, helpfulCount: 31, createdAt: '2024-03-12' },
  { id: '5', productId: '14', userId: '5', userName: 'Chef Harpal', rating: 5, title: 'Restaurant quality at home', comment: 'As a chef, I am very particular about spice blends. Orpind\'s Biryani Masala is the closest to authentic Lucknowi biryani I have found.', isVerified: true, helpfulCount: 42, createdAt: '2024-03-10' },
];

export const testimonials: Testimonial[] = [
  { id: '1', name: 'Chef Harpal Singh', role: 'Executive Chef, Punjab Grill', content: 'Orpind\'s spices are exceptional. The Garam Masala has a depth of flavor that reminds me of my grandmother\'s kitchen.', rating: 5 },
  { id: '2', name: 'Meera Kaur', role: 'Home Cook & Food Blogger', content: 'I switched to Orpind for all my cooking needs. The difference in taste is remarkable. My family noticed the change immediately.', rating: 5 },
  { id: '3', name: 'Rajesh Sharma', role: 'Restaurant Owner, Chandigarh', content: 'As a restaurant owner, consistency is key. Orpind delivers the same exceptional quality every time.', rating: 5 },
  { id: '4', name: 'Priya Malhotra', role: 'Food Enthusiast, Delhi', content: 'The Heritage Spice Box was the perfect gift for my mother. The packaging is beautiful, and the spices inside are even better.', rating: 5 },
];

export const blogPosts: BlogPost[] = [
  { id: '1', title: 'The Art of Making Authentic Punjabi Garam Masala', slug: 'art-of-punjabi-garam-masala', excerpt: 'Learn the traditional technique of making garam masala at home, just like our ancestors did in Punjab.', content: 'Full article content here...', image: '/images/blog/garam-masala.svg', author: 'Orpind Kitchen', publishedAt: '2024-03-15', readTime: '5 min read', tags: ['recipes', 'spices', 'punjabi'] },
  { id: '2', title: 'Why Organic Spices Matter for Your Health', slug: 'why-organic-spices-matter', excerpt: 'The shocking truth about conventional spices and why switching to organic can transform your health.', content: 'Full article content here...', image: '/images/blog/organic-spices.svg', author: 'Dr. Anjali Mehta', publishedAt: '2024-03-10', readTime: '4 min read', tags: ['health', 'organic', 'wellness'] },
  { id: '3', title: 'Punjab\'s Spice Heritage: A Journey Through Time', slug: 'punjab-spice-heritage', excerpt: 'Explore the rich history of spice trading in Punjab and how it shapes the flavors we love today.', content: 'Full article content here...', image: '/images/blog/punjab-heritage.svg', author: 'Orpind Stories', publishedAt: '2024-03-05', readTime: '6 min read', tags: ['stories', 'heritage', 'punjab'] },
  { id: '4', title: '10 Must-Have Spices in Every Indian Kitchen', slug: '10-must-have-spices', excerpt: 'Build your spice box with these 10 essential spices that form the backbone of Indian cooking.', content: 'Full article content here...', image: '/images/blog/must-have-spices.svg', author: 'Orpind Kitchen', publishedAt: '2024-02-28', readTime: '7 min read', tags: ['guide', 'spices', 'essential'] },
  { id: '5', title: 'How to Make the Perfect Chicken Tikka at Home', slug: 'perfect-chicken-tikka', excerpt: 'Restaurant-style chicken tikka in your home oven. Our step-by-step guide with Orpind Tandoori Masala.', content: 'Full article content here...', image: '/images/blog/chicken-tikka.svg', author: 'Chef Vikram', publishedAt: '2024-02-25', readTime: '8 min read', tags: ['recipes', 'chicken', 'tandoori'] },
  { id: '6', title: 'Health Benefits of Turmeric: Beyond the Golden Latte', slug: 'health-benefits-turmeric', excerpt: 'From anti-inflammatory properties to boosting immunity, discover why turmeric is called the golden spice.', content: 'Full article content here...', image: '/images/blog/turmeric-health.svg', author: 'Dr. Anjali Mehta', publishedAt: '2024-02-20', readTime: '5 min read', tags: ['health', 'turmeric', 'wellness'] },
];

export const banners: Banner[] = [
  { id: '1', title: 'Fresh Harvest Collection', subtitle: 'New season spices, freshly arrived from Punjab farms', cta: 'Shop Now', href: '/shop?sort=newest', active: true, position: 'hero' },
  { id: '2', title: 'Flat 20% Off on First Order', subtitle: 'Use code ORPIND20 at checkout', cta: 'Order Now', href: '/shop', active: true, position: 'promo' },
];

export const faqs = [
  { id: '1', question: 'Are all Orpind products certified organic?', answer: 'Yes, all our products are certified organic by recognized certification bodies. We maintain strict quality standards from sourcing to packaging.' },
  { id: '2', question: 'How do you ensure the freshness of your spices?', answer: 'We source spices directly from farmers and process them in small batches. Our packaging is designed to preserve freshness, and we have a strict FIFO inventory management system.' },
  { id: '3', question: 'What is your return policy?', answer: 'We offer a 7-day return policy for unopened products. If you are not satisfied with the quality, we will provide a full refund or replacement.' },
  { id: '4', question: 'Do you offer free shipping?', answer: 'Yes, we offer free shipping on all orders above ₹999. For orders below ₹999, a flat shipping fee of ₹49 applies.' },
  { id: '5', question: 'How long does delivery take?', answer: 'Standard delivery takes 3-5 business days across India. Express delivery (1-2 days) is available in select metro cities.' },
  { id: '6', question: 'Can I track my order?', answer: 'Yes, you will receive a tracking link via SMS and email once your order is shipped. You can also track your order from your account dashboard.' },
  { id: '7', question: 'Do you offer wholesale pricing?', answer: 'Yes, we offer competitive wholesale pricing for bulk orders starting from 10kg. Please visit our Wholesale page or contact us for details.' },
  { id: '8', question: 'Are your products FSSAI certified?', answer: 'Yes, all our products comply with FSSAI regulations and carry valid FSSAI license numbers on their packaging.' },
  { id: '9', question: 'Do you ship internationally?', answer: 'Currently, we ship within India only. We are working on international shipping and plan to launch soon for NRI customers.' },
  { id: '10', question: 'How can I become a distributor?', answer: 'Please visit our Wholesale page and fill out the distributor registration form. Our team will get in touch with you within 48 hours.' },
];

export const addresses: Address[] = [
  { id: '1', name: 'Priya Sharma', phone: '+91 62833 48561', line1: '42, Green Park Colony', line2: 'Near Metro Station', city: 'New Delhi', state: 'Delhi', pincode: '110016', country: 'IN', isDefault: true },
  { id: '2', name: 'Priya Sharma', phone: '+91 62833 48561', line1: '15, Model Town', city: 'Ludhiana', state: 'Punjab', pincode: '141002', country: 'IN', isDefault: false },
];

export const orders: Order[] = [
  { id: 'ORD-001', orderNumber: 'ORD-001', userId: '1', items: [], shippingAddress: addresses[0], subtotal: 1297, discount: 0, shippingCost: 0, tax: 0, total: 1297, paymentMethod: 'upi', paymentStatus: 'completed', orderStatus: 'delivered', createdAt: '2024-03-20T10:00:00Z', updatedAt: '2024-03-23T14:00:00Z' },
  { id: 'ORD-002', orderNumber: 'ORD-002', userId: '1', items: [], shippingAddress: addresses[1], subtotal: 599, discount: 0, shippingCost: 0, tax: 0, total: 599, paymentMethod: 'card', paymentStatus: 'completed', orderStatus: 'shipped', trackingNumber: 'DL123456789', createdAt: '2024-03-15T10:00:00Z', updatedAt: '2024-03-18T14:00:00Z' },
];

export const wholesaleTiers: WholesaleTier[] = [
  { id: 'retail', name: 'Retail', minOrder: 'No minimum', discount: 'Standard pricing', features: ['Access to all products', 'Free shipping above ₹999', 'Standard packaging', 'Online support'] },
  { id: 'wholesale', name: 'Wholesale', minOrder: '10 kg+', discount: '15-25% off', features: ['Volume discounts', 'Priority shipping', 'Bulk packaging', 'Dedicated support', 'Payment terms available'], popular: true },
  { id: 'enterprise', name: 'Enterprise', minOrder: '100 kg+', discount: 'Custom pricing', features: ['Custom pricing', 'White label options', 'Custom blends', 'API integration', 'Credit facilities', 'Account manager'] },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
};

export const getDiscountPercent = (original: number, current: number): number => {
  return Math.round(((original - current) / original) * 100);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(p => p.category === category);
};

export const getRelatedProducts = (product: Product, limit = 4): Product[] => {
  return products.filter(p => p.category === product.category && p.id !== product.id).slice(0, limit);
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(c => c.slug === slug);
};
