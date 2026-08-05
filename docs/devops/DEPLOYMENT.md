# ORPIND Deployment Guide

## Architecture Overview

```
Cloudflare (DNS, CDN, WAF, DDoS)
    |
├── Vercel ────────── Vite SPA (admin.orpind.com)
├── Railway ───────── Express API (api.orpind.com)
├── MongoDB Atlas ─── Primary Database
├── Redis Cloud ───── Cache, Session, Queue
└── Cloudinary ────── Media Storage & Optimization
```

## Prerequisites

- Node.js 20+
- Docker & Docker Compose (for local Docker deployment)
- Accounts: Vercel, Railway, MongoDB Atlas, Redis Cloud, Cloudinary, Cloudflare, Sentry

## Environment Setup

### 1. Clone & Install

```bash
git clone https://github.com/orpind/orpind-website.git
cd orpind-website

# Install all dependencies
npm install
cd client && npm install && cd ..
cd backend && npm install && cd ..
```

### 2. Environment Variables

| File | Purpose |
|---|---|
| `.env` | Next.js (Prisma/PostgreSQL) — root level |
| `backend/.env` | Express backend (MongoDB, Redis, JWT, Razorpay, Cloudinary) |
| `client/.env` | Vite frontend (API URLs, Sentry, Razorpay) |

See `backend/.env.production` and `client/.env.production` for required variables.

### 3. Database Setup

**Development** (in-memory MongoDB):
```bash
cd backend
node dev.js  # Auto-starts MongoMemoryServer + seeds
```

**Production** (MongoDB Atlas):
1. Create M10+ cluster on Atlas
2. Whitelist deployment IPs (0.0.0.0/0 for Railway, or specific egress IPs)
3. Set `MONGO_URI` in production environment
4. Enable automated backups

## Deployment

### Backend (Railway)

```bash
# Via Railway CLI
railway login
railway up

# Or via GitHub Actions (automated on main merge)
# Configure secrets:
#   RAILWAY_DEPLOY_HOOK_PRODUCTION
#   RAILWAY_DEPLOY_HOOK_STAGING
```

**Railway Configuration:**
- Start command: `node src/server.js`
- Health check path: `/health`
- Minimum instances: 2
- Max instances: 10 (auto-scale)

### Frontend (Vercel)

```bash
# Via Vercel CLI
vercel --prod

# Or via GitHub Actions
# Configure secrets:
#   VERCEL_DEPLOY_HOOK_PRODUCTION
#   VERCEL_DEPLOY_HOOK_STAGING
```

**Vercel Configuration:**
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Domains: `admin.orpind.com` (staging), `orpind.com` (production)

### Docker Deployment

```bash
# Build and run all services
cd backend
docker compose -f docker-compose.prod.yml up -d

# Scale backend replicas
docker compose -f docker-compose.prod.yml up -d --scale app=4

# View logs
docker compose -f docker-compose.prod.yml logs -f app
```

## Rollback

### Vercel (Frontend)
1. Go to Vercel Dashboard → Deployments
2. Find last known-good deployment
3. Click "..." → "Promote to Production"

### Railway (Backend)
1. Go to Railway Dashboard → Deployments
2. Click "Rollback" on previous deployment

### Database (MongoDB Atlas)
1. Atlas → Backup → Restore
2. Select snapshot from before the incident
3. Choose current cluster or new cluster
4. Verify data integrity before pointing app to restored DB

## Monitoring

- **Errors**: Sentry (https://orpind.sentry.io)
- **Metrics**: Grafana (https://grafana.orpind.com)
- **Uptime**: Better Stack (https://status.orpind.com)
- **Logs**: Grafana Loki (integrated via pino-loki)

## CI/CD Pipeline

See `.github/workflows/ci.yml` for full pipeline definition.

**Flow:** `main` merge → Lint → Test → Security Scan → Docker Build → Deploy Staging → Deploy Production → Smoke Tests

## Domain Configuration

| Domain | Service | DNS |
|---|---|---|
| `orpind.com` | Vercel (Frontend) | CNAME to `cname.vercel-dns.com` |
| `api.orpind.com` | Railway (Backend) | CNAME to `railway.app` |
| `admin.orpind.com` | Vercel (Admin SPA) | CNAME to `cname.vercel-dns.com` |
| `status.orpind.com` | Better Stack | CNAME to `betteruptime.com` |

All DNS managed via Cloudflare with proxied (orange cloud) enabled.
