## 3. High-Level Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ Customer │  │  Admin   │  │  Mobile  │  │ Webhook  │               │
│  │   Web    │  │Dashboard │  │   App    │  │ Callers  │               │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘               │
└───────┼──────────────┼──────────────┼──────────────┼─────────────────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         NGINX REVERSE PROXY                             │
│  SSL Termination · Rate Limiting · Load Balancing · Gzip Compression    │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      EXPRESS SERVER (Node.js)                           │
│                                                                         │
│  Middleware Pipeline:                                                    │
│  Request → Helmet → CORS → Body Parser → Request ID → Morgan            │
│         → Rate Limiter → Auth Extractor → Validator                      │
│                                    │                                    │
│                                    ▼                                    │
│  API Gateway (Logical):                                                  │
│  Auth Verify → RBAC Guard → Rate Limit → Request Validate               │
│                                    │                                    │
│                                    ▼                                    │
│  Route Handlers:                                                         │
│  /auth/* → AuthController    /products/* → ProductController            │
│  /orders/* → OrderController /payments/* → PaymentController            │
│  /admin/* → AdminController  ... (30+ route groups)                     │
│                                    │                                    │
│                                    ▼                                    │
│  Service Layer (Business Logic):                                         │
│  AuthService · ProductService · OrderService · PaymentService           │
│  InventoryService · NotificationService · ...                            │
│                                    │                                    │
│                                    ▼                                    │
│  Repository Layer (Data Access):                                         │
│  UserRepository · ProductRepository · OrderRepository ...               │
│  (Mongoose ODM operations only — no business logic)                     │
└────────────────────────────────────┼────────────────────────────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│    MongoDB          │ │      Redis          │ │    Cloudinary       │
│  Primary (Write)    │ │  Cache (Read)       │ │  Images CDN         │
│  Secondary (Read)   │ │  Sessions           │ │  WebP Generation    │
│  Arbiter            │ │  Rate Limiters      │ │  Thumbnails         │
│                     │ │  BullMQ (Queues)    │ │  Signed URLs        │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘
              │                      │
              ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     BACKGROUND WORKERS (BullMQ)                         │
│  Email Worker · Image Processor · Invoice Generator · Analytics Worker  │
│  Cleanup Worker · Notification Dispatch · Inventory Sync · SEO Indexer  │
└─────────────────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                                     │
│  Razorpay · Resend/SES · MSG91 · WhatsApp Business · Google OAuth      │
│  Shiprocket · Sentry · Analytics (Segment)                              │
└─────────────────────────────────────────────────────────────────────────┘
```

### Request/Response Flow

```
1.  Client sends POST /api/v1/orders
2.  Nginx terminates SSL, adds X-Request-ID, logs access
3.  Express receives request
4.  Middleware Pipeline executes sequentially:
    a. Helmet — security headers
    b. CORS — origin validation
    c. Body Parser — JSON parsing (1MB limit)
    d. Request ID — attach/propagate
    e. Morgan — request logging
    f. Rate Limiter — 100 req/min per IP
    g. Auth Extractor — decode JWT, attach user to request
5.  Router matches /api/v1/orders → OrderController.create
6.  Validator (Joi/Zod) validates request body
7.  Authorization guard checks role: CUSTOMER
8.  OrderService.createOrder():
    a. Validate products exist and have stock
    b. Calculate totals, apply coupons
    c. Begin MongoDB transaction
    d. Create order + order items
    e. Decrement inventory
    f. Clear cart
    g. Commit transaction
    h. Publish "order.created" event
9.  Response returned: { status: 201, order: {...} }
10. Async workers pick up events:
    a. Email Worker → send order confirmation
    b. Notification Worker → in-app notification
    c. Analytics Worker → track conversion
11. Redis caches product data invalidation
```
