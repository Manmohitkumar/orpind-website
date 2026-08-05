## 15. Logging & Monitoring

### Structured Logging Stack

```
Request → Morgan → Winston Transport →
  Console (dev only) | File (rotation) | External (Sentry)

Log Levels: error → warn → info → http → debug

Log Format (JSON):
{
  "timestamp": "2026-07-27T12:00:00.000Z",
  "level": "info",
  "message": "Order created",
  "requestId": "req_abc123",
  "userId": "user_xyz",
  "method": "POST",
  "path": "/api/v1/orders",
  "statusCode": 201,
  "duration": 145,
  "metadata": { orderId: "ORD-001" }
}
```

### Log Categories

| Category | File | Retention | Purpose |
|---|---|---|---|
| Application | app.log | 30 days | General app logs |
| Error | error.log | 90 days | All errors with stack traces |
| Access | access.log | 30 days | HTTP request/response |
| Audit | audit.log | 365 days | Entity changes, user actions |
| Security | security.log | 90 days | Auth failures, rate limits |
| Performance | perf.log | 7 days | Slow queries, slow requests |

### Log Rotation

```javascript
{
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '50m',
  maxFiles: '30d',
  zippedArchive: true,
}
```

### Monitoring Stack

```
┌────────────────────────────────────────────────────────┐
│                  MONITORING                             │
│                                                         │
│  Health Check (every 30s)                               │
│  GET /health → { status, checks }                       │
│                                                         │
│  Sentry (Error Tracking)                                │
│  → Unhandled exceptions, Promise rejections             │
│  → Manual capture, Performance traces                   │
│                                                         │
│  Custom Metrics:                                        │
│  → API latency (p50, p95, p99)                         │
│  → Request count, Error rate                            │
│  → Database connection pool, Redis memory               │
│  → Queue depth, Active connections                      │
│                                                         │
│  Health Check Response:                                 │
│  {                                                      │
│    "status": "healthy",                                 │
│    "checks": {                                          │
│      "database": "healthy",                             │
│      "redis": "healthy",                                │
│      "queues": "healthy",                               │
│      "external": "degraded"                             │
│    },                                                   │
│    "uptime": 86400,                                     │
│    "version": "1.0.0"                                   │
│  }                                                      │
└────────────────────────────────────────────────────────┘
```

### Performance Metrics

| Metric | Target | Alert Threshold |
|---|---|---|
| API Latency (p95) | <150ms | >500ms |
| API Latency (p99) | <300ms | >1000ms |
| Error Rate | <0.1% | >1% |
| Database Query Time | <50ms | >200ms |
| Redis Hit Rate | >90% | <70% |
| Queue Processing Time | <5s | >30s |
| Memory Usage | <70% | >85% |
| CPU Usage | <60% | >80% |
