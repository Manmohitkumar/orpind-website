## 2. Architecture Selection

### Options Evaluated

#### Option A: Simple MVC
```
Controller → Service → Model
```
- **Pros:** Simple, fast to build
- **Cons:** Controllers bloat, services become god-objects, no clear boundaries, untestable at scale
- **Verdict:** REJECTED — cannot scale beyond 100K LOC

#### Option B: MVC + Services
```
Controller → Service → Model
```
- **Pros:** Business logic separated from HTTP layer
- **Cons:** Services still coupled to data access, no clear domain boundaries, shared database creates tight coupling
- **Verdict:** REJECTED — insufficient separation for multi-team growth

#### Option C: Feature-Based Modular + MVC + Services + Repository Pattern
```
Controller → Service → Repository → Model
(per feature module)
```
- **Pros:** Domain-driven boundaries, independently testable, each module encapsulates its own logic, easy to extract to microservices later
- **Cons:** Slightly more boilerplate, requires discipline
- **Verdict:** **SELECTED** — optimal balance of structure and flexibility

#### Option D: Clean Architecture
```
Controller → Use Case → Domain Entity → Repository Interface → Infrastructure
```
- **Pros:** Maximum testability, framework-independent
- **Cons:** Massive boilerplate, overkill for e-commerce CRUD, slow iteration
- **Verdict:** REJECTED for initial phase — adopt selectively in Phase 3

#### Option E: Microservices
```
API Gateway → Service A → DB A
           → Service B → DB B
           → Service C → DB C
```
- **Pros:** Independent scaling, deployment, technology choice
- **Cons:** Distributed transactions, network failures, operational complexity, 10x infrastructure cost, requires dedicated DevOps team
- **Verdict:** REJECTED for current scale — evolution target for Year 2-3

### Selected: Feature-Based Modular Monolith

**Justification:**

1. **Domain Boundaries:** Each module (Products, Orders, Payments) owns its models, services, controllers, routes, and validators. Changes in one module never leak into another.

2. **Repository Pattern:** Abstracts Mongoose from business logic. Switching to PostgreSQL later requires changing only repositories, not services.

3. **Testability:** Services depend on repository interfaces, enabling mock-based unit testing without database.

4. **Team Scaling:** Team A owns Products + Inventory. Team B owns Orders + Payments. No merge conflicts, no architectural conflicts.

5. **Extraction Path:** Any module can be extracted to a standalone service when it hits a scaling bottleneck.

### Evolution Path: Monolith → Microservices

```
Phase 1 (Months 0-12):     Feature-Based Modular Monolith
                            └── All modules in single deployment
                            └── Single MongoDB replica set
                            └── Single Redis instance

Phase 2 (Months 12-18):    Identify extraction candidates
                            └── Profile: Orders, Payments, Notifications
                            └── Add message bus (RabbitMQ/Kafka)
                            └── Define service interfaces

Phase 3 (Months 18-24):    Extract Payments service
                            └── Payments has highest external dependency
                            └── Isolated scaling for peak traffic
                            └── Regulatory compliance isolation

Phase 4 (Months 24-36):    Extract Notifications + Search
                            └── Notifications: multi-channel, retry-heavy
                            └── Search: Elasticsearch cluster
                            └── Orders + Products remain in monolith

Phase 5 (Months 36+):      Full microservices (if needed)
                            └── Each domain is a service
                            └── Event-driven architecture
                            └── Kubernetes orchestration
```

**Extraction Criteria (per module):**

| Signal | Threshold |
|---|---|
| Deployment frequency | >5/day for single module |
| Scaling requirement | 10x traffic vs. other modules |
| Team size | >8 engineers on single module |
| Failure isolation | Module failures crash entire system |
| Technology need | Module needs different tech stack |
