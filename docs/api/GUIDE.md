# ORPIND API Guide

## Base URL

| Environment | URL |
|---|---|
| Development | `http://localhost:4000` |
| Staging | `https://api.staging.orpind.com` |
| Production | `https://api.orpind.com` |

## Authentication

### JWT Bearer Token

```
Authorization: Bearer <access_token>
```

Access tokens expire in 15 minutes. Use the refresh token endpoint to obtain new tokens.

### Cookie-Based Auth (Admin SPA)

The admin SPA stores JWT in httpOnly cookies. The `Authorization` header is set automatically by the client SDK.

### Error Codes

| Code | Meaning |
|---|---|
| `UNAUTHORIZED` | Missing or invalid token |
| `TOKEN_EXPIRED` | Access token expired |
| `FORBIDDEN` | Insufficient permissions |
| `RATE_LIMITED` | Too many requests |
| `VALIDATION_ERROR` | Invalid request body |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource already exists |

### Rate Limiting

| Endpoint | Limit | Window |
|---|---|---|
| `/api/v1/auth/*` | 5 requests | 1 minute per IP |
| `/api/v1/*` | 100 requests | 1 minute per user |
| General | 1000 requests | 1 minute per IP |

Rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Core Endpoints

### Products

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/products` | List products (paginated) |
| GET | `/api/v1/products/:id` | Get product detail |
| POST | `/api/v1/products` | Create product (admin) |
| PUT | `/api/v1/products/:id` | Update product (admin) |
| DELETE | `/api/v1/products/:id` | Delete product (admin) |

**Query Parameters (GET /products):**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `search` (string)
- `category` (string — slug)
- `sort` (string: `price_asc`, `price_desc`, `newest`, `popular`)
- `minPrice` / `maxPrice` (number)
- `tags` (comma-separated)

### Categories

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/categories` | List categories |
| GET | `/api/v1/categories/:slug` | Get category with products |
| POST | `/api/v1/categories` | Create category (admin) |
| PUT | `/api/v1/categories/:id` | Update category (admin) |
| DELETE | `/api/v1/categories/:id` | Delete category (admin) |

### Orders

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/orders` | List user orders |
| GET | `/api/v1/orders/:id` | Get order detail |
| POST | `/api/v1/orders` | Create order |
| PUT | `/api/v1/orders/:id/status` | Update order status (admin) |

### Auth

| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/logout` | Logout (invalidate refresh token) |

## Response Format

### Success
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "details": {
    "field": ["error description"]
  }
}
```

## Webhooks

| Webhook | Source | Purpose |
|---|---|---|
| Razorpay Payment | Razorpay | Payment confirmation |
| Razorpay Refund | Razorpay | Refund processing |
| Razorpay Subscription | Razorpay | Recurring payments |

Webhooks are signed with HMAC-SHA256. Verify the signature using your webhook secret before processing.
