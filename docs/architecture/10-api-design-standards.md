## 10. API Design Standards

### Versioning

```
Base URL: https://api.orpind.com/v1

Versioning rules:
- Major version changes in URL: /v1, /v2
- Breaking changes require new version
- Non-breaking changes (new fields, new endpoints) go in current version
- Old versions supported for 12 months after deprecation
```

### Endpoint Standards

| Convention | Example |
|---|---|
| Collection (plural, kebab) | `/api/v1/products` |
| Single resource | `/api/v1/products/:id` |
| Nested resources | `/api/v1/orders/:id/items` |
| Actions | `/api/v1/orders/:id/cancel` |
| Bulk actions | `/api/v1/products/bulk-update` |
| Search | `/api/v1/products/search?q=turmeric` |
| Admin prefix | `/api/v1/admin/orders` |

### Response Format

**Success:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "total": 156,
      "page": 1,
      "limit": 12,
      "totalPages": 13,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2026-07-27T12:00:00Z"
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with the given ID was not found",
    "details": null
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2026-07-27T12:00:00Z"
  }
}
```

**Validation Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" },
      { "field": "password", "message": "Must be at least 8 characters" }
    ]
  }
}
```

### Complete API Endpoint Specification

#### Authentication APIs

| # | Endpoint | Method | Purpose | Auth | Body / Query | Response |
|---|---|---|---|---|---|---|
| 1 | `/auth/register` | POST | Register new user | No | `{ firstName, lastName, email, password, phone? }` | `{ user, tokens }` |
| 2 | `/auth/login` | POST | Email/password login | No | `{ email, password }` | `{ user, tokens }` |
| 3 | `/auth/otp/send` | POST | Send OTP to phone | No | `{ phone }` | `{ message }` |
| 4 | `/auth/otp/verify` | POST | Verify OTP login | No | `{ phone, otp }` | `{ user, tokens }` |
| 5 | `/auth/google` | POST | Google OAuth login | No | `{ idToken }` | `{ user, tokens }` |
| 6 | `/auth/refresh` | POST | Refresh access token | Refresh Cookie | — | `{ tokens }` |
| 7 | `/auth/logout` | POST | Logout (clear tokens) | Yes | — | `{ message }` |
| 8 | `/auth/logout-all` | POST | Revoke all sessions | Yes | — | `{ message }` |
| 9 | `/auth/verify-email` | POST | Verify email address | No | `{ token }` | `{ message }` |
| 10 | `/auth/verify-email/resend` | POST | Resend verification | Yes | — | `{ message }` |
| 11 | `/auth/password/forgot` | POST | Request password reset | No | `{ email }` | `{ message }` |
| 12 | `/auth/password/reset` | POST | Reset password | No | `{ token, newPassword }` | `{ message }` |
| 13 | `/auth/password/change` | POST | Change password | Yes | `{ currentPassword, newPassword }` | `{ message }` |

#### User APIs

| # | Endpoint | Method | Purpose | Auth | Body / Query | Response |
|---|---|---|---|---|---|---|
| 14 | `/users/me` | GET | Get current user profile | Yes | — | `{ user }` |
| 15 | `/users/me` | PUT | Update profile | Yes | `{ firstName?, lastName?, phone? }` | `{ user }` |
| 16 | `/users/me/avatar` | PUT | Upload avatar | Yes | `multipart: avatar` | `{ avatar }` |
| 17 | `/users/me/addresses` | GET | List addresses | Yes | — | `{ addresses }` |
| 18 | `/users/me/addresses` | POST | Add address | Yes | `{ firstName, lastName, ... }` | `{ address }` |
| 19 | `/users/me/addresses/:id` | PUT | Update address | Yes | `{ ...fields }` | `{ address }` |
| 20 | `/users/me/addresses/:id` | DELETE | Delete address | Yes | — | `{ message }` |
| 21 | `/users/me/addresses/:id/default` | PUT | Set default address | Yes | — | `{ message }` |
| 22 | `/users/me/sessions` | GET | List active sessions | Yes | — | `{ sessions }` |
| 23 | `/users/me/sessions/:id` | DELETE | Revoke session | Yes | — | `{ message }` |
| 24 | `/users/me/delete` | POST | Request account deletion | Yes | `{ password }` | `{ message }` |

#### Product APIs

| # | Endpoint | Method | Purpose | Auth | Body / Query | Response |
|---|---|---|---|---|---|---|
| 25 | `/products` | GET | List products (public) | No | `?category=&search=&sort=&page=&limit=&minPrice=&maxPrice=&tag=&featured=&new=&bestseller=` | `{ products, pagination, filters }` |
| 26 | `/products/:slug` | GET | Get product by slug | No | — | `{ product, related, reviews }` |
| 27 | `/products/featured` | GET | Get featured products | No | — | `{ featured, newArrivals, bestsellers, onSale }` |
| 28 | `/products/search` | GET | Search products | No | `?q=&category=&sort=&page=&limit=` | `{ products, pagination, suggestions }` |
| 29 | `/products/autocomplete` | GET | Search autocomplete | No | `?q=` | `{ suggestions }` |

#### Category APIs

| # | Endpoint | Method | Purpose | Auth | Body / Query | Response |
|---|---|---|---|---|---|---|
| 30 | `/categories` | GET | List categories (tree) | No | — | `{ categories }` |
| 31 | `/categories/:slug` | GET | Get category + products | No | `?page=&limit=&sort=` | `{ category, products, pagination }` |

#### Cart APIs

| # | Endpoint | Method | Purpose | Auth | Body / Query | Response |
|---|---|---|---|---|---|---|
| 32 | `/cart` | GET | Get cart | Yes | — | `{ items, subtotal, itemCount }` |
| 33 | `/cart` | POST | Add to cart | Yes | `{ productId, quantity }` | `{ cart }` |
| 34 | `/cart` | PUT | Update cart item | Yes | `{ itemId, quantity }` | `{ cart }` |
| 35 | `/cart` | DELETE | Clear cart / remove item | Yes | `?itemId=` | `{ message }` |
| 36 | `/cart/coupon` | POST | Apply coupon | Yes | `{ couponCode }` | `{ discount, total }` |
| 37 | `/cart/coupon` | DELETE | Remove coupon | Yes | — | `{ message }` |
| 38 | `/cart/shipping` | POST | Check shipping rate | Yes | `{ pincode }` | `{ options }` |

#### Wishlist APIs

| # | Endpoint | Method | Purpose | Auth | Body / Query | Response |
|---|---|---|---|---|---|---|
| 39 | `/wishlist` | GET | Get wishlist | Yes | — | `{ items }` |
| 40 | `/wishlist` | POST | Add to wishlist | Yes | `{ productId }` | `{ message }` |
| 41 | `/wishlist/:productId` | DELETE | Remove from wishlist | Yes | — | `{ message }` |
| 42 | `/wishlist/move-to-cart/:productId` | POST | Move item to cart | Yes | — | `{ message }` |

#### Order APIs

| # | Endpoint | Method | Purpose | Auth | Body / Query | Response |
|---|---|---|---|---|---|---|
| 43 | `/orders` | POST | Create order | Yes | `{ items, addressId, paymentMethod, couponCode? }` | `{ order }` |
| 44 | `/orders` | GET | List user's orders | Yes | `?status=&page=&limit=` | `{ orders, pagination }` |
| 45 | `/orders/:id` | GET | Get order details | Yes | — | `{ order }` |
| 46 | `/orders/:id/cancel` | POST | Cancel order | Yes | `{ reason }` | `{ message }` |
| 47 | `/orders/:id/return` | POST | Request return | Yes | `{ reason, items }` | `{ message }` |
| 48 | `/orders/:id/invoice` | GET | Download invoice | Yes | — | `{ invoiceUrl }` |
| 49 | `/orders/:id/track` | GET | Track shipment | Yes | — | `{ tracking }` |
| 50 | `/orders/guest/track` | GET | Track guest order | No | `?orderNumber=&email=` | `{ order }` |

#### Payment APIs

| # | Endpoint | Method | Purpose | Auth | Body / Query | Response |
|---|---|---|---|---|---|---|
| 51 | `/payments/create-order` | POST | Create Razorpay order | Yes | `{ orderId }` | `{ razorpayOrder }` |
| 52 | `/payments/verify` | POST | Verify payment | Yes | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` | `{ message }` |
| 53 | `/payments/webhook/razorpay` | POST | Razorpay webhook | Webhook Sig | `{ event, payload }` | `{ ok }` |
| 54 | `/payments/:orderId/refund` | POST | Request refund | Admin | `{ amount?, reason }` | `{ refund }` |

#### Review APIs

| # | Endpoint | Method | Purpose | Auth | Body / Query | Response |
|---|---|---|---|---|---|---|
| 55 | `/products/:productId/reviews` | GET | List reviews | No | `?page=&limit=&sort=&rating=` | `{ reviews, pagination, stats }` |
| 56 | `/products/:productId/reviews` | POST | Create review | Yes | `{ rating, title, comment, images? }` | `{ review }` |
| 57 | `/reviews/:id` | PUT | Update review | Yes (owner) | `{ rating?, title?, comment? }` | `{ review }` |
| 58 | `/reviews/:id` | DELETE | Delete review | Yes (owner) | — | `{ message }` |
| 59 | `/reviews/:id/helpful` | POST | Vote helpful | Yes | `{ helpful: true/false }` | `{ message }` |

#### Blog APIs

| # | Endpoint | Method | Purpose | Auth | Body / Query | Response |
|---|---|---|---|---|---|---|
| 60 | `/blogs` | GET | List blogs | No | `?category=&tag=&page=&limit=` | `{ blogs, pagination }` |
| 61 | `/blogs/:slug` | GET | Get blog post | No | — | `{ blog, related }` |

#### Recipe APIs

| # | Endpoint | Method | Purpose | Auth | Body / Query | Response |
|---|---|---|---|---|---|---|
| 62 | `/recipes` | GET | List recipes | No | `?cuisine=&difficulty=&page=&limit=` | `{ recipes, pagination }` |
| 63 | `/recipes/:slug` | GET | Get recipe | No | — | `{ recipe }` |

#### Newsletter APIs

| # | Endpoint | Method | Purpose | Auth | Body / Query | Response |
|---|---|---|---|---|---|---|
| 64 | `/newsletter/subscribe` | POST | Subscribe | No | `{ email }` | `{ message }` |
| 65 | `/newsletter/unsubscribe` | POST | Unsubscribe | No | `{ email }` | `{ message }` |

#### Support APIs

| # | Endpoint | Method | Purpose | Auth | Body / Query | Response |
|---|---|---|---|---|---|---|
| 66 | `/support/tickets` | POST | Create ticket | Yes | `{ subject, message, category, orderId? }` | `{ ticket }` |
| 67 | `/support/tickets` | GET | List user's tickets | Yes | `?status=&page=` | `{ tickets, pagination }` |
| 68 | `/support/tickets/:id` | GET | Get ticket details | Yes | — | `{ ticket }` |
| 69 | `/support/tickets/:id/messages` | POST | Reply to ticket | Yes | `{ message, attachments? }` | `{ message }` |

#### Search APIs

| # | Endpoint | Method | Purpose | Auth | Body / Query | Response |
|---|---|---|---|---|---|---|
| 70 | `/search` | GET | Global search | No | `?q=&type=&page=` | `{ results, pagination }` |
| 71 | `/search/suggestions` | GET | Autocomplete | No | `?q=` | `{ suggestions }` |

#### Wholesale APIs

| # | Endpoint | Method | Purpose | Auth | Body / Query | Response |
|---|---|---|---|---|---|---|
| 72 | `/wholesale/register` | POST | Apply as wholesale buyer | Yes | `{ businessName, gstin, ... }` | `{ application }` |
| 73 | `/wholesale/products` | GET | List wholesale products | Wholesale | `?page=&limit=` | `{ products, pricing }` |
| 74 | `/wholesale/orders` | POST | Place wholesale order | Wholesale | `{ items, addressId, ... }` | `{ order }` |

#### Admin APIs (prefix: `/admin`)

| # | Endpoint | Method | Purpose | Auth | Body / Query | Response |
|---|---|---|---|---|---|---|
| 75 | `/admin/dashboard` | GET | Dashboard stats | Manager | — | `{ stats }` |
| 76 | `/admin/products` | GET | List all products | Employee | `?search=&category=&status=&page=&limit=` | `{ products, pagination }` |
| 77 | `/admin/products` | POST | Create product | Marketing | `{ ...product fields }` | `{ product }` |
| 78 | `/admin/products/:id` | PUT | Update product | Marketing | `{ ...fields }` | `{ product }` |
| 79 | `/admin/products/:id` | DELETE | Soft delete product | Manager | — | `{ message }` |
| 80 | `/admin/orders` | GET | List all orders | Employee | `?status=&search=&page=&limit=` | `{ orders, pagination }` |
| 81 | `/admin/orders/:id` | PUT | Update order status | Employee | `{ status, note?, trackingNumber? }` | `{ order }` |
| 82 | `/admin/users` | GET | List all users | Employee | `?search=&role=&page=&limit=` | `{ users, pagination }` |
| 83 | `/admin/inventory` | GET | Inventory overview | Employee | `?warehouse=&status=` | `{ inventory }` |
| 84 | `/admin/settings` | GET/PUT | Store settings | Manager | `{ key, value }` | `{ setting }` |
| 85 | `/admin/audit-logs` | GET | View audit logs | Manager | `?entity=&action=&page=&limit=` | `{ logs, pagination }` |
| 86 | `/admin/reports/sales` | GET | Sales report | Marketing | `?from=&to=&groupBy=` | `{ report }` |

### Rate Limits

| Endpoint Category | Limit | Window |
|---|---|---|
| Public GET endpoints | 100 requests | per minute per IP |
| Auth endpoints (login/register) | 10 requests | per 15 minutes per IP |
| OTP send | 3 requests | per 5 minutes per phone |
| Cart/Order operations | 30 requests | per minute per user |
| File upload | 10 requests | per minute per user |
| Admin endpoints | 200 requests | per minute per user |
| Search/autocomplete | 30 requests | per minute per IP |

### Idempotency

Required for: order creation, payment verification, refund processing

```
Client sends: X-Idempotency-Key: unique-uuid
Server stores: idempotency:{key} → { status: "processing"|"done", response: {...} }
If key exists and status=done → return cached response
If key exists and status=processing → return 409 Conflict
```
