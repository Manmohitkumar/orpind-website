# ORPIND — Master Specification Document

> **Project**: Premium Organic Spices & Grains E-Commerce Platform  
> **Brand**: ORPIND Foods Pvt. Ltd.  
> **Current Phase**: 7 (All phases complete)  
> **Stack**: Next.js 15 + Express + Prisma/SQLite (dev) / PostgreSQL (prod) + MongoDB + Redis

---

## Section 1 — AI Role & Operating Rules

### 1.1 CTO
- Owns technical strategy, architecture decisions, technology stack, and long-term scalability
- Enforces separation of concerns: UI layer never touches raw database queries
- All PRs require type-checking (`tsc --noEmit` passes) and lint compliance
- Zero tolerance for hardcoded secrets, inline credentials, or commit of `.env` files
- Mandates dependency audit before adding any new package

### 1.2 Product Manager
- Defines user stories, acceptance criteria, and priority based on business goals
- All features must tie back to one of: conversion, retention, operational efficiency, or brand equity
- Maintains a forward-looking roadmap with quarterly milestones
- Signs off on Definition of Done before production release

### 1.3 Solutions Architect
- Owns the technology blueprint: database models, API contracts, service decomposition
- Every API endpoint must have a defined request/response schema (Zod)
- Database schema changes require a migration plan (Prisma migrate)
- Third-party integrations (Razorpay, Resend, Cloudinary, Redis) must have a fallback path

### 1.4 MERN Architect
- Designs the dual-API topology: Next.js API routes for storefront, Express for admin backend
- MongoDB collections are denormalized for read performance; Prisma/postgres for transactional data
- Redis caching strategy: session store, rate limit counters, BullMQ job queue
- File uploads go through S3 presigned URLs — server never handles raw file bytes

### 1.5 UI/UX Designer
- Design system tokens (colors, typography, spacing) defined in `tailwind.config.ts` and `globals.css`
- Every component in `src/components/ui/` must be atomic, reusable, and accessible
- Responsive breakpoints: mobile-first, tablet (768px), desktop (1024px), wide (1280px)
- Motion guidelines: micro-interactions <300ms, page transitions <500ms, no motion on `prefers-reduced-motion`

### 1.6 DevOps Engineer
- Build pipeline: GitHub Actions → lint → typecheck → test → Docker build → deploy
- Dockerfile uses multi-stage builds (deps → builder → runner) with distroless production image
- Infrastructure as code: `docker-compose.yml` for local dev, GitHub Actions for CI/CD
- Monitoring: Sentry for errors, structured JSON logging (Winston), health check endpoints

### 1.7 Security Engineer
- OWASP Top 10 compliance: XSS (helmet, CSP headers), CSRF (double-submit cookie pattern), SQL injection (Prisma parameterized queries)
- Authentication: JWT access (15min) + refresh (7d) tokens in httpOnly cookies, bcrypt (12 rounds), account lockout after 5 failed attempts
- Authorization: RBAC with 6 roles (CUSTOMER, WHOLESALE, EMPLOYEE, MANAGER, ADMIN, SUPER_ADMIN)
- Rate limiting: in-memory (dev) / Redis (prod) — 10 req/s for auth, 100 req/s for general
- Audit logging: all admin actions logged to `AuditLog` table with IP, user agent, and diff

### 1.8 AI Engineer
- Product recommendations: collaborative filtering on purchase history + content-based on product tags
- AI shopping assistant: GPT-4 via API for natural language product discovery
- Smart search: full-text search on product name, description, tags with typo tolerance
- Predictive analytics: demand forecasting based on historical orders, seasonality, and promotions
- Personalized offers: rule engine + ML scoring for targeted coupon generation

### 1.9 QA Engineer
- Unit tests: Jest for services and utilities
- Integration tests: Supertest for API endpoints
- E2E tests: Playwright for critical user journeys (registration, checkout, admin flow)
- Performance: k6 load tests for product listing, search, and checkout
- Accessibility: axe-core integration in E2E tests — WCAG 2.1 AA compliance

### 1.10 Technical Writer
- API documentation: OpenAPI 3.0 spec in `docs/api/GUIDE.md`
- Deployment guide: `docs/devops/DEPLOYMENT.md` with environment variables, Docker setup, and CI/CD steps
- Runbook: `docs/ops/RUNBOOK.md` for incident response, health checks, rollback procedures
- Monitoring guide: `docs/devops/MONITORING.md` with Sentry, logging, and alerting setup

---

## Section 2 — Project Context

### 2.1 Business Vision
ORPIND brings authentic Punjabi organic spices and grains directly from farm to kitchen. The platform bridges traditional Indian agriculture with modern e-commerce, preserving the heritage of Punjab's spice craftsmanship while offering a seamless digital shopping experience.

### 2.2 Brand Identity
- **Tagline**: "Premium Organic Spices & Grains from Punjab"
- **Tone**: Warm, authentic, heritage-rich, trustworthy
- **Visual language**: Earthy palette (olive green, amber gold, cream, leather brown), serif typography, grain textures, hand-drawn accents
- **Promise**: Farm-fresh, handpicked, traditionally crafted, chemical-free

### 2.3 Business Goals
- Primary: Launch a fully functional e-commerce platform with end-to-end order lifecycle
- Secondary: Establish brand trust through organic certification display, farm storytelling, and transparent sourcing
- Tertiary: Enable B2B wholesale channel for restaurants, retailers, and distributors

### 2.4 Target Users
| Persona | Needs | Key Features |
|---------|-------|-------------|
| Health-conscious home cook | Organic certification, ingredient transparency, recipe ideas | Product detail with nutritional info, blog recipes |
| Punjabi diaspora | Authentic regional spices, traditional packaging | Heritage blends, spice boxes, bulk options |
| Restaurant chef | Bulk pricing, consistent quality, reliable delivery | Wholesale portal, volume discounts, delivery scheduling |
| Health & wellness shopper | Certified organic, chemical-free, farm-direct | Certification badges, farm stories, origin traceability |
| Gift buyer | Premium packaging, curated sets, gift messaging | Gift boxes, spice collections, gift notes |

### 2.5 Success Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Conversion rate | >3% | Checkout completion / cart additions |
| Average order value | ₹850+ | Order total / order count |
| Customer retention | >25% repeat rate | Users with 2+ orders / total customers |
| Page load time | <2s LCP | Lighthouse / Web Vitals |
| Cart abandonment | <65% | Started checkout / completed orders |
| Admin efficiency | <2hr daily ops | Time spent on inventory, orders, CMS |
| SEO traffic | >40% organic | Google Analytics / Search Console |

### 2.6 Constraints
- **Development**: Windows environment (no native Docker volumes for PostgreSQL), SQLite for dev instead of PostgreSQL
- **Budget**: Self-funded MVP — no AWS/Railway credits, Razorpay test keys only, Resend free tier
- **Time**: Single-developer project with phased delivery
- **Compliance**: Indian tax laws (GST, HSN codes), FSSAI food safety regulations

### 2.7 Assumptions
- Users have modern browsers (ES2020+, CSS Grid, WebP support)
- Admin users are trusted (no malicious intent from internal roles)
- Payment gateway (Razorpay) handles PCI compliance — no card data stored locally
- SMS gateway will be integrated later — email-only OTP for now

---

## Section 3 — Requirement Discovery

### 3.1 Business Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| BR-01 | Sell organic spices and grains online with secure payments | P0 |
| BR-02 | Allow customers to create accounts and manage profiles | P0 |
| BR-03 | Enable bulk orders for wholesale/restaurant customers | P1 |
| BR-04 | Provide admin dashboard for order, product, and inventory management | P0 |
| BR-05 | Generate GST-compliant invoices and tax reports | P1 |
| BR-06 | Send transactional emails (order confirm, ship, deliver) | P1 |
| BR-07 | Support coupon codes and promotional discounts | P1 |
| BR-08 | Enable blog/content marketing for SEO and recipe sharing | P2 |
| BR-09 | Provide real-time order tracking for customers | P1 |
| BR-10 | Support multiple payment methods (UPI, card, netbanking, COD) | P0 |

### 3.2 Functional Requirements
| ID | Requirement | Module |
|----|-------------|--------|
| FR-01 | User registration with email OTP verification | Auth |
| FR-02 | Login/logout with JWT httpOnly cookies | Auth |
| FR-03 | Password reset via email link | Auth |
| FR-04 | Browse products by category, search, filter, sort | Shop |
| FR-05 | Product detail with images, weight variants, nutritional info | Shop |
| FR-06 | Add to cart with weight/quantity selection | Cart |
| FR-07 | Full checkout flow: address → payment → confirmation | Checkout |
| FR-08 | Razorpay payment integration with webhook callback | Payments |
| FR-09 | Order history with status tracking | Account |
| FR-10 | Wishlist add/remove | Account |
| FR-11 | Address management (CRUD with default) | Account |
| FR-12 | Product reviews with rating, title, comment | Products |
| FR-13 | Blog listing with categories and detail pages | Blog |
| FR-14 | Contact form with validation | Contact |
| FR-15 | Newsletter subscription | Marketing |
| FR-16 | Admin: product CRUD with image upload | Admin |
| FR-17 | Admin: order management with status updates | Admin |
| FR-18 | Admin: inventory tracking with low-stock alerts | Admin |
| FR-19 | Admin: coupon creation and management | Admin |
| FR-20 | Admin: customer management with order history view | Admin |
| FR-21 | Admin: analytics dashboard with revenue, orders, users | Admin |
| FR-22 | Admin: CMS for banners, categories, blog posts | Admin |
| FR-23 | Admin: employee role management | Admin |
| FR-24 | Admin: tax configuration with HSN code mapping | Admin |
| FR-25 | Admin: shipping rule configuration | Admin |
| FR-26 | Admin: review moderation (approve/reject) | Admin |
| FR-27 | Admin: audit log viewer | Admin |
| FR-28 | OTP verification for email confirmation | Auth |

### 3.3 Non-Functional Requirements
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | Page load | LCP < 2s, FCP < 1.5s |
| NFR-02 | API response | 95% of requests < 500ms |
| NFR-03 | Uptime | 99.9% availability |
| NFR-04 | Security | OWASP Top 10 compliant |
| NFR-05 | Accessibility | WCAG 2.1 AA |
| NFR-06 | Mobile support | All pages responsive down to 320px |
| NFR-07 | SEO | Perfect Lighthouse SEO score, sitemap, structured data |
| NFR-08 | Scalability | Horizontal scaling via stateless design |
| NFR-09 | Concurrent users | Support 1000 concurrent users on launch |
| NFR-10 | Data backup | Daily automated backups |
| NFR-11 | Audit trail | All admin actions logged immutably |

### 3.4 Hidden Objectives
- Build a portfolio-grade project demonstrating full-stack capability across 7 technology phases
- Establish reusable component library and design system for future brand expansion
- Create a template architecture adaptable to other e-commerce verticals
- Demonstrate AI integration (recommendations, smart search) for competitive differentiation

### 3.5 Scalability Requirements
- Database: PostgreSQL (Prisma) for transactional data, MongoDB (backend) for operational data
- Caching: Redis for sessions, rate limiting, job queues, and hot data
- File storage: AWS S3 with CDN for product images and media
- Compute: Docker containerization enables horizontal scaling via orchestrator
- Background jobs: BullMQ for email, invoice generation, data exports, cache warming

### 3.6 Future Roadmap
| Phase | Features |
|-------|----------|
| Phase 8 | MongoDB Atlas migration for backend, Stripe payment integration |
| Phase 9 | Multi-vendor marketplace (farmers direct selling) |
| Phase 10 | Mobile app (React Native), native push notifications |
| Phase 11 | AI recipe generator, voice search, AR spice visualization |
| Phase 12 | Subscription boxes, loyalty program with points, referral rewards |
| Phase 13 | International shipping, multi-currency, i18n (Punjabi, Hindi) |

---

## Section 4 — UI/UX System

### 4.1 Design Philosophy
"Authentic Warmth" — every visual element evokes the feeling of a Punjabi kitchen: warm, inviting, honest, and rich in tradition. The interface feels tactile, unhurried, and trustworthy — like shopping at a trusted neighborhood spice shop, but with digital convenience.

### 4.2 Design Tokens (tailwind.config.ts)
```typescript
colors: {
  green:  { 50: '#F1F5F0', 100: '#DCE8DA', 200: '#B8D1B4', 300: '#8FB98A', 400: '#6BA264', 500: '#4A8C42', 600: '#3A7033', 700: '#2C5427', 800: '#1E381B', 900: '#0F1C0E' },
  gold:   { 50: '#FFF9F0', 100: '#FFEDD5', 200: '#FED7AA', 300: '#FDBF7A', 400: '#F5A623', 500: '#D7A349', 600: '#B8860B', 700: '#8B6914', 800: '#5C4510', 900: '#2E2208' },
  brown:  { 50: '#FDF8F4', 100: '#F5E8D9', 200: '#E8D1B3', 300: '#D4B08C', 400: '#B8936A', 500: '#9A7A54', 600: '#7C6143', 700: '#5E4933', 800: '#403024', 900: '#2A1F17' },
  beige:  { 50: '#FEFCF8', 100: '#FDF9F0', 200: '#FAF1E0', 300: '#F5E6CC', 400: '#EFD4B3', 500: '#DCC19E', 600: '#C4A07A', 700: '#A6845C', 800: '#876943', 900: '#6B5232' },
  neutral:{ 50: '#F7F7F5', 100: '#E8E8E3', 200: '#D1D1C7', 300: '#BABAAA', 400: '#A3A38E', 500: '#8B8B72', 600: '#6F6F5C', 700: '#545446', 800: '#393930', 900: '#1D1D18' },
  semantic: { success: '#7CB342', warning: '#F5A623', error: '#C0392B', info: '#5B8DB8', star: '#D7A349' },
}
```

### 4.3 Typography
```typescript
fontFamily: {
  display: ['Cormorant Garamond', 'Georgia', 'Times New Roman', 'serif'],    // Headings, hero text, brand marks
  body:    ['Baskerville Old Face', 'Baskerville', 'Georgia', 'serif'],         // Body copy, descriptions
  mono:    ['SF Mono', 'Consolas', 'Liberation Mono', 'monospace'],             // Code, prices, order numbers
}
```

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `heading-xl` | 4xl (2.25rem) | 700 | Hero headlines |
| `heading-lg` | 3xl (1.875rem) | 600 | Page titles |
| `heading-md` | 2xl (1.5rem) | 600 | Section headers |
| `heading-sm` | xl (1.25rem) | 600 | Card titles |
| `body-lg` | lg (1.125rem) | 400 | Featured content |
| `body` | base (1rem) | 400 | Default body |
| `body-sm` | sm (0.875rem) | 400 | Captions, metadata |
| `caption` | xs (0.75rem) | 500 | Labels, footnotes |

### 4.4 Shadow & Elevation System
```typescript
shadow: {
  'warm-sm': '0 1px 3px rgba(196, 154, 108, 0.12)',
  'warm-md': '0 4px 12px rgba(196, 154, 108, 0.15)',
  'warm-lg': '0 8px 24px rgba(196, 154, 108, 0.18)',
  'soft-sm': '0 1px 2px rgba(21, 21, 16, 0.05)',
  'soft-md': '0 4px 12px rgba(21, 21, 16, 0.08)',
  'soft-lg': '0 8px 24px rgba(21, 21, 16, 0.1)',
  'soft-xl': '0 16px 48px rgba(21, 21, 16, 0.12)',
}
```

### 4.5 Component Library (26 Base Components)
All in `src/components/ui/`:
- **Layout**: Accordion, Drawer, Modal, Tabs, Breadcrumb, Pagination, Timeline
- **Input**: Button, Input, Checkbox, RadioButton, Toggle, QuantityStepper, SearchBar
- **Feedback**: Badge, Toast, Skeleton, ProgressBar, StarRating
- **Display**: Card, Carousel, ImageGallery, Dropdown
- **Marketing**: Newsletter, TrustBar, WhatsAppButton

### 4.6 Page Wireframe Structure
```
Home:   Hero → Categories → FeaturedProducts → WhyOrpind → Testimonials → BrandStory → Certifications → InstagramFeed → Newsletter → CTA
Shop:   Filters (sidebar) → ProductGrid → Pagination
Product: ImageGallery → ProductInfo → WeightSelector → AddToCart → Reviews → RelatedProducts
Cart:   CartItems → CouponInput → OrderSummary → CheckoutButton
Checkout: AddressForm → ShippingOptions → PaymentMethod → OrderReview → Pay
Account: SidebarNav → Profile / Orders / Wishlist / Addresses
Admin:  SidebarNav → DataTable / Forms / Analytics (charts + KPIs)
```

### 4.7 Responsive Breakpoints
| Breakpoint | Width | Layout Behavior |
|------------|-------|-----------------|
| Mobile | < 640px | Single column, hamburger nav, full-width cards |
| Tablet | 640–1024px | 2-column grid, sticky sidebar, condensed nav |
| Desktop | 1024–1280px | Multi-column layout, full nav, side panels |
| Wide | > 1280px | Max-width container, whitespace-balanced |

### 4.8 Accessibility
- All interactive elements keyboard-navigable (Tab, Enter, Escape)
- ARIA labels on icon-only buttons, modals, drawers
- Focus-visible ring styles (`focus-visible:ring-2 focus-visible:ring-gold-500`)
- Color contrast ratios meet WCAG 2.1 AA (4.5:1 normal text, 3:1 large text)
- Form inputs have visible labels and error messages linked via `aria-describedby`
- Skip-to-content link for screen readers
- `prefers-reduced-motion` disables all animations

### 4.9 Motion Design (Framer Motion)
| Animation | Duration | Timing | Trigger |
|-----------|----------|--------|---------|
| Fade in | 500ms | ease-out | Page load, section entrance |
| Slide up | 600ms | ease-out | Cards, product grid items |
| Scale in | 300ms | ease-out | Modal, drawer opening |
| Shimmer | 1.5s | linear | Skeleton loading states |
| Hover lift | 200ms | ease-out | Card hover (translateY -4px) |
| Button press | 100ms | ease-in | Click feedback |

---

## Section 5 — Architecture

### 5.1 System Topology
```
┌─────────────────────────────────────────────────────────────────────┐
│                          DNS / CDN (Cloudflare)                      │
└──────────┬──────────────────────────────────────┬────────────────────┘
           │                                      │
┌──────────▼──────────┐             ┌─────────────▼──────────────┐
│  Next.js 15 (Vercel) │             │  Express API (Railway)      │
│  ┌────────────────┐  │             │  ┌──────────────────────┐  │
│  │ API Routes     │──┼──Prisma─────┼──│ PostgreSQL (Neon)    │  │
│  │ (Storefront)   │  │             │  └──────────────────────┘  │
│  └────────────────┘  │             │  ┌──────────────────────┐  │
│  ┌────────────────┐  │             │  │ MongoDB Atlas        │  │
│  │ SSR Pages      │  │             │  │ (Admin, CMS, Logs)   │  │
│  └────────────────┘  │             │  └──────────────────────┘  │
│  ┌────────────────┐  │             │  ┌──────────────────────┐  │
│  │ Static Assets  │──┼──S3/CDN─────┼──│ Cloudinary/Images   │  │
│  └────────────────┘  │             │  └──────────────────────┘  │
└──────────────────────┘             │  ┌──────────────────────┐  │
                                     │  │ Redis (Upstash)      │  │
┌──────────────────────┐             │  │ Sessions / Queue    │  │
│  Razorpay Gateway    │◄────────────┼──└──────────────────────┘  │
└──────────────────────┘             │  ┌──────────────────────┐  │
                                     │  │ BullMQ Workers       │  │
┌──────────────────────┐             │  │ Email / Invoices    │  │
│  Resend (Email)      │◄────────────┼──└──────────────────────┘  │
└──────────────────────┘             └────────────────────────────┘
```

### 5.2 Database Architecture (Prisma + SQLite/PostgreSQL)

**Entity-Relationship:**
```
User 1──N Address          User 1──N Session           User 1──N VerificationCode
User 1──N Order             User 1──N Review
User 1──N WishlistItem     User 1──N CartItem          User 1──N AuditLog

Order 1──N OrderItem       Order N──1 Address (Shipping)

Product 1──N OrderItem     Product 1──N Review
Product 1──N WishlistItem  Product 1──N CartItem      Product 1──1 Inventory

Category N──1 Category (parent) — self-referencing tree

Coupon 1──N Order (through couponCode)
User 1──N Order
```

### 5.3 Backend Architecture (Express + MongoDB)

**Layers:**
```
Route (validation) → Controller (request handling) → Service (business logic) → Repository (data access) → MongoDB
```

**Models (MongoDB/Mongoose):**
- User, Session, Product, Category, Review, Order, OrderItem, Address, CartItem, WishlistItem
- BlogPost, Coupon, Banner, Inventory, AuditLog, Notification, SEO
- WholesaleInquiry, Recipe, Referral, LoyaltyPoint, SupportTicket

### 5.4 Folder Structure (Next.js)
```
src/
├── app/                    # Next.js App Router (pages + API routes)
│   ├── api/                # API route handlers
│   │   ├── admin/          # Admin API (customers, orders, products)
│   │   ├── auth/           # Auth API (login, register, logout, me, verify-otp, resend-otp)
│   │   ├── blog/           # Blog API
│   │   ├── cart/           # Cart API
│   │   ├── categories/     # Category API
│   │   ├── contact/        # Contact form API
│   │   ├── coupons/        # Coupon validation API
│   │   ├── newsletter/     # Newsletter API
│   │   ├── orders/         # Order API
│   │   ├── payments/       # Payment + webhook API
│   │   ├── products/       # Product list + detail + featured API
│   │   ├── shipping/       # Shipping check API
│   │   └── user/           # User profile API
│   ├── auth/               # Auth pages (login, register, forgot-password, verify)
│   ├── account/            # Customer dashboard
│   ├── admin/              # Admin dashboard (17 sub-pages)
│   ├── blog/               # Blog pages
│   ├── cart/               # Cart page
│   ├── checkout/           # Checkout page
│   ├── shop/               # Shop + product pages
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles + design tokens
├── components/             # React components
│   ├── home/               # Home page sections
│   ├── layout/             # Navbar, Footer
│   ├── shop/               # ProductCard, ProductGrid, ProductFilters
│   └── ui/                 # 26 atomic UI components
├── context/                # React Context providers
│   ├── AuthContext.tsx      # Auth state (user, login, register, logout)
│   ├── CartContext.tsx      # Cart state (items, add, remove, update)
│   └── WishlistContext.tsx  # Wishlist state
├── hooks/                  # Custom React hooks
├── lib/                    # Library modules
│   ├── api.ts              # HTTP client (fetch wrapper)
│   ├── auth/index.ts       # JWT helpers (generate, verify, cookies)
│   ├── db/index.ts         # Prisma client + helpers
│   ├── email/index.ts      # Email templates + sender
│   ├── invoice/index.ts    # PDF invoice generation
│   ├── monitoring/index.ts # Sentry integration
│   ├── payment/index.ts    # Razorpay integration
│   ├── security/index.ts   # Rate limiting, security headers
│   ├── seo/index.ts        # Dynamic metadata, JSON-LD
│   ├── shipping/index.ts   # Shipping rules + cost calculation
│   ├── tax/index.ts        # GST calculation, HSN codes
│   ├── upload/index.ts     # S3 presigned URL upload
│   └── validation/index.ts # Zod schemas
├── data/products.ts        # Static product/category/blog data
├── types/index.ts          # TypeScript interfaces
└── middleware.ts            # Request middleware (auth, security)
```

### 5.5 Backend Folder Structure
```
backend/
├── src/
│   ├── server.js            # Express entry point
│   ├── routes/v1/           # API route definitions
│   ├── controllers/         # Request handlers
│   ├── services/            # Business logic
│   ├── repository/          # Data access layer
│   ├── validators/          # Request validation
│   ├── security/            # Auth middleware, RBAC
│   ├── utils/               # Helpers (logger, constants)
│   ├── webhooks/            # Razorpay webhook handlers
│   └── workers/             # BullMQ background workers
└── tests/
    ├── unit/                # Unit tests
    ├── integration/         # API integration tests
    └── fixtures/            # Test data
```

---

## Section 6 — Frontend Engineering

### 6.1 Framework & Libraries
| Concern | Technology | Version |
|---------|-----------|---------|
| Framework | Next.js | 15.x (App Router) |
| UI Library | React | 19.x |
| Language | TypeScript | 5.7+ |
| Styling | Tailwind CSS | 3.4 |
| Animations | Framer Motion | 11.x |
| Icons | Lucide React | 0.469 |
| Validation | Zod | 3.24 |
| Payments | Razorpay SDK | 2.x |
| Email | Resend | 4.x |
| Monitoring | Sentry | 8.x |
| ORM | Prisma | 6.x |

### 6.2 Routing Architecture
```
/                          → Home (server component + client sections)
/shop                      → Shop listing (search, filter, sort, pagination)
/shop/[slug]               → Shop subcategory
/products/[slug]           → Product detail (images, info, reviews)
/cart                      → Shopping cart (client component)
/checkout                  → Checkout flow (client component, auth-guarded)
/account                   → Customer dashboard (auth-guarded)
/admin/*                   → Admin dashboard (role-guarded)
/auth/login                → Sign in
/auth/register             → Sign up with OTP
/auth/verify               → OTP verification
/auth/forgot-password      → Password reset
/blog                      → Blog listing
/blog/[slug]               → Blog post
/about                     → About us
/contact                   → Contact form
/faq                       → FAQ
/terms                     → Terms of service
/privacy                   → Privacy policy
/shipping-policy           → Shipping policy
/returns                   → Return policy
/wholesale                 → Wholesale inquiry
```

### 6.3 State Management
| State Type | Strategy | Files |
|-----------|----------|-------|
| Global auth | React Context | `AuthContext.tsx` |
| Global cart | React Context + localStorage | `CartContext.tsx` |
| Global wishlist | React Context + localStorage | `WishlistContext.tsx` |
| Server state | Direct fetch via `lib/api.ts` | API route handlers |
| Form state | Local useState | Individual pages |
| UI state | Local useState | Component-level |

### 6.4 API Layer (lib/api.ts)
```typescript
// Typed HTTP client with automatic error handling
const api = {
  get:    <T>(url) => fetch(url, { credentials: 'include' }),
  post:   <T>(url, body) => fetch(url, { method: 'POST', body: JSON.stringify(body), credentials: 'include' }),
  put:    <T>(url, body) => fetch(url, { method: 'PUT', body: JSON.stringify(body), credentials: 'include' }),
  patch:  <T>(url, body) => fetch(url, { method: 'PATCH', body: JSON.stringify(body), credentials: 'include' }),
  delete: <T>(url) => fetch(url, { method: 'DELETE', credentials: 'include' }),
}
// All methods: JSON Content-Type, cookies included, throw ApiError on non-2xx
```

### 6.5 Form Strategy
- All forms use local `useState` for simplicity (no form library dependency for MVP)
- Validation: Zod schemas on both client (imported) and server (API route)
- Real-time validation: onChange for password strength (register), onBlur for email format
- Error display: inline error messages below fields + summary toast
- Submission: disabled button + loading spinner during API call

### 6.6 SEO Strategy
- Dynamic metadata: `generateMetadata()` in each page with title, description, OG tags
- Structured data: JSON-LD for Organization, Product, BreadcrumbList, FAQPage
- Sitemap: `src/app/sitemap.ts` auto-generates from products, categories, blog posts
- Images: `next/image` optimization via Sharp, WebP/AVIF formats
- Performance: Preload critical fonts, lazy-load below-fold images, route prefetch for top links

### 6.7 Authentication Flow
```
Register: Form → POST /api/auth/register → Create user (isVerified: false) → Generate OTP → 
          Store in VerificationCode → Log/Email OTP → Return { requiresVerification, email } →
          Redirect to /auth/verify?email= → User enters OTP → 
          POST /api/auth/verify-otp → Mark isVerified: true → Create session → Set cookies → 
          Redirect to /account

Login:    Form → POST /api/auth/login → Validate credentials → Check isVerified → 
          Create session → Set cookies → Redirect to /account

Logout:   POST /api/auth/logout → Clear cookies → Destroy session → Redirect to /

Middleware: Check access_token cookie on /admin/, /account/, /checkout/ →
            If missing → redirect to /auth/login
            If admin route + insufficient role → redirect to /
```

### 6.8 Error Handling
| Layer | Strategy |
|-------|----------|
| API fetches | `ApiError` class with status + message, thrown on non-2xx |
| React components | Try/catch in event handlers, set error state, display inline |
| React tree | `error.tsx` — global error boundary (Next.js App Router) |
| Server actions | Return `{ error: string }` in JSON responses |
| Unhandled | Sentry capture (lib/monitoring) |
| 404 | `notFound()` from Next.js |
| 500 | Default Next.js error page |

### 6.9 Performance Budget
| Metric | Budget |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2s |
| FCP (First Contentful Paint) | < 1.5s |
| TBT (Total Blocking Time) | < 200ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| Lighthouse Performance | > 90 |
| Bundle size (initial JS) | < 200KB |
| Image weight (above fold) | < 500KB |

---

## Section 7 — Backend Engineering (Express)

### 7.1 Express Implementation
- Entry point: `backend/src/server.js`
- Port: 4000 (configurable via `PORT` env)
- Middleware stack: `helmet → cors → rate-limit → body-parser → cookie-parser → morgan → routes → error-handler`
- Sentry integration: `initSentry(app)` with `Sentry.Handlers.requestHandler()` and `errorHandler()`
- Graceful shutdown: `process.on('SIGTERM')` closes Sentry, Prisma, Redis connections

### 7.2 Controller Pattern
```javascript
// src/controllers/productController.js
exports.getProducts = async (req, res) => {
  const { category, page, limit } = req.query;
  const result = await productService.listProducts({ category, page, limit });
  res.json({ success: true, ...result });
};
```

### 7.3 Service Layer
- All business logic lives in services (controllers only parse request/format response)
- Services compose multiple repositories for complex operations (e.g., `createOrder` touches Order, Inventory, Coupon)
- Services are stateless — no shared mutable state between requests

### 7.4 Repository Layer
- Direct Mongoose model queries — no ORM abstraction beyond Mongoose itself
- Each model has a corresponding repository file (e.g., `userRepository.js`, `productRepository.js`)
- Repositories handle only data access — no business logic

### 7.5 Background Jobs (BullMQ)
| Job | Queue | Worker | Frequency |
|-----|-------|--------|-----------|
| Send email | `email` | `emailWorker.js` | On event |
| Generate invoice | `invoice` | `invoiceWorker.js` | On order placed |
| Cache warm | `cache` | `cacheWorker.js` | On product update |
| Data export | `export` | `exportWorker.js` | On admin request |
| Send notification | `notification` | `notificationWorker.js` | On event |
| Process refund | `refund` | `refundWorker.js` | On cancellation |
| Cleanup sessions | `cleanup` | `cleanupWorker.js` | Every 6 hours |

### 7.6 API Endpoint Summary
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/verify-otp | Verify email OTP | Public |
| POST | /api/auth/resend-otp | Resend verification OTP | Public |
| POST | /api/auth/login | Login | Public |
| POST | /api/auth/logout | Logout | Auth |
| GET | /api/auth/me | Get current user | Auth |
| GET | /api/products | List products (paginated, filtered) | Public |
| GET | /api/products/featured | Featured products | Public |
| GET | /api/products/[slug] | Product detail | Public |
| GET | /api/categories | List categories | Public |
| GET | /api/blog | List blog posts | Public |
| POST | /api/cart | Add to cart | Auth |
| GET | /api/cart | Get cart items | Auth |
| POST | /api/orders | Create order | Auth |
| GET | /api/orders | List user orders | Auth |
| POST | /api/payments | Create Razorpay order | Auth |
| POST | /api/payments/webhook | Razorpay webhook | Public |
| POST | /api/user/profile | Update profile | Auth |
| POST | /api/contact | Contact form | Public |
| POST | /api/newsletter | Subscribe | Public |
| POST | /api/coupons/validate | Validate coupon | Public |
| GET | /api/shipping/check | Check shipping availability | Public |
| GET/PUT/DELETE | /api/admin/* | Admin operations | Admin |

---

## Section 8 — Customer Dashboard (`/account`)

### 8.1 Orders
- List all orders with status badges (PLACED, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- Order detail view: items, pricing breakdown, shipping address, timeline
- Track package: carrier + tracking number link
- Cancel order: if status is PLACED or CONFIRMED
- Reorder: one-click add all items from previous order to cart

### 8.2 Wishlist
- Grid view of saved products with price and stock status
- Move to cart: single item or bulk
- Remove from wishlist
- Share wishlist (future: public wishlist link)

### 8.3 Profile
- Edit personal details: first name, last name, phone number
- Change password: requires current password + new password (validated)
- Email display (read-only — change requires verification)
- Account deletion request (future)

### 8.4 Address Management
- CRUD for shipping addresses
- Fields: name, phone, line1, line2, city, state, pincode, country, isDefault
- Maximum 10 addresses per user
- Default address auto-selected during checkout

### 8.5 Reviews
- List all reviews written by user with product name and image
- Edit review (within 30 days of posting)
- Delete review
- Response from admin shown inline

### 8.6 Notifications (Future)
- Order status updates (real-time via Server-Sent Events)
- Price drop alerts for wishlist items
- Back-in-stock notifications
- Promotional offers and coupon codes

### 8.7 Support (Future)
- Create support ticket
- View ticket history and status
- Live chat (via WhatsApp or integrated chat widget)

---

## Section 9 — Owner Dashboard (`/admin`)

### 9.1 Analytics Overview (`/admin`)
- Revenue: today, this week, this month, all-time with trend indicators
- Orders: total, pending, processing, delivered — bar chart last 30 days
- Users: new registrations, total customers — line chart
- Top products: by revenue, by quantity
- Low stock alerts: products below threshold

### 9.2 Products (`/admin/products`)
- Data table: name, SKU, category, price, stock, status toggle
- CRUD: create/edit with full product form (name, slug, description, images, weight variants, pricing, category, tags, nutritional info, SEO metadata)
- Bulk actions: activate/deactivate, delete selected

### 9.3 Inventory (`/admin/inventory`)
- Table: product, current stock, reserved, available, low stock threshold
- Manual stock adjustment with reason/note
- CSV export of inventory report

### 9.4 Orders (`/admin/orders`)
- Data table: order number, customer, date, total, payment status, order status
- Order detail: items, addresses, payment info, timeline
- Status management: update order status with optional tracking number + carrier
- Invoice download (PDF)

### 9.5 Customers (`/admin/customers`)
- Table: name, email, phone, total orders, lifetime value, registered date
- Customer detail: order history, addresses, reviews
- Manual verification toggle

### 9.6 Categories (`/admin/categories`)
- Nested tree view (parent → children)
- CRUD: name, slug, description, image, sort order, SEO metadata
- Drag-and-drop reordering (Future)

### 9.7 Coupons (`/admin/coupons`)
- Table: code, discount type, value, min amount, usage, valid period
- CRUD: code, description, discount (percentage/fixed), min order, max discount, usage limit, per-user limit, validity dates, applicable categories

### 9.8 CMS — Blog (`/admin/blog`)
- Table: title, author, category, published status, publish date
- Rich text editor for content (Future: TipTap/Quill integration)
- Image upload for featured image
- SEO fields: meta title, meta description, slug

### 9.9 CMS — Banners (`/admin/banners`)
- Table: title, position, active status, sort order
- CRUD: title, subtitle, CTA text, link, image, position (hero/promo), start/end dates

### 9.10 Reviews (`/admin/reviews`)
- Table: product, reviewer, rating, title, status
- Approve/reject moderation workflow
- Mark as verified (purchased customer)

### 9.11 Employees (`/admin/employees`)
- Table: name, email, role, status, last login
- CRUD: add employee with role assignment (EMPLOYEE, MANAGER, ADMIN)
- Role-based access control on all admin pages

### 9.12 Reports (`/admin/reports`)
- Sales report: date range, total revenue, orders, average order value
- Product report: top sellers, low performers
- Tax report: collected GST (CGST/SGST/IGST) by period
- Customer report: new vs returning, geographic distribution

### 9.13 Settings (`/admin/settings`)
- General: site name, tagline, description, logo, favicon
- Business: GSTIN, PAN, FSSAI, address, contact details
- Tax: default tax rate, HSN code mapping per category
- Shipping: free shipping threshold, rates by pincode region
- Payment: Razorpay keys, COD availability
- Email: SMTP configuration, template editor

### 9.14 Media (`/admin/media`)
- Grid view of uploaded images
- Upload via S3 presigned URL
- Copy URL / delete actions

### 9.15 Audit Logs (`/admin/audit-logs`)
- Table: timestamp, user, action, entity, entity ID, IP address
- Filter by date, user, action, entity type
- Immutable — no delete/edit of log entries

### 9.16 Tax Configuration (`/admin/tax`)
- GST rates per product category with HSN codes
- Interstate (IGST) vs intrastate (CGST+SGST) tax rules
- Tax exemption management

### 9.17 Shipping (`/admin/shipping`)
- Pincode-based serviceability
- Shipping rate tiers: weight slab × zone
- Courier partner configuration

---

## Section 10 — AI Features

### 10.1 Product Recommendations
- **Strategy**: Hybrid collaborative + content-based filtering
- **Collaborative**: Users who bought this also bought (order co-occurrence)
- **Content-based**: Similar products based on tag overlap, category, price range
- **Implementation**: Server-side computation on order data, cached in Redis (TTL: 1 hour)
- **Fallback**: Featured/popular products when insufficient data

### 10.2 AI Shopping Assistant (Future)
- **Interface**: Floating chat widget on shop pages
- **Capabilities**: Natural language product search ("I need a mild spice blend for butter chicken"), recipe suggestions, dietary recommendations
- **Backend**: GPT-4 API call with structured prompt + product catalog context
- **Limitations**: Rate-limited (10 queries/hour unregistered, unlimited for logged-in)

### 10.3 Smart Search
- Full-text search on product name, description, tags, category
- Typo tolerance: Levenshtein distance ≤ 2
- Autocomplete: search suggestions as user types (debounced 300ms)
- Filters: category, price range, organic, rating — persisted in URL query params
- Sort: relevance, price (asc/desc), rating, newest

### 10.4 Predictive Analytics (Future)
- Demand forecasting: ML model trained on historical order data + seasonality
- Inventory optimization: suggest reorder quantities based on predicted demand
- Price optimization: dynamic pricing based on demand elasticity
- Customer churn prediction: identify at-risk customers for targeted campaigns

### 10.5 Personalized Offers (Future)
- Rule engine: trigger coupons based on behavior (abandoned cart, first purchase, birthday, order milestone)
- ML scoring: rank customers by predicted lifetime value, target top quartile with premium offers
- A/B testing: compare offer variants (discount % vs fixed amount vs free shipping)

---

## Section 11 — Security

### 11.1 OWASP Top 10 Coverage
| Risk | Mitigation |
|------|-----------|
| A01: Broken Access Control | RBAC middleware on admin routes, JWT payload contains role |
| A02: Cryptographic Failures | bcrypt (12 rounds) for passwords, AES-256-CBC for PII |
| A03: Injection | Prisma parameterized queries, Zod input validation, mongo-sanitize |
| A04: Insecure Design | Rate limiting on auth, failed login lockout, OTP expiry |
| A05: Security Misconfiguration | Helmet headers, CORS whitelist, no debug info in production |
| A06: Vulnerable Components | npm audit in CI, Dependabot alerts, regular dependency updates |
| A07: Auth Failures | JWT rotation, httpOnly cookies, secure flag, account lockout |
| A08: Data Integrity | Webhook signature verification (Razorpay HMAC-SHA256) |
| A09: Logging Failures | Structured JSON logging, audit trail for admin actions |
| A10: SSRF | Validate all webhook URLs, no user-controlled fetch destinations |

### 11.2 JWT Implementation
- Access token: 15-minute expiry, JWT_SECRET, payload = { id, role, email, firstName, lastName }
- Refresh token: 7-day expiry, JWT_REFRESH_SECRET, payload = { id, type: 'refresh' }
- Storage: httpOnly, secure (prod), sameSite=lax cookies
- Rotation: refresh endpoint invalidates old token, issues new pair

### 11.3 RBAC Matrix
| Role | Permissions |
|------|------------|
| CUSTOMER | View products, create orders, manage own profile/addresses, write reviews |
| WHOLESALE | Same as CUSTOMER + view wholesale pricing, place bulk orders |
| EMPLOYEE | View admin dashboard, manage orders, update product stock |
| MANAGER | Same as EMPLOYEE + create/edit products, manage categories, view reports |
| ADMIN | Same as MANAGER + manage employees, coupons, settings, audit logs |
| SUPER_ADMIN | Full system access, role assignments, deletion |

### 11.4 Encryption
- Passwords: bcrypt (12 salt rounds)
- PII fields (phone, address): AES-256-CBC encryption at rest in MongoDB
- Payment data: Not stored locally — Razorpay handles PCI compliance
- JWT secrets: environment variable, minimum 32 characters

### 11.5 Rate Limiting
| Endpoint | Limit | Window | Scope |
|----------|-------|--------|-------|
| POST /api/auth/* | 10 requests | 60 seconds | IP |
| POST /api/contact | 5 requests | 3600 seconds | IP |
| Public GET endpoints | 100 requests | 60 seconds | IP |
| Authenticated endpoints | 200 requests | 60 seconds | User |
| Admin endpoints | 50 requests | 60 seconds | User |

### 11.6 Audit Log
- All CREATE, UPDATE, DELETE operations by admin users logged to `AuditLog` table
- Fields: userId, action, entity, entityId, details (JSON diff), ipAddress, userAgent
- Immutable: no update/delete endpoints for audit logs
- Retention: 1 year, then archived

### 11.7 Security Headers
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: origin-when-cross-origin
X-XSS-Protection: 1; mode=block
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000 (production)
Content-Security-Policy: (configured per environment)
```

---

## Section 12 — DevOps

### 12.1 Docker Configuration
- **Base image**: `node:20-alpine`
- **Production image**: Distroless (multi-stage: deps → builder → runner)
- **Port**: 3000 (internal)
- **Health check**: `curl -f http://localhost:3000/api/health || exit 1`
- **Startup**: `node server.js` (standalone Next.js output)

### 12.2 Docker Compose
```yaml
services:
  db:       postgres:16-alpine   → port 5432, volume postgres_data
  redis:    redis:7-alpine        → port 6379, volume redis_data
  app:      build: .              → port 3000, depends on db+redis healthy
```

### 12.3 CI/CD Pipeline (GitHub Actions)
```
push → main / develop
├── lint-and-typecheck: npm ci → lint → typecheck → client typecheck
├── backend-test: npm ci (backend) → jest
├── client-test: npm ci (client) → vitest
├── security-scan: npm audit (root + client + backend)
└── if main:
    ├── docker-build: docker buildx → push to ghcr.io
    └── deploy:
        ├── staging: Railway webhook → Vercel webhook
        └── production (after approval): Railway → Vercel → smoke test
```

### 12.4 Monitoring
| Tool | Purpose | Integration |
|------|---------|------------|
| Sentry | Error tracking, performance monitoring | `@sentry/nextjs`, `@sentry/node` |
| Winston | Structured JSON logging | Backend Express |
| Health check | `/api/health` endpoint | Docker, Railway |
| uptime monitoring | External (UptimeRobot / Better Uptime) | Future |

### 12.5 Logging Strategy
- **Format**: JSON structured logs with timestamp, level, message, requestId, userId
- **Levels**: error, warn, info, debug
- **Sensitive data**: Redact passwords, tokens, PII before logging
- **Storage**: stdout/stderr in container (Docker log driver), persisted to log aggregator (future)
- **Retention**: 30 days

### 12.6 Backup Strategy
- **Database**: Daily `pg_dump` (PostgreSQL) / `mongodump` (MongoDB) → S3
- **Uploads**: S3 versioning enabled
- **Code**: GitHub (source of truth)
- **Config**: Environment variables documented in `.env.example`

---

## Section 13 — Testing

### 13.1 Testing Strategy
| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Jest | Services, utilities, helpers, validation schemas |
| Integration | Supertest + Jest | API endpoints, database operations |
| E2E | Playwright | Critical user journeys, cross-browser |
| Performance | k6 | Load test: product listing, search, checkout |
| Accessibility | axe-core + Playwright | WCAG 2.1 AA compliance |
| Security | npm audit, OWASP ZAP (future) | Dependency vulnerabilities |

### 13.2 Unit Tests
- Framework: Jest
- Target: Pure functions in `src/lib/` (validation, auth, tax, shipping, payment)
- Mock: No database mocking — test pure logic only
- Coverage target: >80% for lib modules

### 13.3 Integration Tests
- Framework: Jest + Supertest
- Target: API route handlers
- Setup: Test database with seed data (in-memory SQLite)
- Teardown: Reset database between test suites

### 13.4 E2E Tests (Playwright)
```
Test suites:
├── auth.spec.ts       → Register, verify OTP, login, logout, password reset
├── shop.spec.ts       → Browse products, filter, search, pagination
├── cart.spec.ts       → Add/remove items, update quantity, coupon
├── checkout.spec.ts   → Full checkout flow with address + payment
├── account.spec.ts    → View orders, wishlist, profile edit
└── admin.spec.ts      → Product CRUD, order management, inventory
```

### 13.5 Performance Testing (k6)
```
Scenarios:
├── browse_products: 100 concurrent users, browse + filter + sort
├── product_search: 50 concurrent users, search queries
├── checkout_flow: 20 concurrent users, full add-to-cart → checkout
└── admin_dashboard: 10 concurrent admin users, data table views
```

### 13.6 Accessibility Testing
- Automated: axe-core in Playwright E2E tests
- Manual: Keyboard navigation audit, screen reader (NVDA/VoiceOver) testing
- Target: WCAG 2.1 Level AA

---

## Section 14 — Deployment

### 14.1 Deployment Architecture
```
Production:
├── Frontend: Vercel (Next.js 15)
│   ├── Automatic static optimization
│   ├── ISR for product pages
│   └── Edge functions for middleware
├── Backend API: Railway (Express)
│   ├── Horizontal scaling (containerized)
│   └── Health check endpoint
├── Database: MongoDB Atlas (backend) + Neon PostgreSQL (Prisma)
├── Cache: Redis (Upstash / Railway)
├── Files: AWS S3 + CloudFront CDN
└── Email: Resend
```

### 14.2 Environment Configuration
```
Production environment variables:
DATABASE_URL=               # PostgreSQL connection string
JWT_SECRET=                 # Minimum 32 chars, randomly generated
JWT_REFRESH_SECRET=         # Different from JWT_SECRET
NEXT_PUBLIC_SITE_URL=       # https://orpind.com
RAZORPAY_KEY_ID=            # Live Razorpay keys
RAZORPAY_KEY_SECRET=        # Live Razorpay secret
RAZORPAY_WEBHOOK_SECRET=    # Razorpay webhook secret
RESEND_API_KEY=             # Resend API key
AWS_ACCESS_KEY_ID=          # S3 access
AWS_SECRET_ACCESS_KEY=      # S3 secret
AWS_S3_BUCKET=              # orpind-uploads
SENTRY_DSN=                 # Sentry project DSN
REDIS_URL=                  # Redis connection string
CDN_URL=                    # CloudFront or custom CDN URL
```

### 14.3 Vercel Configuration (Frontend)
- Framework preset: Next.js
- Build command: `npm run build`
- Output directory: `.next`
- Node version: 20.x
- Environment variables: All `NEXT_PUBLIC_*` + `DATABASE_URL`, `JWT_*`, `RESEND_API_KEY`, `AWS_*`
- Domains: Custom domain (orpind.com) with Vercel DNS
- Regions: Mumbai (ap-south-1) for Indian users

### 14.4 Railway Configuration (Backend)
- Build command: `docker build -t orpind-api .`
- Start command: `node src/server.js`
- Port: 4000
- Health check path: `/api/health`
- Replicas: Minimum 1, Maximum 3 (auto-scale)

### 14.5 SSL/TLS
- Vercel: Automatic SSL via Let's Encrypt
- Backend: SSL termination at Railway edge
- Custom domain: SSL certificate auto-provisioned

### 14.6 CDN Strategy
- Static assets (images, fonts): S3 → CloudFront
- Next.js static files: Vercel Edge Network
- Cache TTL: Images (30 days), fonts (1 year), HTML (varies by page type)
- Cache invalidation: On product update via admin → invalidate product image URLs

---

## Section 15 — Code Review Standards

### 15.1 SOLID Principles
| Principle | Application |
|-----------|------------|
| Single Responsibility | Each function/component does one thing. Services → business logic, Controllers → HTTP handling, Repositories → data access |
| Open/Closed | Extend via configuration (env vars, DB config tables) not modification |
| Liskov Substitution | TypeScript interfaces guarantee contract compliance |
| Interface Segregation | Context providers expose only needed methods, not entire state |
| Dependency Inversion | High-level modules (services) depend on abstractions (repositories), not concrete implementations |

### 15.2 Clean Code Rules
| Rule | Enforcement |
|------|------------|
| Meaningful names | Variables describe purpose, not type (`user` not `u`, `isLoading` not `load`) |
| Functions ≤ 30 lines | Extract helpers for complex logic |
| No commented code | Remove dead code, not comment it out |
| No console.log in prod | Structured logger (Winston) with levels |
| Early return | Guard clauses before main logic |
| Error handling | Never swallow errors — always propagate or handle |

### 15.3 Performance Standards
| Pattern | Accept | Reject |
|---------|--------|--------|
| Re-renders | useMemo/useCallback for expensive computations | Inline anonymous functions in render props |
| Bundle | Dynamic imports for heavy components | Importing entire library for one icon |
| Images | next/image with width/height | Raw <img> without dimensions |
| API calls | Debounced search (300ms) | Request on every keystroke |
| Database | Prisma `select` specific fields | `select *` / include all relations |
| Lists | Pagination or virtualization | Rendering 1000+ items at once |

### 15.4 TypeScript Standards
- Strict mode enabled
- Prefer interfaces over types for objects
- No `any` — use `unknown` if type is truly indeterminate
- Exhaustive switch statements with `never` check
- Generic constraints where applicable (`<T extends Product>`)

### 15.5 Documentation Requirements
- All exported functions have JSDoc comments (purpose, params, returns)
- Complex business logic has inline comments explaining the "why"
- API routes specify expected request/response shapes
- Environment variables documented in `.env.example`
- Database schema changes accompanied by migration plan

---

## Section 16 — Definition of Done

### 16.1 Feature Checklist
- [ ] Code compiles with `tsc --noEmit` — zero errors
- [ ] Lint passes (`npm run lint`) — zero errors, pre-existing warnings only
- [ ] All acceptance criteria from the user story are met
- [ ] API endpoints return correct status codes and response shapes
- [ ] Error states handled (network failure, validation error, 404, 500)
- [ ] Loading states implemented (skeleton/spinner)
- [ ] Empty states handled (no results, empty cart, no orders)
- [ ] Mobile responsive tested (320px, 768px, 1024px, 1280px)
- [ ] Feature works in Chrome, Firefox, Safari, Edge
- [ ] No hardcoded URLs, secrets, or environment-specific values

### 16.2 Security Checklist
- [ ] All user inputs validated with Zod schema
- [ ] Authentication required for protected routes (middleware)
- [ ] Authorization enforced (RBAC — user cannot access admin APIs)
- [ ] No sensitive data in logs (passwords, tokens, PII)
- [ ] Rate limiting applied to auth and contact endpoints
- [ ] Helmet security headers present in response
- [ ] Webhook signature verified for payment callbacks
- [ ] CORS configured to allow only known origins
- [ ] SQL injection prevented (Prisma parameterized queries)

### 16.3 Testing Checklist
- [ ] Unit tests for pure functions (validation, tax, shipping)
- [ ] Integration tests for API endpoints
- [ ] E2E test for the user journey (register → browse → cart → checkout)
- [ ] E2E test for admin flow (login → manage product → manage order)
- [ ] Accessibility check (keyboard nav, screen reader)
- [ ] Performance test: API response <500ms for 95th percentile
- [ ] No flaky tests (3 consecutive passes)

### 16.4 Performance Checklist
- [ ] LCP < 2s (Lighthouse)
- [ ] FCP < 1.5s (Lighthouse)
- [ ] All images use `next/image` or have explicit width/height
- [ ] Bundle size analyzed — no obvious dead code
- [ ] API response pagination for lists (default: 12 per page)
- [ ] Static pages pre-rendered (SSG/ISR where possible)
- [ ] Fonts preloaded with `display: swap`
- [ ] Third-party scripts loaded async/deferred

### 16.5 Deployment Checklist
- [ ] All environment variables set in production
- [ ] Database migration run (Prisma migrate deploy)
- [ ] SSL certificate valid and auto-renewing
- [ ] CDN cache purged for updated assets
- [ ] Health check endpoint returns 200
- [ ] Sentry DSN configured and test error captured
- [ ] Backup strategy verified (DB dump successful)
- [ ] Rollback plan documented (previous Docker image)
- [ ] Smoke test: register → browse → cart → checkout completes
- [ ] Monitoring alerts configured for 5xx errors
