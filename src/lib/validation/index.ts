import { z } from 'zod';

// ─── Auth Validation ─────────────────────────────────
export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address').toLowerCase(),
  phone: z.string().regex(/^[+]?[0-9]{10,15}$/, 'Invalid phone number').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase')
    .regex(/[a-z]/, 'Password must contain lowercase')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain a special character'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// ─── Product Validation ──────────────────────────────
export const productQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['featured', 'price-asc', 'price-desc', 'rating', 'newest', 'bestselling']).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  organic: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});

// ─── Cart Validation ─────────────────────────────────
export const addToCartSchema = z.object({
  productId: z.string().min(1),
  weight: z.string().min(1),
  quantity: z.number().min(1).max(100).default(1),
});

export const updateCartSchema = z.object({
  productId: z.string().min(1),
  weight: z.string().min(1),
  quantity: z.number().min(0).max(100),
});

// ─── Order Validation ────────────────────────────────
export const createOrderSchema = z.object({
  shippingAddressId: z.string().min(1),
  paymentMethod: z.enum(['upi', 'card', 'netbanking', 'cod', 'wallet']),
  couponCode: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled']),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
});

// ─── Address Validation ──────────────────────────────
export const addressSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^[+]?[0-9]{10,15}$/, 'Invalid phone number'),
  line1: z.string().min(5, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Invalid pincode'),
  country: z.string().default('IN'),
  isDefault: z.boolean().default(false),
});

// ─── Review Validation ───────────────────────────────
export const createReviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().min(1).max(5),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000),
});

// ─── Coupon Validation ───────────────────────────────
export const createCouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  description: z.string().max(200).optional(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(1),
  minOrderAmount: z.number().min(0).default(0),
  maxDiscount: z.number().optional(),
  usageLimit: z.number().min(-1).default(-1),
  perUserLimit: z.number().min(1).default(1),
  validFrom: z.string().transform(v => new Date(v)),
  validUntil: z.string().transform(v => new Date(v)),
  applicableCategories: z.array(z.string()).optional(),
});

export const validateCouponSchema = z.object({
  couponCode: z.string().min(1),
  subtotal: z.number().min(0),
});

// ─── Shipping Validation ─────────────────────────────
export const checkShippingSchema = z.object({
  pincode: z.string().regex(/^[0-9]{6}$/, 'Invalid pincode'),
});

// ─── Contact Validation ──────────────────────────────
export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^[+]?[0-9]{10,15}$/, 'Invalid phone').optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

// ─── Newsletter Validation ───────────────────────────
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// ─── Wholesale Validation ────────────────────────────
export const wholesaleSchema = z.object({
  businessName: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^[+]?[0-9]{10,15}$/),
  businessType: z.enum(['retailer', 'restaurant', 'hotel', 'distributor', 'exporter', 'other']),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9Z][A-Z0-9]$/, 'Invalid GST number').optional(),
  fssaiNumber: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  monthlyVolume: z.string().optional(),
  message: z.string().max(1000).optional(),
});

// ─── Blog Validation ─────────────────────────────────
export const createBlogSchema = z.object({
  title: z.string().min(5).max(200),
  slug: z.string().min(5).max(200),
  excerpt: z.string().min(10).max(500),
  content: z.string().min(50),
  image: z.string().url().optional(),
  author: z.string().min(2),
  category: z.string().min(2),
  tags: z.array(z.string()),
  isPublished: z.boolean().default(false),
});

// ─── Schema Registry ──────────────────────────────────
const schemas: Record<string, z.ZodTypeAny> = {
  register: registerSchema,
  login: loginSchema,
  contact: contactSchema,
};

// ─── Helper ──────────────────────────────────────────
export function validateRequest<T>(schema: z.ZodSchema<T> | string, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  const resolved = typeof schema === 'string' ? schemas[schema] : schema;
  if (!resolved) return { success: false, errors: ['Unknown validation schema'] };
  const result = resolved.safeParse(data);
  if (result.success) return { success: true, data: result.data as T };
  return { success: false, errors: result.error.errors.map(e => e.message) };
}
