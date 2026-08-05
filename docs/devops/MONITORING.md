# ORPIND Monitoring Guide

## Stack

| Layer | Tool | Purpose |
|---|---|---|
| Errors | Sentry | Real-time error tracking with source maps |
| Metrics | Prometheus + Grafana | System and business KPIs |
| Logs | Loki (Grafana Cloud) | Centralized structured logs |
| Uptime | Better Stack | Synthetic monitoring, SSL expiry |
| Alerts | Grafana OnCall | PagerDuty-style on-call rotation |

## Dashboards

### Executive Dashboard
Panels: Revenue (24h), Active Users, Order Volume, Error Rate, p50/p95/p99 Latency

### Backend Dashboard
Panels: Request Rate, Response Time by Route, Error Count by Status, Memory/CPU per Pod, Connection Pool

### Database Dashboard
Panels: Connection Count, Query Execution Time, Index Usage, Disk IOPS, Replication Lag, Cache Hit Ratio

### Business Dashboard
Panels: Orders/Hour, Revenue/Hour, New Users, Top Products, Conversion Funnel

### Frontend Dashboard (Vercel)
Panels: Core Web Vitals (LCP, INP, CLS), JS Heap Size, Page Load Time, Bundle Size

## Alerting

### Critical (P1 — Page within 5 min)
- API p95 latency > 1s for 5 minutes
- Error rate > 2% for 5 minutes
- 5xx rate > 0.5% for 1 minute
- MongoDB CPU > 80% for 10 minutes
- Failed login > 10/min/IP for 1 minute

### Warning (P2 — Slack within 1 hour)
- Cache hit ratio < 70% for 10 minutes
- Queue backlog > 10,000 jobs for 5 minutes
- Disk usage > 85%
- SSL certificate expiry < 14 days

### Info (P3 — Next business day)
- npm audit warnings
- Unused indexes detected

## Logging

All logs are structured JSON via pino with the following schema:

```json
{
  "level": "info",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "service": "backend",
  "requestId": "req_abc123",
  "method": "POST",
  "path": "/api/v1/orders",
  "statusCode": 201,
  "duration": 142,
  "userId": "usr_xyz",
  "error": null
}
```

### Log Levels
- `error`: Application errors, caught exceptions
- `warn`: Deprecated APIs, rate limiting triggered
- `info`: Request lifecycle, business events (order created, payment received)
- `debug`: Development only, never enabled in production

### Retention
- Hot storage (Loki): 30 days
- Cold storage (S3/GCS): 90 days
- Logs older than 90 days are deleted
