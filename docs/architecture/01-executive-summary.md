# ORPIND — Backend Architecture Blueprint

**Version:** 1.0
**Date:** July 2026
**Status:** Production Architecture
**Classification:** Internal — Engineering Team

---

## Table of Contents

1. Executive Summary
2. Architecture Selection
3. High-Level Architecture
4. Folder Structure
5. Feature Modules
6. Database Design
7. ER Diagram
8. Authentication Strategy
9. Authorization Strategy
10. API Design Standards
11. File Storage Architecture
12. Search Architecture
13. Payment Architecture
14. Notification Architecture
15. Logging & Monitoring
16. Security Review
17. DevOps Strategy
18. Testing Strategy
19. Documentation Standards
20. Scalability Roadmap
21. Final Recommendations

---

## 1. Executive Summary

Orpind is a premium organic spices and grains e-commerce platform targeting the Indian market with future international expansion. This document defines the complete backend architecture designed to serve 1M+ users at national scale.

**Key Architectural Decisions:**

| Decision | Choice | Justification |
|---|---|---|
| Architecture Pattern | Feature-Based Modular Monolith | Separation of concerns without operational overhead of microservices at current scale |
| Database | MongoDB (Mongoose) | Schema flexibility for diverse product catalog, natural JSON alignment with Node.js, horizontal scaling via sharding |
| Cache | Redis | Sub-millisecond reads for product catalog, session management, rate limiting, queue backing |
| Queue | BullMQ (Redis-backed) | Mature job scheduling, retry logic, priority queues, dashboard monitoring |
| Search | MongoDB Text Search → Elasticsearch (Phase 2) | Start simple, migrate when search complexity demands it |
| Payments | Razorpay (primary) with abstraction layer | India-first with Stripe plug-in for international expansion |

**Scale Targets:**

| Metric | Current | 12-Month | 36-Month |
|---|---|---|---|
| Users | 10K | 100K | 1M+ |
| Daily Orders | 50 | 2,000 | 20,000+ |
| Products | 200 | 2,000 | 10,000+ |
| Concurrent Users | 100 | 5,000 | 50,000+ |
| API Latency (p95) | <200ms | <150ms | <100ms |
