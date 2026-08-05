## 6. Database Design

### Why MongoDB

| Factor | MongoDB | PostgreSQL |
|---|---|---|
| Schema Flexibility | Dynamic schema — products vary wildly | Fixed schema — extensive migrations |
| JSON Native | Documents are JSON — zero impedance mismatch with Node.js | Requires ORM mapping |
| Read Performance | Denormalized reads — single query fetches entire document | JOIN-heavy for nested data |
| Horizontal Scaling | Built-in sharding across replica sets | Requires Citus extension |
| Development Speed | Faster iteration for product catalog changes | Slower due to migration discipline |
| E-commerce Fit | Product catalogs, orders are naturally document-shaped | Better for relational data (accounting) |
| Scaling Target | 1M users — handles with 3-node replica set + sharding | Significant infrastructure needed |

**MongoDB is chosen for its natural fit with Node.js e-commerce workloads. The document model eliminates the N+1 query problem that plagues relational databases in product-heavy applications.**

### Collection Designs

#### users
```javascript
{
  _id: ObjectId,
  firstName: String,           // required, trim, max 50
  lastName: String,            // required, trim, max 50
  email: String,               // required, unique, lowercase, indexed
  phone: String,               // unique, sparse, indexed
  password: String,            // bcrypt hashed, nullable (OAuth users)
  avatar: { url: String, publicId: String },
  role: ObjectId,              // ref → roles
  isEmailVerified: Boolean,    // default: false
  isPhoneVerified: Boolean,    // default: false
  isActive: Boolean,           // default: true
  isDeleted: Boolean,          // default: false
  lastLoginAt: Date,
  loginCount: Number,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  refreshTokens: [{
    token: String,
    device: String,
    ip: String,
    createdAt: Date,
    expiresAt: Date,
  }],
  metadata: Object,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: email (unique), phone (sparse unique), role, isActive, createdAt
```

#### roles
```javascript
{
  _id: ObjectId,
  name: String,                // required, unique (CUSTOMER, ADMIN, etc.)
  displayName: String,
  description: String,
  level: Number,               // hierarchy: 0=CUSTOMER, 5=SUPER_ADMIN
  permissions: [ObjectId],     // ref → permissions
  isActive: Boolean,
  isDefault: Boolean,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: name (unique), level
```

#### permissions
```javascript
{
  _id: ObjectId,
  name: String,                // unique (e.g., "products:create")
  resource: String,            // e.g., "products"
  action: String,              // e.g., "create"
  description: String,
  module: String,              // for grouping in admin UI
  createdAt: Date,
}
// Indexes: name (unique), resource+action compound
```

#### addresses
```javascript
{
  _id: ObjectId,
  userId: ObjectId,            // ref → users
  firstName: String,
  lastName: String,
  phone: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  pincode: String,             // 6 digits
  country: String,             // default: "India"
  landmark: String,
  isDefault: Boolean,
  type: String,                // enum: ["home", "work", "other"]
  gstin: String,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: userId, userId+isDefault compound
```

#### products
```javascript
{
  _id: ObjectId,
  name: String,                // required, trim, max 200
  slug: String,                // required, unique, auto-generated
  sku: String,                 // required, unique
  barcode: String,             // sparse unique
  description: String,         // rich text (HTML)
  shortDescription: String,    // max 500 chars
  price: Number,               // required, min 0
  comparePrice: Number,        // strikethrough price
  costPrice: Number,           // for profit calculation
  currency: String,            // default: "INR"
  weight: String,              // display weight ("250g", "1kg")
  weightInGrams: Number,       // for shipping calculation
  categoryId: ObjectId,        // ref → categories
  hsnCode: String,             // for GST
  gstRate: Number,             // percentage
  tags: [String],
  images: [{
    url: String,
    publicId: String,
    alt: String,
    isPrimary: Boolean,
    sortOrder: Number,
  }],
  isFeatured: Boolean,
  isNew: Boolean,
  isBestseller: Boolean,
  isActive: Boolean,
  isDeleted: Boolean,
  status: String,              // enum: ["draft", "active", "archived"]
  metaTitle: String,
  metaDescription: String,
  averageRating: Number,       // denormalized
  totalReviews: Number,        // denormalized
  totalSold: Number,           // denormalized
  relatedProducts: [ObjectId],
  crossSellProducts: [ObjectId],
  upSellProducts: [ObjectId],
  wholesalePrice: Number,
  minOrderQuantity: Number,
  maxOrderQuantity: Number,
  metadata: Object,
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: slug (unique), sku (unique), barcode (sparse unique),
//   categoryId, tags, isActive+isDeleted, isFeatured+isActive,
//   name (text), description (text), tags (text) — text index,
//   price, averageRating, totalSold, createdAt
```

#### categories
```javascript
{
  _id: ObjectId,
  name: String,
  slug: String,                // unique
  description: String,
  image: { url: String, publicId: String },
  icon: String,
  parent: ObjectId,            // ref → categories (self-referential)
  ancestors: [{                // materialized path
    _id: ObjectId,
    name: String,
    slug: String,
  }],
  level: Number,               // depth level: 0 = root
  sortOrder: Number,
  isActive: Boolean,
  isDeleted: Boolean,
  metaTitle: String,
  metaDescription: String,
  productCount: Number,        // denormalized
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: slug (unique), parent, ancestors._id, sortOrder, isActive
```

#### inventory
```javascript
{
  _id: ObjectId,
  productId: ObjectId,         // ref → products
  warehouseId: ObjectId,       // ref → warehouses
  sku: String,
  quantity: Number,
  reservedQuantity: Number,    // default: 0
  lowStockThreshold: Number,
  reorderPoint: Number,
  batchNumber: String,
  manufacturingDate: Date,
  expiryDate: Date,
  costPrice: Number,
  status: String,              // enum: ["in_stock", "low_stock", "out_of_stock"]
  lastRestockedAt: Date,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: productId+warehouseId (unique compound), sku, status, expiryDate
// TTL index on expiryDate
```

#### orders
```javascript
{
  _id: ObjectId,
  orderNumber: String,         // unique, sequential (ORD-000001)
  userId: ObjectId,            // ref → users (nullable for guest)
  guestEmail: String,
  guestPhone: String,
  status: String,              // enum: order statuses
  paymentStatus: String,       // enum: ["pending", "awaiting", "paid", "failed", "refunded", "partially_refunded"]
  items: [{                    // embedded array (snapshot at order time)
    _id: ObjectId,
    productId: ObjectId,
    productName: String,
    sku: String,
    price: Number,
    quantity: Number,
    weight: String,
    images: [String],
    itemTotal: Number,
    discount: Number,
    tax: Number,
    hsnCode: String,
    gstRate: Number,
  }],
  subtotal: Number,
  discount: Number,
  couponCode: String,
  shippingCost: Number,
  tax: Number,
  total: Number,
  currency: String,
  shippingAddress: {           // embedded snapshot
    firstName: String,
    lastName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },
  billingAddress: Object,
  paymentMethod: String,
  paymentId: String,
  razorpayOrderId: String,
  refundId: String,
  refundAmount: Number,
  refundReason: String,
  trackingNumber: String,
  carrier: String,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancelReason: String,
  notes: String,
  internalNotes: String,
  statusHistory: [{
    status: String,
    timestamp: Date,
    note: String,
    updatedBy: ObjectId,
  }],
  invoiceNumber: String,
  invoiceUrl: String,
  isGift: Boolean,
  giftMessage: String,
  metadata: Object,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: orderNumber (unique), userId, status, paymentStatus,
//   createdAt, status+createdAt compound, guestEmail
```

#### payments
```javascript
{
  _id: ObjectId,
  orderId: ObjectId,
  userId: ObjectId,
  provider: String,            // enum: ["razorpay", "stripe", "cod", "wallet"]
  providerPaymentId: String,
  providerOrderId: String,
  amount: Number,              // in paise
  currency: String,
  status: String,              // enum: ["created", "authorized", "captured", "failed", "refunded"]
  method: String,              // upi, card, netbanking, wallet
  cardLast4: String,
  upiId: String,
  refundAmount: Number,
  refundStatus: String,
  refundId: String,
  refundReason: String,
  refundedAt: Date,
  webhookReceivedAt: Date,
  idempotencyKey: String,
  metadata: Object,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: orderId, userId, providerPaymentId (unique), status, idempotencyKey (unique)
```

#### coupons
```javascript
{
  _id: ObjectId,
  code: String,                // unique, uppercase
  description: String,
  discountType: String,        // enum: ["percentage", "fixed", "free_shipping"]
  discountValue: Number,
  minimumOrder: Number,
  maximumDiscount: Number,
  usageLimit: Number,
  usedCount: Number,
  perUserLimit: Number,
  applicableProducts: [ObjectId],
  applicableCategories: [ObjectId],
  excludedProducts: [ObjectId],
  isActive: Boolean,
  isDeleted: Boolean,
  startDate: Date,
  expiresAt: Date,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: code (unique), isActive+expiresAt, createdBy
```

#### reviews
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  productId: ObjectId,
  orderId: ObjectId,
  rating: Number,              // 1-5
  title: String,
  comment: String,
  images: [{ url: String, publicId: String }],
  isVerified: Boolean,
  isApproved: Boolean,
  isRejected: Boolean,
  helpfulCount: Number,
  notHelpfulCount: Number,
  adminResponse: {
    text: String,
    respondedAt: Date,
    respondedBy: ObjectId,
  },
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: productId+userId (unique), productId+isApproved, rating
```

#### blogs
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String,                // unique
  excerpt: String,
  content: String,             // rich text (HTML)
  featuredImage: { url: String, publicId: String, alt: String },
  author: ObjectId,
  category: String,
  tags: [String],
  status: String,              // enum: ["draft", "review", "published", "archived"]
  publishedAt: Date,
  readingTime: Number,
  viewCount: Number,
  shareCount: Number,
  metaTitle: String,
  metaDescription: String,
  ogImage: String,
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: slug (unique), author, status+publishedAt, tags, category
```

#### recipes
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String,                // unique
  description: String,
  featuredImage: { url: String, publicId: String },
  ingredients: [{
    productId: ObjectId,
    productName: String,
    quantity: String,
    isOptional: Boolean,
  }],
  instructions: [String],
  prepTime: Number,
  cookTime: Number,
  totalTime: Number,
  servings: Number,
  difficulty: String,          // enum: ["easy", "medium", "hard"]
  cuisine: String,
  images: [{ url: String, publicId: String, alt: String }],
  tags: [String],
  author: ObjectId,
  status: String,
  viewCount: Number,
  likeCount: Number,
  metaTitle: String,
  metaDescription: String,
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: slug (unique), author, status, tags, cuisine, difficulty
```

#### notifications
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: String,                // enum: ["order_update", "promo", "system", "stock_alert", "review"]
  title: String,
  message: String,
  data: Object,
  channels: {
    inApp: { sent: Boolean, read: Boolean, readAt: Date },
    email: { sent: Boolean, sentAt: Date, error: String },
    sms: { sent: Boolean, sentAt: Date, error: String },
    whatsapp: { sent: Boolean, sentAt: Date, error: String },
  },
  isRead: Boolean,
  readAt: Date,
  isDeleted: Boolean,
  createdAt: Date,
}
// TTL index: createdAt with 90-day expiry
// Indexes: userId+isRead, userId+createdAt, type
```

#### employees
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  employeeId: String,          // unique (EMP-001)
  department: String,          // enum: ["operations", "support", "marketing", "warehouse", "finance"]
  designation: String,
  roleId: ObjectId,
  reportingTo: ObjectId,
  joiningDate: Date,
  salary: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: employeeId (unique), userId, department, reportingTo
```

#### warehouses
```javascript
{
  _id: ObjectId,
  name: String,
  code: String,                // unique (WH-001)
  address: {
    addressLine1: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: "India" },
  },
  contactPerson: String,
  phone: String,
  email: String,
  type: String,                // enum: ["main", "regional", "fulfillment"]
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: code (unique), pincode, isActive
```

#### shipments
```javascript
{
  _id: ObjectId,
  orderId: ObjectId,
  carrier: String,
  trackingNumber: String,
  trackingUrl: String,
  status: String,
  weight: Number,
  dimensions: { length: Number, width: Number, height: Number },
  shippingCost: Number,
  estimatedDelivery: Date,
  actualDelivery: Date,
  originWarehouse: ObjectId,
  events: [{
    status: String,
    location: String,
    timestamp: Date,
    description: String,
  }],
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: orderId, trackingNumber (unique), status, carrier
```

#### audit_logs
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  action: String,
  entity: String,
  entityId: ObjectId,
  changes: { before: Object, after: Object },
  ipAddress: String,
  userAgent: String,
  requestId: String,
  metadata: Object,
  createdAt: Date,             // TTL: 365 days
}
// TTL index: createdAt with 365-day expiry
// Indexes: userId, entity+entityId, action, createdAt
```

#### seo_metadata
```javascript
{
  _id: ObjectId,
  pageType: String,
  entityId: ObjectId,
  slug: String,
  metaTitle: String,
  metaDescription: String,
  ogTitle: String,
  ogDescription: String,
  ogImage: String,
  canonicalUrl: String,
  structuredData: Object,
  noIndex: Boolean,
  noFollow: Boolean,
  redirects: [{ from: String, to: String }],
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: pageType+entityId (unique), slug
```

#### media
```javascript
{
  _id: ObjectId,
  fileName: String,
  originalName: String,
  mimeType: String,
  size: Number,
  url: String,
  publicId: String,
  folder: String,
  width: Number,
  height: Number,
  format: String,
  thumbnails: [{ size: String, url: String, publicId: String }],
  alt: String,
  caption: String,
  uploadedBy: ObjectId,
  usageCount: Number,
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: folder, mimeType, uploadedBy, isDeleted, createdAt
```

#### settings
```javascript
{
  _id: ObjectId,
  group: String,
  key: String,
  value: Object,
  type: String,
  isPublic: Boolean,
  description: String,
  updatedBy: ObjectId,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: group+key (unique)
```

#### newsletter_subscribers
```javascript
{
  _id: ObjectId,
  email: String,               // unique
  userId: ObjectId,
  status: String,              // enum: ["active", "unsubscribed", "bounced"]
  source: String,
  tags: [String],
  subscribedAt: Date,
  unsubscribedAt: Date,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: email (unique), status
```

#### support_tickets
```javascript
{
  _id: ObjectId,
  ticketNumber: String,        // unique (TKT-000001)
  userId: ObjectId,
  orderId: ObjectId,
  subject: String,
  description: String,
  category: String,
  priority: String,
  status: String,
  assignedTo: ObjectId,
  messages: [{
    senderId: ObjectId,
    senderType: String,
    message: String,
    attachments: [{ url: String, publicId: String }],
    createdAt: Date,
  }],
  resolution: String,
  resolvedAt: Date,
  closedAt: Date,
  slaDeadline: Date,
  tags: [String],
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: ticketNumber (unique), userId, status, assignedTo, priority
```

#### affiliate_accounts
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  affiliateCode: String,       // unique
  commissionRate: Number,
  tier: String,
  totalEarnings: Number,
  pendingPayout: Number,
  paidAmount: Number,
  totalReferrals: Number,
  totalConversions: Number,
  status: String,
  payoutMethod: String,
  payoutDetails: Object,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: userId (unique), affiliateCode (unique), status
```

#### loyalty_transactions
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: String,                // enum: ["earn", "redeem", "expire", "adjust"]
  points: Number,
  balance: Number,
  source: String,
  referenceId: ObjectId,
  description: String,
  expiresAt: Date,
  createdAt: Date,
}
// TTL index: expiresAt
// Indexes: userId+type, userId+createdAt
```

#### referral_records
```javascript
{
  _id: ObjectId,
  referrerId: ObjectId,
  referredId: ObjectId,
  referralCode: String,
  status: String,
  rewardPoints: Number,
  firstOrderAmount: Number,
  referredAt: Date,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: referrerId, referredId, referralCode, status
```

### Soft Delete Strategy

All entities that represent business data use soft delete:

```javascript
{
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
}

// Query pattern:
Model.find({ isDeleted: { $ne: true } })      // Normal queries
Model.find({ isDeleted: true })                // Trash/restore
```

**Exception:** `audit_logs` and `notifications` use TTL-based auto-deletion, not soft delete.

### Timestamps

All collections include:
```javascript
{
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}
```

Mongoose `timestamps: true` option is used where applicable.
