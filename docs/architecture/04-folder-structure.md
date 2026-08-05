## 4. Folder Structure

```
backend/
├── src/
│   ├── config/              # Environment config, external service setup
│   │   ├── index.js         # Central config (env vars, defaults)
│   │   ├── database.js      # MongoDB connection (Mongoose)
│   │   ├── redis.js         # Redis client setup
│   │   ├── cloudinary.js    # Cloudinary configuration
│   │   ├── mailer.js        # Email transport (Nodemailer/Resend)
│   │   ├── bullmq.js        # Queue connection factory
│   │   ├── socket.js        # Socket.IO server setup
│   │   ├── swagger.js       # API docs config
│   │   └── logger.js        # Winston/Morgan config
│   │
│   ├── constants/           # App-wide enums, codes, messages
│   │   ├── index.js
│   │   ├── roles.js         # Role definitions & hierarchy
│   │   ├── permissions.js   # Permission matrix
│   │   ├── orderStatuses.js # Order lifecycle states
│   │   ├── errorCodes.js    # Application error codes
│   │   └── messages.js      # User-facing messages
│   │
│   ├── controllers/         # HTTP request/response handling only
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   ├── order.controller.js
│   │   ├── cart.controller.js
│   │   ├── wishlist.controller.js
│   │   ├── payment.controller.js
│   │   ├── coupon.controller.js
│   │   ├── review.controller.js
│   │   ├── blog.controller.js
│   │   ├── recipe.controller.js
│   │   ├── cms.controller.js
│   │   ├── media.controller.js
│   │   ├── inventory.controller.js
│   │   ├── shipping.controller.js
│   │   ├── notification.controller.js
│   │   ├── analytics.controller.js
│   │   ├── support.controller.js
│   │   ├── newsletter.controller.js
│   │   ├── seo.controller.js
│   │   ├── settings.controller.js
│   │   ├── audit.controller.js
│   │   ├── report.controller.js
│   │   ├── warehouse.controller.js
│   │   ├── employee.controller.js
│   │   ├── wholesale.controller.js
│   │   ├── affiliate.controller.js
│   │   ├── loyalty.controller.js
│   │   └── referral.controller.js
│   │
│   ├── services/            # Business logic (the "brain")
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── product.service.js
│   │   ├── category.service.js
│   │   ├── order.service.js
│   │   ├── cart.service.js
│   │   ├── wishlist.service.js
│   │   ├── payment.service.js
│   │   ├── coupon.service.js
│   │   ├── review.service.js
│   │   ├── blog.service.js
│   │   ├── recipe.service.js
│   │   ├── cms.service.js
│   │   ├── media.service.js
│   │   ├── inventory.service.js
│   │   ├── shipping.service.js
│   │   ├── notification.service.js
│   │   ├── email.service.js
│   │   ├── sms.service.js
│   │   ├── whatsapp.service.js
│   │   ├── analytics.service.js
│   │   ├── search.service.js
│   │   ├── support.service.js
│   │   ├── newsletter.service.js
│   │   ├── seo.service.js
│   │   ├── settings.service.js
│   │   ├── audit.service.js
│   │   ├── report.service.js
│   │   ├── warehouse.service.js
│   │   ├── employee.service.js
│   │   ├── wholesale.service.js
│   │   ├── affiliate.service.js
│   │   ├── loyalty.service.js
│   │   ├── referral.service.js
│   │   ├── invoice.service.js
│   │   ├── cache.service.js
│   │   └── file.service.js
│   │
│   ├── repositories/        # Database abstraction (Mongoose queries)
│   │   ├── user.repository.js
│   │   ├── product.repository.js
│   │   ├── category.repository.js
│   │   ├── order.repository.js
│   │   ├── cart.repository.js
│   │   ├── wishlist.repository.js
│   │   ├── payment.repository.js
│   │   ├── coupon.repository.js
│   │   ├── review.repository.js
│   │   ├── blog.repository.js
│   │   ├── recipe.repository.js
│   │   ├── cms.repository.js
│   │   ├── media.repository.js
│   │   ├── inventory.repository.js
│   │   ├── shipment.repository.js
│   │   ├── notification.repository.js
│   │   ├── support.repository.js
│   │   ├── newsletter.repository.js
│   │   ├── employee.repository.js
│   │   ├── audit.repository.js
│   │   ├── warehouse.repository.js
│   │   ├── affiliate.repository.js
│   │   ├── loyalty.repository.js
│   │   └── referral.repository.js
│   │
│   ├── models/              # Mongoose schemas + models
│   │   ├── user.model.js
│   │   ├── role.model.js
│   │   ├── permission.model.js
│   │   ├── address.model.js
│   │   ├── product.model.js
│   │   ├── category.model.js
│   │   ├── productImage.model.js
│   │   ├── inventory.model.js
│   │   ├── order.model.js
│   │   ├── orderItem.model.js
│   │   ├── payment.model.js
│   │   ├── coupon.model.js
│   │   ├── review.model.js
│   │   ├── blog.model.js
│   │   ├── recipe.model.js
│   │   ├── notification.model.js
│   │   ├── employee.model.js
│   │   ├── warehouse.model.js
│   │   ├── shipment.model.js
│   │   ├── auditLog.model.js
│   │   ├── seoMetadata.model.js
│   │   ├── media.model.js
│   │   ├── setting.model.js
│   │   ├── newsletterSubscriber.model.js
│   │   ├── supportTicket.model.js
│   │   ├── affiliateAccount.model.js
│   │   ├── loyaltyTransaction.model.js
│   │   ├── referralRecord.model.js
│   │   ├── cartItem.model.js
│   │   └── wishlistItem.model.js
│   │
│   ├── routes/              # URL → Controller mapping
│   │   ├── index.js         # Route aggregator
│   │   └── v1/              # Versioned routes (auth, user, product, etc.)
│   │
│   ├── validators/          # Request body/query validation (Joi/Zod)
│   ├── middleware/          # Cross-cutting concerns (auth, rate limit, etc.)
│   ├── interfaces/          # Contract definitions for DI
│   ├── types/               # TypeScript declarations (if migrating)
│   ├── database/
│   │   ├── seeders/         # Database seeders
│   │   └── migrations/      # Data migration scripts
│   ├── jobs/                # Background task definitions
│   ├── queues/              # BullMQ queue configuration
│   ├── events/              # Internal event definitions (pub/sub)
│   ├── webhooks/            # External webhook handlers
│   ├── emails/
│   │   ├── templates/       # Email HTML templates
│   │   └── render.js        # Template renderer
│   ├── notifications/
│   │   ├── templates/       # Notification templates
│   │   └── providers/       # Email, SMS, WhatsApp, Push providers
│   ├── utils/               # Pure functions, no side effects
│   ├── helpers/             # App-specific helper utilities
│   ├── security/            # Encryption, sanitization
│   ├── docs/swagger/        # OpenAPI specs
│   └── app.js               # Express app creation
│
├── tests/                   # Unit, Integration, E2E tests
├── scripts/                 # DevOps + utility scripts
├── storage/                 # Temp file storage (gitignored)
├── logs/                    # Runtime logs (gitignored)
├── nginx/nginx.conf         # Nginx configuration
├── Dockerfile               # Production Docker image
├── docker-compose.yml       # Development Docker setup
└── package.json
```

### Folder Purpose Summary

| Folder | Purpose | Owner |
|---|---|---|
| `config/` | Environment config, external service setup | DevOps |
| `constants/` | App-wide enums, codes, messages | All |
| `controllers/` | HTTP request/response handling only | Backend |
| `services/` | Business logic (the "brain") | Backend |
| `repositories/` | Database abstraction (Mongoose queries) | Backend |
| `models/` | Mongoose schemas + models | Database |
| `routes/` | URL → Controller mapping | Backend |
| `validators/` | Request body/query validation schemas | Backend |
| `middleware/` | Cross-cutting concerns (auth, rate limit, etc.) | Backend |
| `interfaces/` | Contract definitions for DI | Architecture |
| `database/` | Seeders, migrations, fixtures | Database |
| `jobs/` | Background task definitions | Backend |
| `queues/` | BullMQ queue configuration | Backend |
| `events/` | Internal event definitions (pub/sub) | Backend |
| `webhooks/` | External webhook handlers | Backend |
| `emails/` | Email templates + renderer | Frontend/Backend |
| `notifications/` | Multi-channel notification templates | Backend |
| `utils/` | Pure functions, no side effects | All |
| `helpers/` | App-specific helper utilities | All |
| `security/` | Encryption, sanitization | Security |
| `docs/` | API specifications (OpenAPI) | Architecture |
| `tests/` | All test files | QA/Backend |
| `scripts/` | DevOps + utility scripts | DevOps |
| `storage/` | Temp file storage (gitignored) | DevOps |
| `logs/` | Runtime logs (gitignored) | DevOps |
