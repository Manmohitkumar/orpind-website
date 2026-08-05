## 5. Feature Modules

### Module Dependency Matrix

```
Auth ←── Users, Employees
Users ←── Orders, Cart, Wishlist, Reviews, Addresses
Products ←── Orders, Cart, Wishlist, Reviews, Inventory
Categories ←── Products
Inventory ←── Products, Orders, Warehouse
Orders ←── Payments, Shipping, Inventory, Notifications
Payments ←── Orders, Refunds, Invoices
Cart ←── Products, Coupons, Orders
Wishlist ←── Products
Coupons ←── Orders, Wholesale
Reviews ←── Products, Users
Blog ←── SEO, Media
Recipes ←── Products, Blog
CMS ←── Media, SEO
Media ←── Products, Blog, CMS
SEO ←── Products, Categories, Blog, Recipes
Notifications ←── (depends on nothing — triggered by events)
Analytics ←── (reads from all collections)
Warehouse ←── Inventory, Shipping
Shipping ←── Orders, Warehouse
Support ←── Orders, Users
Employees ←── Roles, Permissions
Roles ←── Permissions
Permissions ←── (base layer)
Settings ←── (global configuration)
Audit Logs ←── (writes from all modules)
Reports ←── (reads from all collections)
Newsletter ←── Users, Analytics
Loyalty ←── Users, Orders
Referral ←── Users, Loyalty
Affiliate ←── Users, Orders, Referral
Wholesale ←── Users, Products, Coupons, Orders
```

### Module Responsibilities

#### Authentication Module
- Registration (email, phone, Google OAuth)
- Login (email/password, OTP, social)
- JWT token generation, rotation, refresh
- Email verification flow
- Password reset flow (email + OTP)
- Session management (multi-device)
- Account lockout (brute force protection)
- Remember me tokens
- Device fingerprinting

#### Users Module
- Profile CRUD
- Address management (multiple addresses, default selection)
- Order history
- Wishlist management
- Account deletion (GDPR compliance)
- Profile picture upload

#### Products Module
- Product CRUD with rich fields
- Variant management (weight, packaging)
- Product images (multi-image with primary selection)
- Product status (draft, active, discontinued)
- Bulk operations (import/export)
- Product cloning
- Cross-sell / up-sell relationships

#### Categories Module
- Hierarchical categories (tree structure via `parent` reference)
- Category images
- SEO fields per category
- Sort order management
- Category-product counts

#### Inventory Module
- Stock tracking per SKU
- Warehouse-wise inventory
- Low stock alerts (threshold-based)
- Stock reservation on order placement
- Stock release on cancellation
- Inventory history/audit trail
- Batch tracking (manufacturing/expiry dates for spices)

#### Orders Module
- Order creation with transactional integrity
- Order status lifecycle management
- Order timeline/history
- Order notes (internal + customer-facing)
- Order cancellation (pre-shipping)
- Return/refund initiation
- Order PDF/invoice generation
- Wholesale order handling
- Guest checkout support

#### Cart Module
- Persistent cart (DB-backed for logged-in users)
- Session-based cart (guests)
- Cart merging on login
- Stock validation on add
- Coupon application
- Cart expiry (abandoned cart detection)

#### Wishlist Module
- Add/remove products
- Move to cart
- Wishlist sharing
- Back-in-stock notifications

#### Coupons Module
- Percentage / fixed amount / free shipping
- Minimum order value
- Usage limits (total + per user)
- Date range validity
- Product/category restrictions
- First-order / repeat-order targeting
- Wholesale-specific coupons
- Stackability rules

#### Payments Module
- Payment abstraction layer (provider-agnostic)
- Razorpay order creation + verification
- Stripe integration (future)
- COD management
- Payment status tracking
- Refund processing (full/partial)
- Webhook handling with idempotency
- Payment reconciliation
- Invoice generation (GST-compliant)

#### Reviews Module
- Review CRUD with rating (1-5)
- Photo reviews
- Review verification (only purchased users)
- Review helpfulness voting
- Review moderation queue
- Review response (admin)
- Aggregate rating calculation

#### Blog Module
- Blog CRUD with rich text editor
- Draft/publish workflow
- Category & tag management
- Featured images
- Author assignment
- Reading time estimation
- Related posts
- Social sharing metadata

#### Recipes Module
- Recipe CRUD
- Ingredient linking to products
- Step-by-step instructions
- Cooking time, servings
- Recipe images
- Recipe-product association (shop the ingredients)

#### CMS Module
- Static page management (About, Terms, Privacy)
- Banner/hero management
- FAQ management
- Testimonial management
- Section-based content blocks

#### Media Module
- File upload to Cloudinary
- Image optimization (WebP, thumbnails)
- Folder organization
- Media library browsing
- Signed URL generation
- Soft delete with recovery
- Usage tracking (where is each image used)

#### SEO Module
- Meta title/description per page type
- Open Graph configuration
- Canonical URLs
- JSON-LD structured data generation
- Sitemap generation
- Robots.txt management
- 301 redirect management
- SEO audit scoring

#### Notifications Module
- Multi-channel dispatch (email, SMS, WhatsApp, in-app)
- Template management per channel
- User preference management (opt-in/out per type)
- Notification queue with retry
- Delivery tracking
- Read/unread status

#### Analytics Module
- Page view tracking
- Product view tracking
- Search analytics
- Cart analytics (add/remove/abandon)
- Order analytics
- Revenue analytics
- User behavior analytics
- Custom event tracking

#### Warehouse Module
- Warehouse CRUD
- Warehouse-wise inventory
- Warehouse order routing
- Warehouse staff assignment
- Warehouse performance metrics

#### Shipping Module
- Shipping rate calculation (weight/zone-based)
- Pincode serviceability check
- Carrier integration (Shiprocket, Delhivery)
- Shipment tracking
- Delivery estimation
- Shipping label generation

#### Support Module
- Ticket creation (order-related, general)
- Ticket categorization & priority
- Ticket assignment to agents
- Internal notes
- Customer communication thread
- Ticket resolution & feedback
- SLA tracking

#### Employees Module
- Employee CRUD
- Role assignment
- Department management
- Activity logging
- Performance tracking

#### Roles & Permissions Module
- Role CRUD
- Permission CRUD
- Role-permission mapping
- User-role assignment
- Dynamic permission checks
- Permission groups

#### Settings Module
- Store settings (name, logo, contact)
- Tax configuration (GST rates)
- Shipping configuration
- Payment configuration
- Email/notification configuration
- Currency settings
- Feature flags
- Maintenance mode

#### Audit Logs Module
- All write operations logged
- User action tracking
- IP + user agent capture
- Entity change diff
- Retention policy (TTL index)
- Searchable audit trail

#### Reports Module
- Sales reports (daily, weekly, monthly)
- Product performance reports
- Customer reports
- Inventory reports
- Financial reports (revenue, refunds)
- Coupon performance reports
- Export to CSV/Excel

#### Newsletter Module
- Subscriber management
- Campaign creation
- Email template builder
- Schedule & send
- Open/click tracking
- Unsubscribe management

#### Loyalty Module
- Points earning rules
- Points redemption
- Points balance
- Tier management (Bronze, Silver, Gold, Platinum)
- Tier benefits
- Points expiry

#### Referral Module
- Referral code generation
- Referral link sharing
- Referral tracking
- Reward distribution
- Referral leaderboard

#### Affiliate Module
- Affiliate registration
- Custom affiliate links
- Click & conversion tracking
- Commission calculation
- Payout management
- Affiliate dashboard

#### Wholesale Module
- Wholesale buyer registration & verification
- Tier-based pricing
- Bulk order placement
- Credit terms management
- Wholesale-specific coupons
- MOQ (Minimum Order Quantity) enforcement
- Volume discounts
