import mongoose from 'mongoose';
import config from '../../config/index.js';
import logger from '../../config/logger.js';
import Role from '../../models/role.model.js';
import Permission from '../../models/permission.model.js';
import User from '../../models/user.model.js';
import Category from '../../models/category.model.js';
import Product from '../../models/product.model.js';
import Coupon from '../../models/coupon.model.js';
import Warehouse from '../../models/warehouse.model.js';
import Inventory from '../../models/inventory.model.js';
import Blog from '../../models/blog.model.js';
import Recipe from '../../models/recipe.model.js';
import Setting from '../../models/setting.model.js';
import { ROLES, ROLE_HIERARCHY } from '../../constants/roles.js';
import { RESOURCES, ACTIONS, DEFAULT_ROLE_PERMISSIONS } from '../../constants/permissions.js';

async function connect() {
  await mongoose.connect(config.mongoUri, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
  });
  logger.info('Connected to MongoDB for seeding');
}

async function dropDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  logger.info('Database dropped');
}

async function seedPermissions() {
  const permissions = [];
  for (const [resource, actions] of Object.entries(DEFAULT_ROLE_PERMISSIONS[ROLES.SUPER_ADMIN])) {
    for (const action of actions) {
      const permName = `${resource}:${action}`.toUpperCase();
      permissions.push({ name: permName, resource, action, description: `${action} ${resource}` });
    }
  }
  const created = await Permission.insertMany(permissions);
  logger.info(`Created ${created.length} permissions`);
  const permMap = {};
  for (const p of created) {
    permMap[p.name] = p._id;
  }
  return permMap;
}

async function seedRoles(permMap) {
  const rolesData = [
    { name: ROLES.CUSTOMER, displayName: 'Customer', description: 'Regular customer account', level: ROLE_HIERARCHY.CUSTOMER, isDefault: true },
    { name: ROLES.WHOLESALE, displayName: 'Wholesale Buyer', description: 'Wholesale buyer account', level: ROLE_HIERARCHY.WHOLESALE },
    { name: ROLES.WAREHOUSE_STAFF, displayName: 'Warehouse Staff', description: 'Warehouse operations staff', level: ROLE_HIERARCHY.WAREHOUSE_STAFF },
    { name: ROLES.SUPPORT_EXECUTIVE, displayName: 'Support Executive', description: 'Customer support staff', level: ROLE_HIERARCHY.SUPPORT_EXECUTIVE },
    { name: ROLES.MARKETING, displayName: 'Marketing', description: 'Marketing team member', level: ROLE_HIERARCHY.MARKETING },
    { name: ROLES.EMPLOYEE, displayName: 'Employee', description: 'General employee', level: ROLE_HIERARCHY.EMPLOYEE },
    { name: ROLES.MANAGER, displayName: 'Manager', description: 'Store manager', level: ROLE_HIERARCHY.MANAGER },
    { name: ROLES.OWNER, displayName: 'Owner', description: 'Store owner', level: ROLE_HIERARCHY.OWNER },
    { name: ROLES.SUPER_ADMIN, displayName: 'Super Admin', description: 'Super administrator with full access', level: ROLE_HIERARCHY.SUPER_ADMIN },
  ];

  const roles = [];
  for (const rd of rolesData) {
    const rolePerms = DEFAULT_ROLE_PERMISSIONS[rd.name] || {};
    const permIds = [];
    for (const [, actions] of Object.entries(rolePerms)) {
      for (const action of actions) {
        const permName = `${Object.entries(RESOURCES).find(([, v]) => v === Object.keys(rolePerms).find(k => rolePerms[k].includes(action)))?.[1] || ''}:${action}`.toUpperCase();
        for (const [key, id] of Object.entries(permMap)) {
          const parts = key.split(':');
          if (parts[0].toLowerCase() === Object.keys(rolePerms).find(k => k === parts[0]) && parts[1] === action) {
            if (!permIds.includes(id)) permIds.push(id);
          }
        }
      }
    }
    roles.push({ ...rd, permissions: permIds });
  }

  const createdRoles = await Role.insertMany(roles);
  logger.info(`Created ${createdRoles.length} roles`);

  const roleMap = {};
  for (const r of createdRoles) {
    roleMap[r.name] = r._id;
  }
  return roleMap;
}

async function buildRolePermissions(roleMap, permMap) {
  for (const [roleName, perms] of Object.entries(DEFAULT_ROLE_PERMISSIONS)) {
    const permIds = [];
    for (const [resource, actions] of Object.entries(perms)) {
      for (const action of actions) {
        const permName = `${resource}:${action}`.toUpperCase();
        if (permMap[permName]) {
          permIds.push(permMap[permName]);
        }
      }
    }
    await Role.findByIdAndUpdate(roleMap[roleName], { permissions: permIds });
  }
  logger.info('Role permissions assigned');
}

async function seedUsers(roleMap) {
  const admin = await User.create({
    firstName: 'Admin',
    lastName: 'Orpind',
    email: 'admin@orpind.com',
    phone: '9876543210',
    password: 'Admin@123',
    role: roleMap[ROLES.SUPER_ADMIN],
    isEmailVerified: true,
    isActive: true,
  });

  const customer = await User.create({
    firstName: 'Customer',
    lastName: 'User',
    email: 'customer@orpind.com',
    phone: '9876543211',
    password: 'Customer@123',
    role: roleMap[ROLES.CUSTOMER],
    isEmailVerified: true,
    isActive: true,
  });

  logger.info('Created admin and customer users');
  return { admin, customer };
}

async function seedCategories() {
  const categories = await Category.insertMany([
    { name: 'Organic Spices', slug: 'organic-spices', description: 'Premium quality organic spices sourced directly from farms', sortOrder: 1, metaTitle: 'Organic Spices | Orpind', metaDescription: 'Shop 100% organic spices online' },
    { name: 'Spice Blends', slug: 'spice-blends', description: 'Expertly crafted spice blends for authentic Indian flavors', sortOrder: 2, metaTitle: 'Spice Blends | Orpind', metaDescription: 'Handcrafted masala blends' },
    { name: 'Whole Spices', slug: 'whole-spices', description: 'Whole spices for maximum freshness and flavor', sortOrder: 3, metaTitle: 'Whole Spices | Orpind', metaDescription: 'Buy whole spices online' },
    { name: 'Organic Grains', slug: 'organic-grains', description: 'Organic and whole grain staples for healthy living', sortOrder: 4, metaTitle: 'Organic Grains | Orpind', metaDescription: 'Premium organic grains' },
    { name: 'Organic Pulses', slug: 'organic-pulses', description: 'Nutritious organic pulses and lentils', sortOrder: 5, metaTitle: 'Organic Pulses | Orpind', metaDescription: 'Buy organic pulses online' },
    { name: 'Herbal Teas', slug: 'herbal-teas', description: 'Wellness herbal teas and infusions', sortOrder: 6, metaTitle: 'Herbal Teas | Orpind', metaDescription: 'Natural herbal tea collection' },
    { name: 'Masala Powders', slug: 'masala-powders', description: 'Freshly ground masala powders for everyday cooking', sortOrder: 7, metaTitle: 'Masala Powders | Orpind', metaDescription: 'Authentic masala powders' },
  ]);
  logger.info(`Created ${categories.length} categories`);

  const catMap = {};
  for (const c of categories) {
    catMap[c.name] = c._id;
  }
  return catMap;
}

async function seedProducts(catMap) {
  const products = [
    {
      name: 'Turmeric Powder',
      slug: 'turmeric-powder',
      sku: 'ORS-TUR-001',
      description: 'Our organic turmeric powder is sourced from the finest farms in Erode, Tamil Nadu. Known for its rich curcumin content and vibrant golden color, this turmeric is perfect for cooking, wellness drinks, and traditional remedies.',
      shortDescription: 'Premium organic turmeric powder with high curcumin content',
      price: 149,
      comparePrice: 199,
      costPrice: 85,
      weight: 250,
      weightInGrams: 250,
      categoryId: catMap['Organic Spices'],
      hsnCode: '0910',
      gstRate: 5,
      tags: ['turmeric', 'haldi', 'organic', 'spice', 'anti-inflammatory'],
      isFeatured: true,
      isBestseller: true,
      status: 'active',
      images: [{ url: '/images/products/turmeric-powder.jpg', publicId: 'products/turmeric-powder', alt: 'Turmeric Powder 250g', isPrimary: true, sortOrder: 0 }],
      metaTitle: 'Organic Turmeric Powder | Orpind',
      metaDescription: 'Buy premium organic turmeric powder online from Orpind',
    },
    {
      name: 'Red Chilli Powder',
      slug: 'red-chilli-powder',
      sku: 'ORS-CHI-002',
      description: 'Bold and fiery red chilli powder made from sun-dried Kashmiri and Guntur red chillies. Delivers the perfect balance of heat and flavor for authentic Indian cuisine.',
      shortDescription: 'Premium red chilli powder with rich color and balanced heat',
      price: 179,
      comparePrice: 229,
      costPrice: 100,
      weight: 250,
      weightInGrams: 250,
      categoryId: catMap['Organic Spices'],
      hsnCode: '0904',
      gstRate: 5,
      tags: ['chilli', 'mirchi', 'red chilli', 'spice', 'kashmiri'],
      isFeatured: true,
      status: 'active',
      images: [{ url: '/images/products/red-chilli-powder.jpg', publicId: 'products/red-chilli-powder', alt: 'Red Chilli Powder 250g', isPrimary: true, sortOrder: 0 }],
      metaTitle: 'Red Chilli Powder | Orpind',
      metaDescription: 'Buy premium red chilli powder online from Orpind',
    },
    {
      name: 'Garam Masala',
      slug: 'garam-masala',
      sku: 'ORS-GM-003',
      description: 'Our signature garam masala is a carefully curated blend of whole spices including cardamom, cinnamon, cloves, black pepper, and cumin. Slow-roasted and stone-ground to preserve essential oils and deliver unmatched aroma.',
      shortDescription: 'Authentic handcrafted garam masala blend',
      price: 199,
      comparePrice: 249,
      costPrice: 115,
      weight: 200,
      weightInGrams: 200,
      categoryId: catMap['Spice Blends'],
      hsnCode: '0910',
      gstRate: 5,
      tags: ['garam masala', 'spice blend', 'indian masala', 'cooking'],
      isFeatured: true,
      isBestseller: true,
      status: 'active',
      images: [{ url: '/images/products/garam-masala.jpg', publicId: 'products/garam-masala', alt: 'Garam Masala 200g', isPrimary: true, sortOrder: 0 }],
      metaTitle: 'Garam Masala | Orpind',
      metaDescription: 'Buy authentic garam masala online from Orpind',
    },
    {
      name: 'Coriander Powder',
      slug: 'coriander-powder',
      sku: 'ORS-COR-004',
      description: 'Freshly ground coriander powder from whole coriander seeds. Essential for curries, chutneys, and spice blends. Our coriander is sourced from Rajasthan for its distinctive citrusy flavor.',
      shortDescription: 'Premium coriander powder with fresh citrusy aroma',
      price: 129,
      comparePrice: 169,
      costPrice: 70,
      weight: 250,
      weightInGrams: 250,
      categoryId: catMap['Organic Spices'],
      hsnCode: '0909',
      gstRate: 5,
      tags: ['coriander', 'dhania', 'spice', 'organic'],
      isFeatured: false,
      status: 'active',
      images: [{ url: '/images/products/coriander-powder.jpg', publicId: 'products/coriander-powder', alt: 'Coriander Powder 250g', isPrimary: true, sortOrder: 0 }],
      metaTitle: 'Coriander Powder | Orpind',
      metaDescription: 'Buy premium coriander powder online from Orpind',
    },
    {
      name: 'Cumin Seeds',
      slug: 'cumin-seeds',
      sku: 'ORS-CUM-005',
      description: 'Premium whole cumin seeds (jeera) handpicked from Gujarat and Rajasthan. Known for their warm, earthy flavor and digestive benefits. Perfect for tempering, seasoning, and spice blends.',
      shortDescription: 'Premium whole cumin seeds with warm earthy flavor',
      price: 139,
      comparePrice: 179,
      costPrice: 75,
      weight: 200,
      weightInGrams: 200,
      categoryId: catMap['Whole Spices'],
      hsnCode: '0909',
      gstRate: 5,
      tags: ['cumin', 'jeera', 'whole spice', 'organic'],
      isFeatured: false,
      status: 'active',
      images: [{ url: '/images/products/cumin-seeds.jpg', publicId: 'products/cumin-seeds', alt: 'Cumin Seeds 200g', isPrimary: true, sortOrder: 0 }],
      metaTitle: 'Cumin Seeds | Orpind',
      metaDescription: 'Buy premium cumin seeds online from Orpind',
    },
    {
      name: 'Black Pepper',
      slug: 'black-pepper',
      sku: 'ORS-BP-006',
      description: 'Bold and aromatic whole black pepper from the Western Ghats of Kerala. Hand-picked and sun-dried to retain its pungent heat and complex flavor profile.',
      shortDescription: 'Premium Kerala black pepper with bold pungent heat',
      price: 219,
      comparePrice: 289,
      costPrice: 130,
      weight: 100,
      weightInGrams: 100,
      categoryId: catMap['Whole Spices'],
      hsnCode: '0904',
      gstRate: 5,
      tags: ['black pepper', 'kali mirch', 'whole spice', 'kerala'],
      isFeatured: true,
      status: 'active',
      images: [{ url: '/images/products/black-pepper.jpg', publicId: 'products/black-pepper', alt: 'Black Pepper 100g', isPrimary: true, sortOrder: 0 }],
      metaTitle: 'Black Pepper | Orpind',
      metaDescription: 'Buy premium Kerala black pepper online from Orpind',
    },
    {
      name: 'Cardamom',
      slug: 'cardamom',
      sku: 'ORS-CRD-007',
      description: 'Aromatic green cardamom pods sourced from the spice gardens of Kerala. Each pod is carefully selected for its intense fragrance and sweet, floral flavor. Essential for chai, desserts, and biryanis.',
      shortDescription: 'Premium green cardamom pods with intense fragrance',
      price: 449,
      comparePrice: 549,
      costPrice: 280,
      weight: 50,
      weightInGrams: 50,
      categoryId: catMap['Whole Spices'],
      hsnCode: '0908',
      gstRate: 5,
      tags: ['cardamom', 'elaichi', 'whole spice', 'kerala', 'green cardamom'],
      isFeatured: true,
      status: 'active',
      images: [{ url: '/images/products/cardamom.jpg', publicId: 'products/cardamom', alt: 'Cardamom 50g', isPrimary: true, sortOrder: 0 }],
      metaTitle: 'Green Cardamom | Orpind',
      metaDescription: 'Buy premium green cardamom online from Orpind',
    },
    {
      name: 'Cloves',
      slug: 'cloves',
      sku: 'ORS-CLV-008',
      description: 'Rich and pungent whole cloves from Kerala. Known for their intense aroma and warm, sweet flavor. Ideal for biryanis, curries, mulled beverages, and spice blends.',
      shortDescription: 'Premium whole cloves with intense warm aroma',
      price: 259,
      comparePrice: 329,
      costPrice: 155,
      weight: 50,
      weightInGrams: 50,
      categoryId: catMap['Whole Spices'],
      hsnCode: '0907',
      gstRate: 5,
      tags: ['cloves', 'laung', 'whole spice', 'kerala'],
      isFeatured: false,
      status: 'active',
      images: [{ url: '/images/products/cloves.jpg', publicId: 'products/cloves', alt: 'Cloves 50g', isPrimary: true, sortOrder: 0 }],
      metaTitle: 'Cloves | Orpind',
      metaDescription: 'Buy premium whole cloves online from Orpind',
    },
    {
      name: 'Basmati Rice',
      slug: 'basmati-rice',
      sku: 'ORS-BMT-009',
      description: 'Premium aged basmati rice from the foothills of the Himalayas. Each grain is extra-long, aromatic, and non-sticky. Perfect for biryanis, pulao, and everyday meals.',
      shortDescription: 'Aged premium basmati rice with extra-long grains',
      price: 349,
      comparePrice: 449,
      costPrice: 220,
      weight: 1000,
      weightInGrams: 1000,
      categoryId: catMap['Organic Grains'],
      hsnCode: '1006',
      gstRate: 0,
      tags: ['basmati rice', 'rice', 'grain', 'organic', 'aged'],
      isFeatured: true,
      isBestseller: true,
      status: 'active',
      images: [{ url: '/images/products/basmati-rice.jpg', publicId: 'products/basmati-rice', alt: 'Basmati Rice 1kg', isPrimary: true, sortOrder: 0 }],
      metaTitle: 'Basmati Rice | Orpind',
      metaDescription: 'Buy premium aged basmati rice online from Orpind',
    },
    {
      name: 'Brown Rice',
      slug: 'brown-rice',
      sku: 'ORS-BRN-010',
      description: 'Nutritious whole grain brown rice cultivated organically. Retains the bran layer for maximum fiber, vitamins, and minerals. Ideal for health-conscious consumers.',
      shortDescription: 'Organic whole grain brown rice rich in fiber',
      price: 279,
      comparePrice: 349,
      costPrice: 170,
      weight: 1000,
      weightInGrams: 1000,
      categoryId: catMap['Organic Grains'],
      hsnCode: '1006',
      gstRate: 0,
      tags: ['brown rice', 'whole grain', 'organic', 'healthy', 'fiber'],
      isFeatured: false,
      status: 'active',
      images: [{ url: '/images/products/brown-rice.jpg', publicId: 'products/brown-rice', alt: 'Brown Rice 1kg', isPrimary: true, sortOrder: 0 }],
      metaTitle: 'Brown Rice | Orpind',
      metaDescription: 'Buy organic brown rice online from Orpind',
    },
    {
      name: 'Quinoa',
      slug: 'quinoa',
      sku: 'ORS-QNO-011',
      description: 'Premium organic quinoa, a complete protein source containing all nine essential amino acids. Naturally gluten-free with a mild, nutty flavor. Perfect for salads, bowls, and healthy meals.',
      shortDescription: 'Organic quinoa - complete protein superfood',
      price: 499,
      comparePrice: 599,
      costPrice: 320,
      weight: 500,
      weightInGrams: 500,
      categoryId: catMap['Organic Grains'],
      hsnCode: '1008',
      gstRate: 0,
      tags: ['quinoa', 'superfood', 'organic', 'gluten-free', 'protein'],
      isFeatured: true,
      status: 'active',
      images: [{ url: '/images/products/quinoa.jpg', publicId: 'products/quinoa', alt: 'Quinoa 500g', isPrimary: true, sortOrder: 0 }],
      metaTitle: 'Organic Quinoa | Orpind',
      metaDescription: 'Buy organic quinoa online from Orpind',
    },
    {
      name: 'Millet',
      slug: 'millet',
      sku: 'ORS-MLT-012',
      description: 'Organic foxtail millet, an ancient grain making a modern comeback. High in iron, calcium, and dietary fiber. Low glycemic index makes it ideal for diabetic-friendly diets.',
      shortDescription: 'Organic millet - ancient grain with modern benefits',
      price: 189,
      comparePrice: 249,
      costPrice: 110,
      weight: 500,
      weightInGrams: 500,
      categoryId: catMap['Organic Grains'],
      hsnCode: '1008',
      gstRate: 0,
      tags: ['millet', 'ancient grain', 'organic', 'gluten-free', 'healthy'],
      isFeatured: false,
      status: 'active',
      images: [{ url: '/images/products/millet.jpg', publicId: 'products/millet', alt: 'Millet 500g', isPrimary: true, sortOrder: 0 }],
      metaTitle: 'Organic Millet | Orpind',
      metaDescription: 'Buy organic millet online from Orpind',
    },
    {
      name: 'Chai Masala',
      slug: 'chai-masala',
      sku: 'ORS-CHM-013',
      description: 'A warming blend of ginger, cardamom, cinnamon, black pepper, and cloves crafted specifically for masala chai. Transforms your daily tea into an aromatic wellness ritual.',
      shortDescription: 'Authentic chai masala blend for perfect masala chai',
      price: 169,
      comparePrice: 219,
      costPrice: 95,
      weight: 100,
      weightInGrams: 100,
      categoryId: catMap['Spice Blends'],
      hsnCode: '0910',
      gstRate: 5,
      tags: ['chai masala', 'spice blend', 'tea', 'masala chai'],
      isFeatured: true,
      status: 'active',
      images: [{ url: '/images/products/chai-masala.jpg', publicId: 'products/chai-masala', alt: 'Chai Masala 100g', isPrimary: true, sortOrder: 0 }],
      metaTitle: 'Chai Masala | Orpind',
      metaDescription: 'Buy authentic chai masala blend online from Orpind',
    },
    {
      name: 'Kitchen King Masala',
      slug: 'kitchen-king-masala',
      sku: 'ORS-KKM-014',
      description: 'The ultimate all-purpose Indian spice blend. Kitchen King masala adds restaurant-style flavor to everyday dishes. A harmonious mix of over 15 spices for curries, sabzis, and more.',
      shortDescription: 'All-purpose kitchen king masala for everyday cooking',
      price: 159,
      comparePrice: 209,
      costPrice: 88,
      weight: 100,
      weightInGrams: 100,
      categoryId: catMap['Spice Blends'],
      hsnCode: '0910',
      gstRate: 5,
      tags: ['kitchen king', 'masala', 'spice blend', 'all-purpose'],
      isFeatured: false,
      isBestseller: true,
      status: 'active',
      images: [{ url: '/images/products/kitchen-king-masala.jpg', publicId: 'products/kitchen-king-masala', alt: 'Kitchen King Masala 100g', isPrimary: true, sortOrder: 0 }],
      metaTitle: 'Kitchen King Masala | Orpind',
      metaDescription: 'Buy kitchen king masala online from Orpind',
    },
    {
      name: 'Sabji Masala',
      slug: 'sabji-masala',
      sku: 'ORS-SBM-015',
      description: 'A tangy and aromatic spice blend designed specifically for vegetable dishes. Enhances the natural flavors of vegetables with a perfect blend of coriander, cumin, turmeric, and other spices.',
      shortDescription: 'Specialized masala blend for delicious vegetable dishes',
      price: 139,
      comparePrice: 189,
      costPrice: 75,
      weight: 100,
      weightInGrams: 100,
      categoryId: catMap['Spice Blends'],
      hsnCode: '0910',
      gstRate: 5,
      tags: ['sabji masala', 'vegetable', 'spice blend', 'cooking'],
      isFeatured: false,
      status: 'active',
      images: [{ url: '/images/products/sabji-masala.jpg', publicId: 'products/sabji-masala', alt: 'Sabji Masala 100g', isPrimary: true, sortOrder: 0 }],
      metaTitle: 'Sabji Masala | Orpind',
      metaDescription: 'Buy sabji masala online from Orpind',
    },
    {
      name: 'Chicken Masala',
      slug: 'chicken-masala',
      sku: 'ORS-CKM-016',
      description: 'A robust and flavorful spice blend crafted for chicken dishes. From butter chicken to tandoori, this masala delivers authentic North Indian flavors. Rich in aromatics with a touch of heat.',
      shortDescription: 'Authentic chicken masala for rich flavorful chicken dishes',
      price: 179,
      comparePrice: 229,
      costPrice: 100,
      weight: 100,
      weightInGrams: 100,
      categoryId: catMap['Spice Blends'],
      hsnCode: '0910',
      gstRate: 5,
      tags: ['chicken masala', 'non-veg', 'spice blend', 'tandoori', 'butter chicken'],
      isFeatured: false,
      status: 'active',
      images: [{ url: '/images/products/chicken-masala.jpg', publicId: 'products/chicken-masala', alt: 'Chicken Masala 100g', isPrimary: true, sortOrder: 0 }],
      metaTitle: 'Chicken Masala | Orpind',
      metaDescription: 'Buy chicken masala online from Orpind',
    },
  ];

  const createdProducts = await Product.insertMany(products);
  logger.info(`Created ${createdProducts.length} products`);
  return createdProducts;
}

async function seedCoupons(adminId) {
  const coupons = await Coupon.insertMany([
    {
      code: 'WELCOME10',
      description: '10% off on your first order',
      discountType: 'percentage',
      discountValue: 10,
      minimumOrder: 200,
      maximumDiscount: 500,
      usageLimit: 1000,
      perUserLimit: 1,
      isActive: true,
      startDate: new Date(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      createdBy: adminId,
    },
    {
      code: 'FLAT50',
      description: 'Flat ₹50 off on orders above ₹500',
      discountType: 'fixed',
      discountValue: 50,
      minimumOrder: 500,
      maximumDiscount: 50,
      usageLimit: 500,
      perUserLimit: 2,
      isActive: true,
      startDate: new Date(),
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      createdBy: adminId,
    },
    {
      code: 'FREESHIP',
      description: 'Free shipping on all orders',
      discountType: 'free_shipping',
      discountValue: 0,
      minimumOrder: 300,
      usageLimit: 2000,
      perUserLimit: 5,
      isActive: true,
      startDate: new Date(),
      expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      createdBy: adminId,
    },
    {
      code: 'ORGANIC15',
      description: '15% off on organic products',
      discountType: 'percentage',
      discountValue: 15,
      minimumOrder: 400,
      maximumDiscount: 300,
      usageLimit: 800,
      perUserLimit: 3,
      isActive: true,
      startDate: new Date(),
      expiresAt: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      createdBy: adminId,
    },
    {
      code: 'WHOLESALE20',
      description: '20% off for wholesale buyers',
      discountType: 'percentage',
      discountValue: 20,
      minimumOrder: 5000,
      maximumDiscount: 5000,
      usageLimit: 100,
      perUserLimit: 10,
      isActive: true,
      startDate: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      createdBy: adminId,
    },
  ]);
  logger.info(`Created ${coupons.length} coupons`);
  return coupons;
}

async function seedWarehouses() {
  const warehouses = await Warehouse.insertMany([
    {
      name: 'Main Warehouse Ludhiana',
      code: 'WH-LDH-001',
      address: {
        addressLine1: 'Focal Point, Phase V',
        city: 'Ludhiana',
        state: 'Punjab',
        pincode: '141010',
        country: 'India',
      },
      contactPerson: 'Rajesh Kumar',
      phone: '9876543220',
      email: 'warehouse-ludhiana@orpind.com',
      type: 'main',
      isActive: true,
    },
    {
      name: 'Regional Warehouse Delhi',
      code: 'WH-DLH-002',
      address: {
        addressLine1: 'Bawana Industrial Area, Phase 2',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110039',
        country: 'India',
      },
      contactPerson: 'Amit Sharma',
      phone: '9876543221',
      email: 'warehouse-delhi@orpind.com',
      type: 'regional',
      isActive: true,
    },
  ]);
  logger.info(`Created ${warehouses.length} warehouses`);
  return warehouses;
}

async function seedInventory(products, warehouses) {
  const inventoryEntries = [];
  for (const product of products) {
    for (const warehouse of warehouses) {
      inventoryEntries.push({
        productId: product._id,
        warehouseId: warehouse._id,
        sku: product.sku,
        quantity: Math.floor(Math.random() * 200) + 50,
        reservedQuantity: Math.floor(Math.random() * 10),
        lowStockThreshold: 10,
        reorderPoint: 20,
        costPrice: product.costPrice || 0,
        status: 'in_stock',
        lastRestockedAt: new Date(),
      });
    }
  }
  const created = await Inventory.insertMany(inventoryEntries);
  logger.info(`Created ${created.length} inventory records`);
  return created;
}

async function seedBlogs(adminId) {
  const blogs = await Blog.insertMany([
    {
      title: 'The Golden Spice: Health Benefits of Turmeric',
      slug: 'golden-spice-health-benefits-turmeric',
      excerpt: 'Discover the incredible health benefits of turmeric, the golden spice that has been a cornerstone of Ayurvedic medicine for centuries.',
      content: '<p>Turmeric, often called the "golden spice," has been used in Indian households for thousands of years. Beyond its culinary uses, turmeric offers remarkable health benefits backed by modern science.</p><h2>Anti-Inflammatory Power</h2><p>The active compound in turmeric, curcumin, is a potent anti-inflammatory agent. Studies have shown it can help reduce chronic inflammation, which is linked to many modern diseases.</p><h2>Antioxidant Properties</h2><p>Curcumin is also a powerful antioxidant that can neutralize free radicals and boost the body\'s own antioxidant enzymes.</p><h2>Brain Health</h2><p>Research suggests that curcumin can increase levels of brain-derived neurotrophic factor (BDNF), potentially improving brain function and reducing the risk of brain diseases.</p><h2>How to Use Turmeric</h2><p>Add turmeric to your daily cooking, make golden milk with warm milk and black pepper (which enhances curcumin absorption), or take it as a supplement.</p>',
      author: adminId,
      category: 'Health & Wellness',
      tags: ['turmeric', 'health', 'organic', 'ayurveda', 'wellness'],
      status: 'published',
      publishedAt: new Date(),
      readingTime: 5,
    },
    {
      title: 'Essential Indian Spices Every Kitchen Needs',
      slug: 'essential-indian-spices-every-kitchen',
      excerpt: 'A complete guide to the must-have Indian spices that form the backbone of Indian cuisine and offer incredible health benefits.',
      content: '<p>Indian cuisine is world-renowned for its complex flavors and aromatic spices. Here are the essential spices every Indian kitchen should have.</p><h2>1. Turmeric (Haldi)</h2><p>The golden spice with anti-inflammatory and antioxidant properties. Essential for curries, dals, and rice dishes.</p><h2>2. Red Chilli Powder (Lal Mirch)</h2><p>Adds heat and color to dishes. Kashmiri chilli provides vibrant color with mild heat.</p><h2>3. Coriander Powder (Dhania)</h2><p>A citrusy, slightly sweet spice that forms the base of many curry powders and spice blends.</p><h2>4. Cumin (Jeera)</h2><p>Warm and earthy, cumin is used whole or ground in tempering, curries, and rice dishes.</p><h2>5. Garam Masala</h2><p>A finishing spice blend that adds warmth and complexity to any dish.</p>',
      author: adminId,
      category: 'Food & Culture',
      tags: ['spices', 'indian cuisine', 'cooking', 'essential spices'],
      status: 'published',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      readingTime: 7,
    },
    {
      title: 'From Farm to Kitchen: Our Spice Sourcing Journey',
      slug: 'farm-to-kitchen-spice-sourcing-journey',
      excerpt: 'Behind the scenes of how Orpind sources the finest organic spices directly from Indian farms to your kitchen.',
      content: '<p>At Orpind, we believe great food starts with great ingredients. Here\'s a look at how we bring you the finest organic spices.</p><h2>Direct Farm Partnerships</h2><p>We work directly with over 200 small-scale farmers across India, from the spice gardens of Kerala to the turmeric fields of Erode.</p><h2>Quality at Every Step</h2><p>Each batch of spices undergoes rigorous quality testing for purity, freshness, and contamination. We use advanced testing methods to ensure no pesticides or adulterants.</p><h2>Sustainable Practices</h2><p>Our partner farms follow organic and sustainable farming practices. We support farmers in transitioning to chemical-free agriculture through training and fair pricing.</p><h2>Fresh Processing</h2><p>Spices are ground fresh in small batches to preserve essential oils and flavor. No preservatives, no fillers—just pure, authentic spices.</p>',
      author: adminId,
      category: 'Behind the Scenes',
      tags: ['sourcing', 'organic', 'farms', 'quality', 'sustainability'],
      status: 'published',
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      readingTime: 6,
    },
  ]);
  logger.info(`Created ${blogs.length} blog posts`);
  return blogs;
}

async function seedRecipes(adminId) {
  const recipes = await Recipe.insertMany([
    {
      title: 'Golden Turmeric Latte',
      slug: 'golden-turmeric-latte',
      description: 'A soothing, anti-inflammatory warm beverage that combines the healing power of turmeric with creamy milk and aromatic spices.',
      ingredients: [
        { productName: 'Turmeric Powder', quantity: '1 tsp', isOptional: false },
        { productName: 'Cinnamon Powder', quantity: '½ tsp', isOptional: false },
        { productName: 'Black Pepper', quantity: '¼ tsp', isOptional: false },
        { productName: 'Honey', quantity: '1 tbsp', isOptional: true },
        { productName: 'Milk (dairy or plant-based)', quantity: '1 cup', isOptional: false },
        { productName: 'Ginger Powder', quantity: '¼ tsp', isOptional: true },
      ],
      instructions: [
        'Heat the milk in a saucepan over medium heat.',
        'Add turmeric powder, cinnamon, black pepper, and ginger powder.',
        'Whisk continuously for 2-3 minutes until well combined and hot but not boiling.',
        'Remove from heat and strain if desired.',
        'Add honey to taste and stir well.',
        'Serve warm and enjoy the golden goodness.',
      ],
      prepTime: 2,
      cookTime: 5,
      totalTime: 7,
      servings: 1,
      difficulty: 'easy',
      cuisine: 'Indian',
      tags: ['turmeric', 'latte', 'wellness', 'drink', 'anti-inflammatory'],
      author: adminId,
      status: 'published',
    },
    {
      title: 'Authentic Masala Chai',
      slug: 'authentic-masala-chai',
      description: 'A traditional Indian spiced tea made with fresh whole spices and strong Assam tea. The perfect way to start your morning.',
      ingredients: [
        { productName: 'Water', quantity: '1 cup', isOptional: false },
        { productName: 'Milk', quantity: '1 cup', isOptional: false },
        { productName: 'Assam Tea Leaves', quantity: '2 tsp', isOptional: false },
        { productName: 'Cardamom (crushed)', quantity: '3 pods', isOptional: false },
        { productName: 'Cinnamon', quantity: '1 inch stick', isOptional: false },
        { productName: 'Cloves', quantity: '2', isOptional: true },
        { productName: 'Black Pepper', quantity: '2', isOptional: true },
        { productName: 'Fresh Ginger (grated)', quantity: '1 inch', isOptional: false },
        { productName: 'Sugar', quantity: '2 tsp', isOptional: true },
      ],
      instructions: [
        'Bring water to a boil in a saucepan.',
        'Add crushed cardamom, cinnamon, cloves, black pepper, and grated ginger.',
        'Reduce heat and let the spices simmer for 2 minutes to infuse.',
        'Add tea leaves and sugar. Boil for 1 minute.',
        'Pour in the milk and bring to a gentle boil.',
        'Reduce heat and simmer for 2-3 minutes until the chai reaches your desired strength.',
        'Strain into cups and serve hot.',
      ],
      prepTime: 3,
      cookTime: 8,
      totalTime: 11,
      servings: 2,
      difficulty: 'easy',
      cuisine: 'Indian',
      tags: ['chai', 'tea', 'masala chai', 'spiced tea', 'breakfast'],
      author: adminId,
      status: 'published',
    },
  ]);
  logger.info(`Created ${recipes.length} recipes`);
  return recipes;
}

async function seedSettings() {
  const settings = [
    { group: 'store', key: 'name', value: 'Orpind', type: 'string', isPublic: true, description: 'Store name' },
    { group: 'store', key: 'tagline', value: 'Pure. Organic. Authentic.', type: 'string', isPublic: true, description: 'Store tagline' },
    { group: 'store', key: 'email', value: 'support@orpind.com', type: 'string', isPublic: true, description: 'Store email' },
    { group: 'store', key: 'phone', value: '9876543210', type: 'string', isPublic: true, description: 'Store phone' },
    { group: 'store', key: 'currency', value: 'INR', type: 'string', isPublic: true, description: 'Store currency' },
    { group: 'store', key: 'currencySymbol', value: '₹', type: 'string', isPublic: true, description: 'Currency symbol' },
    { group: 'gst', key: 'isEnabled', value: true, type: 'boolean', isPublic: false, description: 'Enable GST' },
    { group: 'gst', key: 'gstNumber', value: '03AABCO1234F1Z5', type: 'string', isPublic: false, description: 'GST registration number' },
    { group: 'gst', key: 'defaultGstRate', value: 5, type: 'number', isPublic: false, description: 'Default GST rate percentage' },
    { group: 'shipping', key: 'freeShippingEnabled', value: true, type: 'boolean', isPublic: true, description: 'Enable free shipping' },
    { group: 'shipping', key: 'freeShippingMinOrder', value: 500, type: 'number', isPublic: true, description: 'Minimum order for free shipping' },
    { group: 'shipping', key: 'standardShippingRate', value: 49, type: 'number', isPublic: true, description: 'Standard shipping rate' },
    { group: 'shipping', key: 'expressShippingRate', value: 99, type: 'number', isPublic: true, description: 'Express shipping rate' },
    { group: 'shipping', key: 'codEnabled', value: true, type: 'boolean', isPublic: true, description: 'Enable cash on delivery' },
    { group: 'shipping', key: 'codMaxAmount', value: 2000, type: 'number', isPublic: true, description: 'Maximum order amount for COD' },
    { group: 'seo', key: 'metaTitle', value: 'Orpind - Premium Organic Spices & Grains', type: 'string', isPublic: true, description: 'Default meta title' },
    { group: 'seo', key: 'metaDescription', value: 'Shop premium organic spices, spice blends, whole spices, and grains online. Farm-fresh quality delivered to your doorstep.', type: 'string', isPublic: true, description: 'Default meta description' },
    { group: 'seo', key: 'ogImage', value: '/images/og-default.jpg', type: 'string', isPublic: true, description: 'Default OG image' },
  ];

  const created = await Setting.insertMany(settings);
  logger.info(`Created ${created.length} settings`);
  return created;
}

async function seed() {
  try {
    await connect();
    await dropDatabase();

    const permMap = await seedPermissions();
    const roleMap = await seedRoles(permMap);
    await buildRolePermissions(roleMap, permMap);
    const { admin } = await seedUsers(roleMap);
    const catMap = await seedCategories();
    const products = await seedProducts(catMap);
    await seedCoupons(admin._id);
    const warehouses = await seedWarehouses();
    await seedInventory(products, warehouses);
    await seedBlogs(admin._id);
    await seedRecipes(admin._id);
    await seedSettings();

    logger.info('Seed completed successfully');
    process.exit(0);
  } catch (err) {
    logger.error('Seed failed', { error: err.message, stack: err.stack });
    process.exit(1);
  }
}

seed();
