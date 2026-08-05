# Orpind — Complete Project Documentation

> **Brand**: Orpind Foods Pvt. Ltd. — "Premium Organic Spices & Grains from Punjab"  
> **Stack**: Next.js 15 + Express + Prisma (SQLite dev / PostgreSQL prod) + MongoDB + Redis  
> **Frontend**: `localhost:3000` | **Backend**: `localhost:4000`

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Setup & Installation](#3-setup--installation)
4. [Configuration](#4-configuration)
5. [Database](#5-database)
6. [Authentication](#6-authentication)
7. [Payment System](#7-payment-system)
8. [Email System](#8-email-system)
9. [API Reference](#9-api-reference)
10. [Policies](#10-policies)
11. [Admin Guide](#11-admin-guide)
12. [Frontend Guide](#12-frontend-guide)
13. [Backend Guide](#13-backend-guide)
14. [Testing](#14-testing)
15. [Deployment](#15-deployment)
16. [FAQ](#16-faq)

---

## 1. Project Overview

### 1.1 Business Vision

Orpind brings authentic Punjabi organic spices and grains directly from farm to kitchen. The platform bridges traditional Indian agriculture with modern e-commerce, preserving the heritage of Punjab's spice craftsmanship while offering a seamless digital shopping experience.

### 1.2 Brand Identity

| Element | Detail |
|---------|--------|
| Tagline | Premium Organic Spices & Grains from Punjab |
| Tone | Warm, authentic, heritage-rich, trustworthy |
| Visual | Earthy palette (olive green, amber gold, cream, leather brown), serif typography |
| Promise | Farm-fresh, handpicked, traditionally crafted, chemical-free |

### 1.3 Target Users

| Persona | Needs |
|---------|-------|
| Health-conscious home cook | Organic certification, ingredient transparency, recipe ideas |
| Punjabi diaspora | Authentic regional spices, traditional packaging |
| Restaurant chef | Bulk pricing, consistent quality, reliable delivery |
| Gift buyer | Premium packaging, curated sets, gift notes |

### 1.4 Business Info

| Field | Value |
|-------|-------|
| Company | Orpind Foods Pvt. Ltd. |
| Email | mohitchetiwal291@gmail.com |
| Phone | +91 62833 48561 |
| Address | GT Road, Phagwara, Punjab, India - 144401 |
| WhatsApp | +916283348561 |
| FSSAI | FSSAI License No: 12345678901234 |
| GSTIN | 03XXXXXXXXX |
| Social | [Instagram](https://instagram.com/orpind), [Facebook](https://facebook.com/orpind), [Twitter](https://twitter.com/orpind), [YouTube](https://youtube.com/@orpind) |

---

## 2. Architecture

### 2.1 System Topology

```
User Browser
  ├── Next.js 15 (Port 3000) — Storefront, API Routes
  │     ├── Prisma → SQLite (dev) / PostgreSQL (prod)
  │     ├── Razorpay / Stripe SDK
  │     └── Resend (Email)
  └── Express API (Port 4000) — Admin Backend
        ├── Mongoose → MongoDB (MongoMemoryServer dev / Atlas prod)
        └── Redis (Upstash / planned)
```

### 2.2 Database Split

| Database | Technology | Purpose | Location |
|----------|-----------|---------|----------|
| Primary | Prisma (SQLite/PostgreSQL) | Users, orders, products, sessions, verification codes | Next.js app |
| Secondary | Mongoose (MongoDB) | Permissions, roles, inventory, warehouse, settings | Express backend |

### 2.3 Payment Flow (3 Methods)

1. **Razorpay** — `POST /api/payments` → Razorpay order → JS SDK → webhook `POST /api/payments/webhook`
2. **Stripe** — `POST /api/payments/stripe` → PaymentIntent → Stripe Elements → webhook `POST /api/payments/stripe-webhook`
3. **COD** — Order placed directly, `paymentStatus = PENDING`

### 2.4 Folder Structure

```
orpind-website/
├── src/                          # Next.js frontend
│   ├── app/                      # App Router pages & API routes
│   │   ├── api/                  # API route handlers
│   │   ├── auth/                 # Login, register, verify pages
│   │   ├── checkout/             # Checkout page
│   │   ├── shop/                 # Product listing & detail
│   │   ├── admin/                # Admin dashboard (17 sub-pages)
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Tailwind styles
│   ├── components/
│   │   ├── layout/               # Navbar, Footer
│   │   ├── checkout/             # StripeCheckoutForm
│   │   ├── home/                 # Homepage sections
│   │   ├── shop/                 # ProductCard, ProductFilters, ProductGrid
│   │   └── ui/                   # Reusable UI (26 base components)
│   ├── context/                  # AuthContext, CartContext, WishlistContext
│   ├── lib/                      # Utilities (auth, db, email, payment, validation)
│   ├── data/products.ts          # Static product & site data
│   └── types/index.ts            # TypeScript types
├── backend/                      # Express API
│   └── src/
│       ├── config/               # env, database, redis, sentry config
│       ├── controllers/          # Route handlers
│       ├── services/             # Business logic
│       ├── repositories/        # Mongoose data access
│       ├── models/               # Mongoose schemas
│       └── routes/v1/            # Express route definitions
├── prisma/                       # Prisma schema & migrations
├── public/                       # Static assets (images, SVGs)
└── scripts/                      # Seed scripts
```

---

## 3. Setup & Installation

### 3.1 Prerequisites

- Node.js 20+
- npm

### 3.2 Clone & Install

```bash
git clone <repo-url> orpind-website
cd orpind-website

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3.3 Environment Files

Create `.env` (frontend root):

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-32-char-jwt-secret"
JWT_REFRESH_SECRET="your-32-char-refresh-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
RESEND_API_KEY="re_..."
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
SMTP_FROM="delivered@resend.dev"
```

Create `backend/.env`:

```env
PORT=4000
NODE_ENV=development
JWT_SECRET="your-backend-jwt-secret"
JWT_REFRESH_SECRET="your-backend-refresh-secret"
MONGO_URI="mongodb+srv://..."
```

### 3.4 Database Setup

```bash
# Push Prisma schema to SQLite
npm run db:push

# Generate Prisma client
npm run db:generate
```

### 3.5 Start Dev Servers

```bash
# Terminal 1 — Frontend (port 3000)
npm run dev

# Terminal 2 — Backend (port 4000)
cd backend && npm run dev
```

### 3.6 Windows Scheduled Tasks (Auto-Start)

Two tasks are configured to auto-start on boot:

| Task Name | Command | Working Directory |
|-----------|---------|-------------------|
| `OrpindFrontend` | `npm run dev` | `C:\Users\Pawan\Desktop\orpind-website` |
| `OrpindBackend` | `npm run dev` | `C:\Users\Pawan\Desktop\orpind-website\backend` |

---

## 4. Configuration

### 4.1 Key Config Values

| Setting | Value |
|---------|-------|
| Frontend URL | `http://localhost:3000` |
| Backend URL | `http://localhost:4000` |
| JWT Access Token Expiry | 15 minutes |
| JWT Refresh Token Expiry | 7 days |
| OTP Length | 6 digits |
| OTP Expiry | 10 minutes |
| Free Shipping Threshold | ₹999 |
| Default Shipping Fee | ₹49 (₹99 for North-East) |

### 4.2 Product Categories

| Category | Slug | Products |
|----------|------|----------|
| Whole Spices | whole-spices | 24 |
| Ground Spices | ground-spices | 18 |
| Spice Blends | spice-blends | 12 |
| Premium Grains | grains | 15 |
| Flours | flours | 8 |
| Herbs & Seasonings | herbs | 10 |
| Gift Sets | gift-sets | 6 |

### 4.3 Design Tokens

- **Colors**: Green, Gold, Brown, Beige, Neutral (50–900 shades)
- **Font Display**: Cormorant Garamond (headings)
- **Font Body**: Baskerville Old Face / system-ui
- **Accent**: Gold-500 (#D7A349)

---

## 5. Database

### 5.1 Prisma Models

| Model | Key Fields | Relations |
|-------|-----------|-----------|
| User | id, email, password, firstName, lastName, phone, role, isVerified | 1:N → Order, Review, Address, CartItem, WishlistItem |
| Order | id, orderNumber, status, total, paymentStatus, paymentMethod | N:1 → User, 1:N → OrderItem |
| OrderItem | id, quantity, price | N:1 → Order, Product |
| Product | id, name, slug, price, category, stock, weight | 1:N → OrderItem, Review |
| Category | id, name, slug, parentId | Self-referencing tree |
| Address | id, line1, city, state, pincode, isDefault | N:1 → User |
| Review | id, rating, title, comment | N:1 → User, Product |
| VerificationCode | id, email, code, expiresAt, usedAt | — |
| Session | id, userId, accessToken, refreshToken | N:1 → User |
| CartItem | id, quantity | N:1 → User, Product |
| WishlistItem | id | N:1 → User, Product |
| Coupon | id, code, discountType, discountValue | — |
| AuditLog | id, userId, action, entity, entityId | — |

### 5.2 Backend MongoDB Models

- User, Session, Product, Category, Review, Order, OrderItem, Address, CartItem, WishlistItem
- BlogPost, Coupon, Banner, Inventory, AuditLog, SEO
- WholesaleInquiry, Recipe, Referral, LoyaltyPoint, SupportTicket

---

## 6. Authentication

### 6.1 Flow

```
Register → POST /api/auth/register → Create user (isVerified: false) → Generate OTP →
Store in VerificationCode → Send OTP via email / show devOtp → 
Redirect to /auth/verify?email= → User enters OTP →
POST /api/auth/verify-otp → Mark isVerified: true → Create session → Set cookies →
Redirect to /account

Login → POST /api/auth/login → Validate credentials → Check isVerified →
Create session → Set cookies → Redirect to /account

Logout → POST /api/auth/logout → Clear cookies → Destroy session → Redirect to /
```

### 6.2 Dev Mode OTP

Resend free tier only sends to `mohitchetiwal291@gmail.com`. For other emails, the register endpoint returns `devOtp` in the response, and the verify page displays it in an amber-colored box.

### 6.3 JWT Implementation

| Token | Expiry | Payload | Cookie |
|-------|--------|---------|--------|
| Access | 15 min | `{ id, role, email, firstName, lastName }` | httpOnly, secure (prod), sameSite=lax |
| Refresh | 7 days | `{ id, type: 'refresh' }` | httpOnly, secure (prod), sameSite=lax |

### 6.4 RBAC Roles

| Role | Permissions |
|------|------------|
| CUSTOMER | View products, create orders, manage own profile, write reviews |
| WHOLESALE | CUSTOMER + view wholesale pricing, place bulk orders |
| EMPLOYEE | View admin dashboard, manage orders, update stock |
| MANAGER | EMPLOYEE + create/edit products, manage categories, view reports |
| ADMIN | MANAGER + manage employees, coupons, settings, audit logs |
| SUPER_ADMIN | Full system access, role assignments, deletion |

---

## 7. Payment System

### 7.1 Razorpay

- **Order creation**: `POST /api/payments` → creates Razorpay order with amount in paise
- **Frontend**: Razorpay JS SDK opens checkout modal
- **Webhook**: `POST /api/payments/webhook` — verifies HMAC-SHA256 signature, updates order status
- **Status**: `payment.paid` → marks order as PAID, `payment.failed` → marks as FAILED

### 7.2 Stripe

- **PaymentIntent**: `POST /api/payments/stripe` → creates PaymentIntent with amount in cents
- **Frontend**: Stripe Elements in `StripeCheckoutForm.tsx`
- **Webhook**: `POST /api/payments/stripe-webhook` — verifies webhook secret, processes `payment_intent.succeeded`
- **Note**: `STRIPE_WEBHOOK_SECRET` needs to be configured for webhook verification

### 7.3 COD

- Order placed with `paymentMethod: 'cod'`, `paymentStatus: 'PENDING'`
- Amount collected at delivery
- No payment gateway interaction

---

## 8. Email System

### 8.1 Provider: Resend

| Setting | Value |
|---------|-------|
| API Key | `RESEND_API_KEY` in `.env` |
| From Email | `delivered@resend.dev` |
| Free Tier Limit | 100 emails/day, only to account owner |

### 8.2 Email Templates

| Template | Trigger | Includes |
|----------|---------|----------|
| OTP | Registration | 6-digit code, 10-min expiry |
| Order Confirmation | Order placed | Order number, items summary, total |
| Shipping Update | Status change | Tracking number, carrier, link |
| Password Reset | Forgot password | Reset link with token |

### 8.3 Dev Mode Fallback

When sending to an email other than the account owner fails (403), the OTP is returned in the API response as `devOtp` and shown on-screen in an amber box on the verify page.

---

## 9. API Reference

### 9.1 Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/verify-otp` | Verify email OTP | Public |
| POST | `/api/auth/resend-otp` | Resend verification OTP | Public |
| POST | `/api/auth/login` | Login | Public |
| POST | `/api/auth/logout` | Logout | Auth |
| GET | `/api/auth/me` | Get current user | Auth |

### 9.2 Products & Shop

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List products (paginated, filtered) | Public |
| GET | `/api/products/featured` | Featured products | Public |
| GET | `/api/products/[slug]` | Product detail | Public |
| GET | `/api/categories` | List categories | Public |

### 9.3 Cart & Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/cart` | Add to cart | Auth |
| GET | `/api/cart` | Get cart items | Auth |
| POST | `/api/orders` | Create order | Auth |
| GET | `/api/orders` | List user orders | Auth |

### 9.4 Payments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/payments` | Create Razorpay order | Auth |
| POST | `/api/payments/webhook` | Razorpay webhook | Public (signature verified) |
| POST | `/api/payments/stripe` | Create Stripe PaymentIntent | Auth |
| POST | `/api/payments/stripe-webhook` | Stripe webhook | Public (signature verified) |

### 9.5 User

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/user/profile` | Update profile | Auth |
| POST | `/api/user/address` | Add address | Auth |
| PUT | `/api/user/address/[id]` | Update address | Auth |
| DELETE | `/api/user/address/[id]` | Delete address | Auth |

### 9.6 Other

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/contact` | Contact form | Public |
| POST | `/api/newsletter` | Subscribe to newsletter | Public |
| POST | `/api/coupons/validate` | Validate coupon | Public |
| GET | `/api/shipping/check` | Check shipping availability | Public |
| GET | `/api/blog` | List blog posts | Public |

### 9.7 Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET/POST | `/api/admin/products` | List/Create products | Admin |
| GET/PUT/DELETE | `/api/admin/products/[id]` | Get/Update/Delete product | Admin |
| GET/POST | `/api/admin/orders` | List/Create orders | Admin |
| GET/PUT | `/api/admin/orders/[id]` | Get/Update order | Admin |
| GET | `/api/admin/customers` | List customers | Admin |
| GET/POST | `/api/admin/coupons` | List/Create coupons | Admin |
| PUT/DELETE | `/api/admin/coupons/[id]` | Update/Delete coupon | Admin |
| GET | `/api/admin/analytics` | Dashboard analytics | Admin |

### 9.8 Response Format

**Next.js routes**: `NextResponse.json({ ... })`

**Express routes**:
```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "limit": 12, "total": 100 }
}
```

**Error format**:
```json
{
  "error": "Error message",
  "details": { ... }  // validation errors, optional
}
```

---

## 10. Policies

### 10.1 Terms of Service

**Last Updated**: March 15, 2024

**Acceptance of Terms**
- By using orpind.com, you accept these Terms of Service
- You must be at least 18 years of age
- We reserve the right to modify terms; continued use constitutes acceptance

**Use of Website**
- Lawful purposes only
- No spam, unauthorized access, or infringement of others' rights
- We may terminate access at any time without notice

**Products & Pricing**
- Prices in INR, inclusive of applicable taxes
- We reserve the right to change prices; changes don't affect confirmed orders
- Product descriptions are for reference; we don't warrant accuracy

**Orders & Payment**
- Placing an order constitutes an offer to purchase
- We may accept or decline any order
- Payment methods: UPI, credit/debit cards, net banking, wallets, COD
- We do not store payment card details

**Returns & Refunds**
- 7-day return policy for unopened/unused products in original packaging
- Refunds processed within 5-7 business days after inspection
- Shipping costs non-refundable unless our error
- Opened spices and perishable items not eligible

**Intellectual Property**
- All content is property of Orpind Foods Pvt. Ltd.
- Orpind name, logo, and product names are trademarks
- No reproduction without express written consent

**Limitation of Liability**
- Orpind not liable for indirect, incidental, or consequential damages
- Total liability limited to amount paid in the preceding 12 months
- Not liable for allergic reactions or health issues from individual sensitivities

**Governing Law**
- Governed by laws of India
- Disputes subject to jurisdiction of courts in Phagwara, Punjab

### 10.2 Privacy Policy

**Last Updated**: March 15, 2024

**Information Collection**
- Personal information you provide (name, email, phone, shipping/billing address, payment info)
- Automatically collected data (IP address, browser type, OS, referring URLs, pages viewed)
- Cookies and similar tracking technologies

**Use of Information**
- Process and fulfill orders
- Communicate about products, services, promotions
- Improve website and products
- Detect and prevent fraudulent transactions

**Data Sharing**
- Third-party service providers (payment processing, order fulfillment, shipping, email delivery)
- Business partners for marketing (with consent)
- Legal requirements
- Business transfers (merger, acquisition)

**Data Security**
- Encryption in transit (SSL/TLS)
- Secure server infrastructure
- Regular security audits
- No method of transmission is 100% secure

**Cookies**
- Essential cookies (cannot be disabled)
- Analytics cookies
- Marketing cookies
- Browser settings can control cookies

**Third-Party Links**
- We are not responsible for third-party privacy practices
- We encourage reading privacy statements of other sites

**Children's Privacy**
- Not intended for children under 18
- We do not knowingly collect information from children under 18
- Contact us if you believe a child under 18 has provided personal information

### 10.3 Shipping Policy

**Coverage**: Pan-India shipping to all serviceable pin codes

**Shipping Rates**

| Region | Rate | Delivery Time | Free Above |
|--------|------|--------------|------------|
| Punjab, Haryana, Chandigarh | ₹49 | 2-3 business days | ₹999 |
| Delhi NCR | ₹49 | 2-3 business days | ₹999 |
| North India (UP, HP, J&K, UK) | ₹49 | 3-4 business days | ₹999 |
| West India (Rajasthan, Gujarat, Maharashtra) | ₹49 | 3-5 business days | ₹999 |
| South India (Karnataka, TN, Kerala, AP) | ₹49 | 4-5 business days | ₹999 |
| East India (West Bengal, Odisha, Bihar, Jharkhand) | ₹49 | 4-6 business days | ₹999 |
| North-East India (Assam, Meghalaya, etc.) | ₹99 | 5-7 business days | ₹1499 |

**Delivery Options**

| Type | Timeframe | Availability |
|------|-----------|--------------|
| Standard | 3-5 business days | All India. Free above ₹999 |
| Express | 1-2 business days | Select metro cities |
| Same-Day | Within 6 hours | Coming soon (Chandigarh, Phagwara) |

**Order Tracking**
- Tracking link via SMS and email after dispatch
- Track from account dashboard at `/account`
- Real-time updates from logistics partners

**Damaged in Transit**
- Take clear photos of damaged packaging and items
- Contact us within 48 hours of delivery
- Free pickup and replacement or refund

**International Shipping**: Coming soon (subscribe to newsletter for updates)

### 10.4 Return Policy

**Return Eligibility**
- ✓ Unopened and unused products
- ✓ Items in original sealed packaging
- ✓ Wrong items delivered
- ✓ Damaged or defective products
- ✓ Items returned within 7 days of delivery
- ✗ Opened or used spice packets
- ✗ Perishable goods
- ✗ Gift cards and digital products
- ✗ Free promotional items
- ✗ Clearance sale items
- ✗ Custom or personalized orders

**How to Initiate a Return**
1. **Contact Us** — Within 7 days of delivery via email or WhatsApp with order number
2. **Get Approval** — We provide return instructions and authorization number
3. **Pack & Ship** — Pack securely in original packaging, ship to provided address
4. **Receive Refund** — Refund processed within 5-7 business days after inspection

**Refund Process**
- Refund to original payment method (bank transfer or store credit for COD)
- Shipping charges non-refundable unless our error
- Notification email sent once processed

**Exchange Policy**
- Items of equal or lesser value
- Subject to product availability
- Price difference refunded or charged accordingly

**Return Timeline**
- Report within: 7 days of delivery
- Ship within: 5 days of return approval
- Refund in: 5-7 business days after inspection

---

## 11. Admin Guide

### 11.1 Dashboard (`/admin`)

Metrics displayed:
- Revenue (today, week, month, all-time with trends)
- Orders (total, pending, processing, delivered — 30-day bar chart)
- Users (new registrations, total customers — line chart)
- Top products (by revenue, by quantity)
- Low stock alerts

### 11.2 Pages

| Page | URL | Description |
|------|-----|-------------|
| Analytics | `/admin` | KPIs and charts |
| Products | `/admin/products` | CRUD product management |
| Inventory | `/admin/inventory` | Stock tracking and adjustments |
| Orders | `/admin/orders` | Order management with status updates |
| Customers | `/admin/customers` | Customer list and detail view |
| Categories | `/admin/categories` | Category tree management |
| Coupons | `/admin/coupons` | Discount code management |
| Blog | `/admin/blog` | Blog post management |
| Banners | `/admin/banners` | Homepage banner management |
| Reviews | `/admin/reviews` | Review moderation |
| Employees | `/admin/employees` | Role and employee management |
| Reports | `/admin/reports` | Sales, product, tax reports |
| Settings | `/admin/settings` | Site configuration |
| Media | `/admin/media` | Image uploads |
| Audit Logs | `/admin/audit-logs` | Immutable action log |
| Tax | `/admin/tax` | GST/HSN configuration |
| Shipping | `/admin/shipping` | Shipping rules configuration |

### 11.3 Order Statuses

PLACED → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
Any status → CANCELLED (if within cancellation window)

### 11.4 Payment Statuses

PENDING → PAID → FAILED → REFUNDED

---

## 12. Frontend Guide

### 12.1 Pages & Routes

| URL | Page | Type |
|-----|------|------|
| `/` | Homepage | Server + Client sections |
| `/shop` | Product listing | Client (search, filter, sort, pagination) |
| `/shop/[slug]` | Subcategory | Client |
| `/products/[slug]` | Product detail | Client (images, info, reviews) |
| `/cart` | Cart | Client |
| `/checkout` | Checkout | Client (auth-guarded) |
| `/account` | Dashboard | Client (auth-guarded) |
| `/admin/*` | Admin | Client (role-guarded) |
| `/auth/login` | Login | Client |
| `/auth/register` | Register | Client |
| `/auth/verify` | OTP verification | Client |
| `/blog` | Blog listing | Client |
| `/about` | About us | Server |
| `/contact` | Contact form | Client |
| `/faq` | FAQ | Client |
| `/terms` | Terms of Service | Server |
| `/privacy` | Privacy Policy | Server |
| `/shipping-policy` | Shipping Policy | Server |
| `/returns` | Return Policy | Server |
| `/wholesale` | Wholesale inquiry | Client |

### 12.2 State Management

| State | Strategy | Location |
|-------|----------|----------|
| Auth | React Context | `AuthContext.tsx` |
| Cart | React Context + localStorage | `CartContext.tsx` |
| Wishlist | React Context + localStorage | `WishlistContext.tsx` |
| Server | Direct fetch via `lib/api.ts` | Per page |
| Form | Local useState | Per component |
| UI | Local useState | Per component |

### 12.3 UI Components (26 Base)

| Category | Components |
|----------|------------|
| Layout | Accordion, Drawer, Modal, Tabs, Breadcrumb, Pagination, Timeline |
| Input | Button, Input, Checkbox, RadioButton, Toggle, QuantityStepper, SearchBar |
| Feedback | Badge, Toast, Skeleton, ProgressBar, StarRating |
| Display | Card, Carousel, ImageGallery, Dropdown |
| Marketing | Newsletter, TrustBar, WhatsAppButton |

---

## 13. Backend Guide

### 13.1 Express Middleware Stack

```
helmet → cors → rate-limit → body-parser → cookie-parser → morgan → routes → error-handler
```

### 13.2 Service Layers

```
Route (validation) → Controller (request handling) → Service (business logic) → Repository (data access) → MongoDB
```

### 13.3 Background Jobs (BullMQ — Future)

| Job | Queue | Trigger |
|-----|-------|---------|
| Send email | email | On event |
| Generate invoice | invoice | Order placed |
| Cache warm | cache | Product update |
| Data export | export | Admin request |
| Send notification | notification | On event |
| Process refund | refund | Cancellation |
| Cleanup sessions | cleanup | Every 6 hours |

---

## 14. Testing

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Jest | Services, utilities, validation |
| Integration | Supertest + Jest | API endpoints |
| E2E | Playwright | Critical user journeys |
| Accessibility | axe-core | WCAG 2.1 AA |
| Performance | Lighthouse | LCP < 2s, FCP < 1.5s |

**Key Commands**:

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | root | Start Next.js (port 3000) |
| `npm run dev` | backend/ | Start Express (port 4000) |
| `npm run db:push` | root | Push Prisma schema |
| `npm run db:generate` | root | Generate Prisma client |
| `npm run lint` | root | Run ESLint |
| `npm run typecheck` | root | Run TypeScript check |

---

## 15. Deployment

### 15.1 Production Architecture

| Component | Service |
|-----------|---------|
| Frontend | Vercel (Next.js 15) |
| Backend | Railway (Express, Docker) |
| Primary DB | Neon PostgreSQL |
| Secondary DB | MongoDB Atlas |
| Cache | Redis (Upstash / Railway) |
| Files | AWS S3 + CloudFront CDN |
| Email | Resend |

### 15.2 Production Environment Variables

```
DATABASE_URL                 # PostgreSQL connection string
JWT_SECRET                   # Min 32 chars
JWT_REFRESH_SECRET           # Different from JWT_SECRET
NEXT_PUBLIC_SITE_URL         # https://orpind.com
RAZORPAY_KEY_ID              # Live keys
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
RESEND_API_KEY
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_S3_BUCKET
SENTRY_DSN
REDIS_URL
CDN_URL
```

### 15.3 Vercel (Frontend)

- Framework preset: Next.js
- Build command: `npm run build`
- Node version: 20.x
- Region: Mumbai (ap-south-1)
- Domains: Custom domain with Vercel DNS

### 15.4 Railway (Backend)

- Start command: `node src/server.js`
- Port: 4000
- Health check: `/api/health`
- Replicas: Min 1, Max 3 (auto-scale)

### 15.5 Security Headers (Production)

```http
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: origin-when-cross-origin
Strict-Transport-Security: max-age=63072000
Content-Security-Policy: (per environment)
```

---

## 16. FAQ

### General

**Q: What makes Orpind spices organic?**
A: Our spices are sourced directly from certified organic farms in Punjab. We conduct regular quality checks and maintain FSSAI certification.

**Q: Where is Orpind based?**
A: We are based in Phagwara, Punjab, India. Our spices are sourced from local farmers across the Punjab region.

**Q: Is Orpind FSSAI certified?**
A: Yes. Our FSSAI License No: 12345678901234.

### Orders

**Q: How do I place an order?**
A: Browse products, add to cart, proceed to checkout, enter shipping address, choose payment method (UPI, card, COD, etc.), and confirm.

**Q: Can I modify or cancel my order?**
A: Contact us within 1 hour of placing the order. Once processed, modifications cannot be guaranteed.

**Q: How do I track my order?**
A: You'll receive a tracking link via SMS and email after dispatch. You can also track from your account dashboard.

### Shipping

**Q: How long does delivery take?**
A: Standard delivery takes 3-5 business days across India. Express delivery (1-2 days) is available in select metro cities.

**Q: Do you offer free shipping?**
A: Yes, free shipping on all orders above ₹999. Standard shipping fee is ₹49 (₹99 for North-East India).

**Q: Do you ship internationally?**
A: Not yet. International shipping is coming soon. Subscribe to our newsletter for updates.

### Returns

**Q: What is the return policy?**
A: We accept returns within 7 days for unopened and unused products in their original packaging. See full [Return Policy](#104-return-policy) for details.

**Q: How long do refunds take?**
A: Refunds are processed within 5-7 business days after we receive and inspect the returned items.

**Q: What if I receive a damaged or wrong item?**
A: Contact us within 48 hours with photos. We'll arrange a free pickup and send a replacement or issue a full refund.

### Wholesale

**Q: Do you offer bulk/wholesale pricing?**
A: Yes, we offer wholesale pricing for restaurants, retailers, and distributors. Visit our wholesale page or contact us for a custom quote.

**Q: What is the minimum order for wholesale?**
A: Minimum wholesale order is typically 5kg per product variant. Contact us for specific requirements.

---

## Contact

| Channel | Details |
|---------|---------|
| Email | mohitchetiwal291@gmail.com |
| Phone | +91 62833 48561 |
| WhatsApp | wa.me/916283348561 |
| Address | GT Road, Phagwara, Punjab, India - 144401 |
| Social | Instagram, Facebook, Twitter, YouTube @orpind |

---

© 2024 Orpind Foods Pvt. Ltd. All rights reserved.
