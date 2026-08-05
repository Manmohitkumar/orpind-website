## 17. DevOps Strategy

### Docker Architecture

```dockerfile
# Multi-stage build
Stage 1: builder
  - Node.js 20 Alpine
  - npm ci (install dependencies)
  - npm run build (if TypeScript)

Stage 2: runner
  - Node.js 20 Alpine
  - Copy node_modules from builder
  - Copy source code
  - Non-root user (nodejs:nodejs)
  - Expose port 3000
  - CMD ["node", "src/server.js"]
```

### Docker Compose (Development)

```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment: [DATABASE_URL, REDIS_URL, ...]
    depends_on: [mongo, redis]
    volumes: [./src:/app/src]

  mongo:
    image: mongo:7
    ports: ["27017:27017"]
    volumes: [mongo_data:/data/db]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    volumes: [redis_data:/data]

  worker:
    build: .
    command: ["node", "src/workers/index.js"]
    depends_on: [mongo, redis]

volumes:
  mongo_data:
  redis_data:
```

### Nginx Configuration

```nginx
upstream app {
    server app:3000;
}

server {
    listen 80;
    server_name api.orpind.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.orpind.com;

    ssl_certificate /etc/letsencrypt/live/api.orpind.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.orpind.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    location / {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### GitHub Actions CI/CD

```yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongo: { image: mongo:7 }
      redis: { image: redis:7-alpine }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm run test:unit
      - run: npm run test:integration
        env:
          DATABASE_URL: mongodb://localhost:27017/orpind_test
          REDIS_URL: redis://localhost:6379

  build:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t orpind-api .
      - run: docker push registry/orpind-api:$GITHUB_SHA
```

### Environment Promotion

```
Feature Branch → PR → main → Staging → Production

Development:
  - Local Docker Compose
  - Hot reload
  - Seed data

Staging:
  - Auto-deploy on main push
  - Mirror production config
  - Integration tests against staging

Production:
  - Manual approval required
  - Blue/Green deployment
  - Health check verification
  - Automatic rollback on failure
```

### Deployment Checklist

```
□ All tests passing
□ Lint clean
□ Docker image built
□ Database migrations run
□ Environment variables set
□ Health check endpoint responding
□ SSL certificates valid
□ DNS configured
□ Monitoring alerts configured
□ Backup verified
□ Rollback plan documented
```
