import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: ReturnType<typeof createPrismaClient> };

const JSON_FIELDS: Record<string, string[]> = {
  Product: ['images', 'weight', 'ingredients', 'tags'],
  Review: ['images'],
  Coupon: ['applicableCategories'],
  BlogPost: ['tags'],
};

function serialize(obj: Record<string, unknown>, model: string) {
  const fields = JSON_FIELDS[model];
  if (!fields) return obj;
  for (const key of fields) {
    if (obj[key] !== undefined && obj[key] !== null && typeof obj[key] !== 'string') {
      obj[key] = JSON.stringify(obj[key]);
    }
  }
  return obj;
}

function deserialize(obj: Record<string, unknown>, model: string) {
  const fields = JSON_FIELDS[model];
  if (!fields) return obj;
  for (const key of fields) {
    if (typeof obj[key] === 'string') {
      try { obj[key] = JSON.parse(obj[key] as string); }
      catch { /* keep as string */ }
    }
  }
  return obj;
}

function createPrismaClient() {
  const base = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

  return base.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const a = args as Record<string, unknown>;
          const writeOps = ['create', 'createMany', 'update', 'updateMany', 'upsert'];
          if (writeOps.includes(operation)) {
            if (a.data) {
              if (Array.isArray(a.data)) {
                a.data = a.data.map((d: Record<string, unknown>) => serialize(d, model));
              } else {
                serialize(a.data as Record<string, unknown>, model);
              }
            }
            if (a.create && !Array.isArray(a.create)) {
              serialize(a.create as Record<string, unknown>, model);
            }
          }

          const result = await query(args);

          const readOps = ['findUnique', 'findUniqueOrThrow', 'findFirst', 'findFirstOrThrow', 'findMany'];
          if (readOps.includes(operation)) {
            if (result) {
              if (Array.isArray(result)) {
                result.forEach((r: Record<string, unknown>) => deserialize(r, model));
              } else {
                deserialize(result as Record<string, unknown>, model);
              }
            }
            if (result && typeof result === 'object' && !Array.isArray(result)) {
              for (const key of Object.keys(result as Record<string, unknown>)) {
                const val = (result as Record<string, unknown>)[key];
                if (Array.isArray(val)) {
                  val.forEach((item: Record<string, unknown>) => {
                    if (item && typeof item === 'object') deserialize(item, key);
                  });
                }
              }
            }
          }

          return result;
        },
      },
    },
  });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

// ─── Database Helpers ────────────────────────────────

export async function dbHealthCheck(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export async function disconnectDB() {
  await prisma.$disconnect();
}

// ─── Common Queries ──────────────────────────────────

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id }, include: { addresses: true } });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      reviews: { where: { isApproved: true }, include: { user: { select: { firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } },
      inventory: true,
    },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id }, include: { inventory: true } });
}

export async function getProducts(params: {
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  organic?: boolean;
  page?: number;
  limit?: number;
}) {
  const { category, search, sort, minPrice, maxPrice, organic, page = 1, limit = 12 } = params;
  const where: Record<string, unknown> = { isActive: true };

  if (category && category !== 'all') where.category = category;
  if (minPrice) where.price = { ...(where.price as object), gte: minPrice };
  if (maxPrice) where.price = { ...(where.price as object), lte: maxPrice };
  if (organic) where.isOrganic = true;
  if (search) {
    const q = search.toLowerCase();
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { tags: { contains: q } },
    ];
  }

  let orderBy: Record<string, string> = {};
  switch (sort) {
    case 'price-asc': orderBy = { price: 'asc' }; break;
    case 'price-desc': orderBy = { price: 'desc' }; break;
    case 'rating': orderBy = { rating: 'desc' }; break;
    case 'newest': orderBy = { createdAt: 'desc' }; break;
    case 'bestselling': orderBy = { reviewCount: 'desc' }; break;
    default: orderBy = { createdAt: 'desc' };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function createOrder(data: {
  userId: string;
  items: Array<{ productId: string; productName: string; image?: string; weight: string; quantity: number; price: number }>;
  shippingAddressId: string;
  subtotal: number;
  discount?: number;
  shippingCost?: number;
  tax?: number;
  total: number;
  couponCode?: string;
  paymentMethod: string;
}) {
  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: data.userId,
        shippingAddressId: data.shippingAddressId,
        subtotal: data.subtotal,
        discount: data.discount || 0,
        shippingCost: data.shippingCost || 0,
        tax: data.tax || 0,
        total: data.total,
        couponCode: data.couponCode,
        paymentMethod: data.paymentMethod,
        orderStatus: 'PLACED',
        paymentStatus: 'PENDING',
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            image: item.image,
            weight: item.weight,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
        },
      },
      include: { items: true, shippingAddress: true },
    });

    for (const item of data.items) {
      await tx.inventory.updateMany({
        where: { productId: item.productId },
        data: { quantity: { decrement: item.quantity }, reservedQuantity: { increment: item.quantity } },
      });
    }

    if (data.couponCode) {
      await tx.coupon.updateMany({
        where: { code: data.couponCode },
        data: { usedCount: { increment: 1 } },
      });
    }

    return order;
  });
}

export async function createReview(data: {
  userId: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
}) {
  return prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: { ...data, images: '[]', isVerified: false, isApproved: false },
    });

    const stats = await tx.review.aggregate({
      where: { productId: data.productId, isApproved: true },
      _avg: { rating: true },
      _count: { id: true },
    });

    await tx.product.update({
      where: { id: data.productId },
      data: {
        rating: stats._avg.rating || 0,
        reviewCount: stats._count.id,
      },
    });

    return review;
  });
}

export async function applyCoupon(code: string, subtotal: number) {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.isActive) return { valid: false, error: 'Invalid coupon code' };
  if (new Date() < coupon.validFrom || new Date() > coupon.validUntil) return { valid: false, error: 'Coupon has expired' };
  if (subtotal < coupon.minOrderAmount) return { valid: false, error: `Minimum order amount is ₹${coupon.minOrderAmount}` };
  if (coupon.usageLimit !== -1 && coupon.usedCount >= coupon.usageLimit) return { valid: false, error: 'Coupon usage limit reached' };

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.min(Math.round(subtotal * coupon.discountValue / 100), coupon.maxDiscount || Infinity);
  } else {
    discount = Math.min(coupon.discountValue, subtotal);
  }

  return { valid: true, discount, coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue } };
}
