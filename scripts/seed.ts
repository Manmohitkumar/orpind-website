import prisma from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seed...\n');

  console.log('Cleaning existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.banner.deleteMany();
  console.log('✓ Database cleaned\n');

  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@orpind.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Orpind',
      phone: '+916283348561',
      role: 'ADMIN',
      isVerified: true,
      isActive: true,
    },
  });
  console.log('✓ Admin user created: admin@orpind.com / Admin@123');

  const customerPassword = await bcrypt.hash('Customer@123', 12);
  await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: customerPassword,
      firstName: 'Raj',
      lastName: 'Kumar',
      phone: '+919876543211',
      role: 'CUSTOMER',
      isVerified: true,
      isActive: true,
      addresses: {
        create: {
          name: 'Raj Kumar',
          line1: '45 MG Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          phone: '+919876543211',
          isDefault: true,
        },
      },
    },
  });
  console.log('✓ Test customer created: customer@example.com / Customer@123');

  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Whole Spices', slug: 'whole-spices', description: 'Premium whole spices sourced directly from Punjab farms', image: '/images/categories/whole-spices.svg', sortOrder: 1, isActive: true } }),
    prisma.category.create({ data: { name: 'Ground Spices', slug: 'ground-spices', description: 'Freshly ground spices for authentic flavor', image: '/images/categories/ground-spices.svg', sortOrder: 2, isActive: true } }),
    prisma.category.create({ data: { name: 'Spice Blends', slug: 'spice-blends', description: 'Traditional Punjabi masala blends', image: '/images/categories/spice-blends.svg', sortOrder: 3, isActive: true } }),
    prisma.category.create({ data: { name: 'Organic Grains', slug: 'organic-grains', description: 'Chemical-free whole grains from Punjab', image: '/images/categories/organic-grains.svg', sortOrder: 4, isActive: true } }),
    prisma.category.create({ data: { name: 'Organic Flour', slug: 'organic-flour', description: 'Stone-ground organic flour', image: '/images/categories/organic-flour.svg', sortOrder: 5, isActive: true } }),
    prisma.category.create({ data: { name: 'Herbs & Seasonings', slug: 'herbs-seasonings', description: 'Dried herbs and seasoning blends', image: '/images/categories/herbs.svg', sortOrder: 6, isActive: true } }),
    prisma.category.create({ data: { name: 'Gift Boxes', slug: 'gift-boxes', description: 'Curated spice gift sets', image: '/images/categories/gift-boxes.svg', sortOrder: 7, isActive: true } }),
  ]);
  console.log(`✓ ${categories.length} categories created`);

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Organic Turmeric (Haldi)', slug: 'organic-turmeric-haldi',
        description: 'Premium quality organic turmeric sourced from the fertile fields of Punjab. Rich in curcumin, our turmeric adds vibrant color and earthy flavor to your dishes.',
        shortDescription: 'Farm-fresh organic turmeric with high curcumin content',
        price: 149, originalPrice: 199, sku: 'ORP-WH-001',
        category: 'whole-spices', subcategory: null,
        images: ['/images/products/turmeric-1.svg', '/images/products/turmeric-2.svg'],
        weight: ['250g'], stockCount: 500, lowStockThreshold: 50,
        isNew: false, isBestseller: true, isOrganic: true, origin: 'Punjab, India',
        ingredients: [], tags: ['organic', 'turmeric', 'haldi', 'whole-spice', 'punjabi'],
        rating: 0, reviewCount: 0, isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Kashmiri Red Chilli', slug: 'kashmiri-red-chilli',
        description: 'Vibrant red Kashmiri chillies known for their rich color and mild heat.',
        shortDescription: 'Premium Kashmiri chillies for rich color and mild heat',
        price: 199, originalPrice: 249, sku: 'ORP-WH-002',
        category: 'whole-spices',
        images: ['/images/products/kashmiri-chilli-1.svg'],
        weight: ['200g'], stockCount: 350, lowStockThreshold: 50,
        isNew: false, isBestseller: false, isOrganic: true, origin: 'Kashmir, India',
        ingredients: [], tags: ['organic', 'chilli', 'kashmiri', 'whole-spice'],
        rating: 0, reviewCount: 0, isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Green Cardamom (Elaichi)', slug: 'green-cardamom-elaichi',
        description: 'Aromatic green cardamom pods bursting with intense flavor.',
        shortDescription: 'Intensely aromatic green cardamom pods',
        price: 349, originalPrice: 449, sku: 'ORP-WH-003',
        category: 'whole-spices',
        images: ['/images/products/cardamom-1.svg'],
        weight: ['100g'], stockCount: 200, lowStockThreshold: 30,
        isNew: false, isBestseller: true, isOrganic: true, origin: 'Kerala, India',
        ingredients: [], tags: ['organic', 'cardamom', 'elaichi', 'whole-spice', 'premium'],
        rating: 0, reviewCount: 0, isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Punjabi Garam Masala', slug: 'punjabi-garam-masala',
        description: 'Our signature Garam Masala blend, crafted using a traditional family recipe.',
        shortDescription: 'Traditional family recipe blend of 12 aromatic spices',
        price: 179, originalPrice: 229, sku: 'ORP-GS-001',
        category: 'ground-spices',
        images: ['/images/products/garam-masala-1.svg'],
        weight: ['150g'], stockCount: 400, lowStockThreshold: 50,
        isNew: false, isBestseller: true, isOrganic: true, origin: 'Punjab, India',
        ingredients: [], tags: ['garam-masala', 'spice-blend', 'punjabi', 'ground-spice'],
        rating: 0, reviewCount: 0, isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Coriander Powder (Dhania)', slug: 'coriander-powder-dhania',
        description: 'Freshly ground coriander powder made from handpicked coriander seeds.',
        shortDescription: 'Freshly ground from handpicked coriander seeds',
        price: 129, originalPrice: 169, sku: 'ORP-GS-002',
        category: 'ground-spices',
        images: ['/images/products/coriander-1.svg'],
        weight: ['200g'], stockCount: 600, lowStockThreshold: 80,
        isNew: false, isBestseller: true, isOrganic: true, origin: 'Punjab, India',
        ingredients: [], tags: ['coriander', 'dhania', 'ground-spice', 'everyday'],
        rating: 0, reviewCount: 0, isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Chole Masala', slug: 'chole-masala',
        description: 'Authentic Punjabi chole masala for restaurant-style flavor.',
        shortDescription: 'Restaurant-style chole masala for authentic chole bhature',
        price: 159, originalPrice: 199, sku: 'ORP-SB-001',
        category: 'spice-blends',
        images: ['/images/products/chole-masala-1.svg'],
        weight: ['100g'], stockCount: 300, lowStockThreshold: 40,
        isNew: true, isBestseller: false, isOrganic: true, origin: 'Punjab, India',
        ingredients: [], tags: ['chole-masala', 'spice-blend', 'punjabi', 'recipe-specific'],
        rating: 0, reviewCount: 0, isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Basmati Rice (1121)', slug: 'basmati-rice-1121',
        description: 'Premium aged 1121 Basmati rice from Punjab.',
        shortDescription: 'Premium aged 1121 Basmati with extra-long grains',
        price: 399, originalPrice: 499, sku: 'ORP-GR-001',
        category: 'organic-grains',
        images: ['/images/products/basmati-rice-1.svg'],
        weight: ['1kg'], stockCount: 250, lowStockThreshold: 30,
        isNew: false, isBestseller: true, isOrganic: true, origin: 'Punjab, India',
        ingredients: [], tags: ['basmati', 'rice', 'organic', 'grain'],
        rating: 0, reviewCount: 0, isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Organic Wheat Atta', slug: 'organic-wheat-atta',
        description: 'Stone-ground organic wheat flour for soft, fluffy rotis.',
        shortDescription: 'Stone-ground organic flour for soft rotis',
        price: 189, originalPrice: 229, sku: 'ORP-GR-002',
        category: 'organic-flour',
        images: ['/images/products/wheat-atta-1.svg'],
        weight: ['2kg'], stockCount: 400, lowStockThreshold: 50,
        isNew: false, isBestseller: true, isOrganic: true, origin: 'Punjab, India',
        ingredients: [], tags: ['wheat', 'atta', 'flour', 'organic', 'stone-ground'],
        rating: 0, reviewCount: 0, isActive: true,
      },
    }),
  ]);
  console.log(`✓ ${products.length} products created`);

  const now = new Date();
  const coupons = await Promise.all([
    prisma.coupon.create({
      data: {
        code: 'WELCOME10', description: '10% off on first order',
        discountType: 'percentage', discountValue: 10,
        minOrderAmount: 500, maxDiscount: 200,
        usageLimit: 1000, usedCount: 0, perUserLimit: 1,
        validFrom: now, validUntil: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        isActive: true, applicableCategories: [],
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'FLAT100', description: 'Flat ₹100 off on orders above ₹1500',
        discountType: 'fixed', discountValue: 100,
        minOrderAmount: 1500, maxDiscount: 100,
        usageLimit: 500, usedCount: 0, perUserLimit: 1,
        validFrom: now, validUntil: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
        isActive: true, applicableCategories: [],
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'PUNJABI20', description: '20% off on all Punjabi spice blends',
        discountType: 'percentage', discountValue: 20,
        minOrderAmount: 300, maxDiscount: 300,
        usageLimit: 200, usedCount: 0, perUserLimit: 1,
        validFrom: now, validUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        isActive: true, applicableCategories: ['spice-blends'],
      },
    }),
  ]);
  console.log(`✓ ${coupons.length} coupons created`);

  const blogPosts = await Promise.all([
    prisma.blogPost.create({
      data: {
        title: 'The Story Behind Orpind: From Punjab Farms to Your Kitchen',
        slug: 'story-behind-orpind',
        excerpt: 'Discover how Orpind was born from a passion for authentic Punjabi spices.',
        content: '<h2>Our Journey</h2><p>Orpind was born in the heartland of Punjab.</p>',
        author: 'Admin',
        category: 'Brand Story',
        tags: ['brand-story', 'organic', 'punjab', 'farm-to-table'],
        isPublished: true, publishedAt: now,
        readTime: '5 min',
      },
    }),
    prisma.blogPost.create({
      data: {
        title: '10 Essential Spices Every Indian Kitchen Must Have',
        slug: '10-essential-spices-indian-kitchen',
        excerpt: 'From turmeric to garam masala, discover the must-have spices.',
        content: '<h2>The Foundation of Indian Cooking</h2><p>Indian cuisine is built on aromatic spices.</p>',
        author: 'Admin',
        category: 'Cooking Tips',
        tags: ['spices', 'kitchen-essentials', 'cooking-tips', 'guide'],
        isPublished: true, publishedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        readTime: '7 min',
      },
    }),
  ]);
  console.log(`✓ ${blogPosts.length} blog posts created`);

  const banners = await Promise.all([
    prisma.banner.create({
      data: {
        title: 'Summer Spice Collection', subtitle: 'Up to 30% off on our curated summer spice blends',
        cta: 'Shop Now', href: '/shop?collection=summer',
        position: 'hero', sortOrder: 1, isActive: true,
      },
    }),
    prisma.banner.create({
      data: {
        title: 'Farm Fresh to Your Door', subtitle: 'Directly sourced from Punjab farms | Free shipping on orders above ₹999',
        cta: 'Explore', href: '/shop',
        position: 'hero', sortOrder: 2, isActive: true,
      },
    }),
  ]);
  console.log(`✓ ${banners.length} banners created`);

  console.log('\n✅ Database seed completed successfully!\n');
  console.log('Admin credentials:');
  console.log('  Email: admin@orpind.com');
  console.log('  Password: Admin@123\n');
  console.log('Customer credentials:');
  console.log('  Email: customer@example.com');
  console.log('  Password: Customer@123\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
