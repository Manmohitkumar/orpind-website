# Orpind — AGENTS.md

## Project Structure
```
orpind-website/
├── src/                          # Next.js frontend (port 3000)
│   ├── app/                      # App Router pages & API routes
│   │   ├── api/                  # Next.js API routes (payments, auth, orders, etc.)
│   │   ├── auth/                 # Login, register, verify pages
│   │   ├── checkout/             # Checkout page (Razorpay + Stripe + COD)
│   │   ├── shop/                 # Product listing & detail pages
│   │   ├── admin/                # Admin dashboard pages
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Tailwind styles
│   ├── components/               # React components
│   │   ├── layout/               # Navbar, Footer
│   │   ├── checkout/             # StripeCheckoutForm (Elements)
│   │   ├── home/                 # Homepage sections
│   │   ├── shop/                 # ProductCard, ProductFilters, ProductGrid
│   │   └── ui/                   # Reusable UI components
│   ├── context/                  # React contexts (Auth, Cart, Wishlist)
│   ├── lib/                      # Utilities
│   │   ├── payment/              # Razorpay + Stripe helper libs
│   │   ├── email/                # Resend email templates
│   │   ├── auth/                 # JWT auth helpers
│   │   ├── db/                   # Prisma client
│   │   └── validation/          # Zod schemas
│   ├── data/                     # Static product & site data
│   └── types/                    # TypeScript types
├── backend/                      # Express API (port 4000)
│   └── src/
│       ├── config/               # env, database, redis, sentry config
│       ├── controllers/          # Route handlers
│       ├── services/             # Business logic (payment, order, etc.)
│       ├── repositories/         # Mongoose data access
│       ├── models/               # Mongoose schemas
│       ├── routes/v1/            # Express route definitions
│       └── middleware/           # Auth, validation, error handling
├── prisma/                       # Prisma schema & migrations
├── public/                       # Static assets (images, SVGs)
└── scripts/                      # Seed scripts
```

## Architecture

### Database Split
- **Prisma (SQLite dev / PostgreSQL prod)** — Next.js app: users, orders, products, sessions, verification codes
- **Mongoose (MongoDB Atlas)** — Express backend: permissions, roles, inventory, warehouse, settings

### Payment Flow (3 methods)
1. **Razorpay** — `POST /api/payments` → creates Razorpay order → frontend uses Razorpay JS SDK → webhook `POST /api/payments/webhook`
2. **Stripe** — `POST /api/payments/stripe` → creates PaymentIntent → frontend uses Stripe Elements → webhook `POST /api/payments/stripe-webhook`
3. **COD** — order placed directly, paymentStatus = PENDING

### Auth
- Next.js API routes use JWT (access + refresh tokens) stored in cookies
- Express API routes use separate JWT (access + refresh) for backend auth
- Registration requires OTP email verification via Resend

### Email (Resend)
- Free tier only sends to account owner's email
- Dev mode: OTP displayed on screen in amber box if email fails

## Key Commands

| Command | Location | Description |
|---|---|---|
| `npm run dev` | root | Start Next.js (port 3000) |
| `npm run dev` | backend/ | Start Express with MongoMemoryServer (port 4000) |
| `npm run db:push` | root | Push Prisma schema to database |
| `npm run db:generate` | root | Generate Prisma client |
| `npm run lint` | root | Run ESLint |
| `npm run typecheck` | root | Run TypeScript check |

## Environment Files
- `.env` — Next.js frontend env vars
- `backend/.env` — Express backend env vars

## Key Config Values
- Frontend: `localhost:3000`
- Backend: `localhost:4000`
- JWT Access: 15m expiry
- JWT Refresh: 7d expiry
- OTP: 10 min expiry, 6 digits
- Shipping free threshold: ₹999

## Conventions
- Tailwind CSS with custom colors (beige, gold, green, neutral)
- Font: Cormorant Garamond (display), system-ui (body)
- API responses: Next.js routes return `NextResponse.json()`, Express routes return `{ success, data, meta }`
- Error handling: `apiError()` utility for Next.js, `AppError` class for Express
- Payment amounts in smallest unit (paise for Razorpay, cents for Stripe)
