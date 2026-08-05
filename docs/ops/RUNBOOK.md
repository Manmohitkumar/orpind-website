# ORPIND Operations Runbook

## Health Check Endpoints

| Endpoint | Expected Response | Check Interval |
|---|---|---|
| `GET /health` | `{"status":"ok","uptime":...}` | 30s |
| `GET /health/db` | `{"status":"ok","db":"connected"}` | 60s |
| `GET /health/redis` | `{"status":"ok","redis":"connected"}` | 60s |

## Common Failure Scenarios

### Scenario 1: Backend Not Responding

**Symptoms:** API returns 502/503, health check fails

**Triage:**
1. Check Railway dashboard for pod status
2. Check logs: `railway logs --service backend`
3. Check if MongoDB Atlas is reachable
4. Check if Redis Cloud is reachable

**Recovery:**
1. Restart pods: `railway restart`
2. If single pod issue: Railway auto-restarts within 30s
3. If all pods failing: Rollback to previous deployment
4. If DB/Redis down: Check respective dashboards

### Scenario 2: High Error Rate

**Symptoms:** Sentry alerts, >2% error rate

**Triage:**
1. Check Sentry for new error patterns
2. Check recent deployment
3. Check MongoDB Atlas performance
4. Check if a specific endpoint is failing

**Recovery:**
1. If caused by recent deploy: Rollback immediately
2. If DB-related: Check indexes, slow queries, connection pool
3. If third-party (Razorpay, Cloudinary): Check their status pages
4. If rate limiting: Adjust limits

### Scenario 3: Database High CPU/Latency

**Symptoms:** Slow API responses, Atlas CPU >80%

**Triage:**
1. Check Atlas Metrics → CPU, Connections, Queued Operations
2. Check slow query log in Atlas
3. Check if new index is needed

**Recovery:**
1. Add missing indexes (use Atlas Performance Advisor)
2. Scale up Atlas tier if needed (M10 → M30)
3. Reduce load with Redis caching (check cache hit ratio)
4. Consider read replicas for reporting queries

### Scenario 4: Redis Outage

**Symptoms:** Slow responses, rate limiting disabled, queue jobs failing

**Triage:**
1. Check Redis Cloud dashboard
2. Check if Redis is reachable from backend

**Recovery:**
1. Backend falls back to DB reads (graceful degradation)
2. Rate limiting falls back to in-memory (less accurate)
3. Queue jobs will retry
4. If persistent: Failover to Redis replica

### Scenario 5: Security Incident

**Symptoms:** Unauthorized access detected, suspicious activity

**Triage:**
1. Check auth logs
2. Check rate limiting alerts
3. Check IP origins

**Recovery:**
1. Revoke all JWT tokens (increment token version in DB)
2. Rotate secrets (JWT, API keys)
3. Block offending IPs via Cloudflare WAF
4. Enable bot fight mode in Cloudflare
5. Notify affected users if data potentially exposed

### Scenario 6: Payment Processing Failure

**Symptoms:** Orders stuck in "pending payment", Razorpay webhook failures

**Triage:**
1. Check Razorpay dashboard
2. Check webhook delivery logs in Razorpay
3. Check backend logs for webhook handler errors

**Recovery:**
1. Check webhook secret matches
2. Replay failed webhooks from Razorpay dashboard
3. Manually reconcile orders if needed
4. Contact Razorpay support if systemic

## On-Call Procedures

1. Acknowledge alert within 5 minutes (P1) or 30 minutes (P2)
2. Join #incidents Slack channel
3. Follow runbook for the scenario
4. Escalate if not resolved within SLA
5. Post-mortem within 72 hours for P1

## Scheduled Maintenance

- **Database migrations**: Wednesdays 02:00-04:00 IST
- **OS/security patches**: Monthly first Sunday
- **SSL renewal**: Automatic (90-day Let's Encrypt)
- **Dependency updates**: Weekly Dependabot PR review

## Backup Verification

- **Daily**: Automated Atlas backup runs (verify in Atlas dashboard)
- **Weekly**: Manual spot-check of backup completion
- **Monthly**: Full restore drill (restore to staging, verify data)

## Emergency Contacts

| Role | Primary | Secondary |
|---|---|---|
| DevOps/SRE | [On-call via PagerDuty] | [Backup contact] |
| Backend Lead | [Name] | [Name] |
| Security | [Name] | [Name] |
| MongoDB Atlas | Support portal | 24/7 support |
| Cloudflare | Support portal | Community forums |
| Razorpay | Account manager | Support portal |
