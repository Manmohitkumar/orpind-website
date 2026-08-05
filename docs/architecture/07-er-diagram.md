## 7. ER Diagram

```
                            ┌──────────────┐
                            │   ROLES      │
                            │──────────────│
                            │ _id          │
                            │ name         │
                            │ level        │
                            │ permissions[]│──→ ┌──────────────┐
                            └──────┬───────┘    │ PERMISSIONS  │
                                   │            │──────────────│
                                   │            │ _id          │
                                   │            │ name         │
                                   │            │ resource     │
                                   │            │ action       │
                            1      │            └──────────────┘
                            │      │
                      ┌─────▼──────▼────┐
                      │     USERS       │
                      │─────────────────│
                      │ _id             │
                      │ firstName       │
                      │ lastName        │
                      │ email (unique)  │◄──────────────┐
                      │ phone (unique)  │               │
                      │ password        │               │
                      │ role ───────────│──→ Roles      │
                      │ isEmailVerified │               │
                      │ isActive        │               │
                      └───┬────┬────┬───┘               │
                          │    │    │                   │
              ┌───────────┘    │    └──────────┐        │
              │                │               │        │
        1:N   │           1:N  │          1:N  │   1:N  │
              ▼                ▼               ▼        │
        ┌──────────┐    ┌──────────┐    ┌──────────┐   │
        │ADDRESSES │    │  CART    │    │ WISHLIST │   │
        │──────────│    │  ITEMS   │    │  ITEMS   │   │
        │ userId   │    │──────────│    │──────────│   │
        │ firstName│    │ userId   │    │ userId   │   │
        │ lastName │    │productId │    │productId │   │
        │ phone    │    │ quantity │    └──────────┘   │
        │ address  │    └──────────┘                    │
        │ city     │                                   │
        │ state    │                                   │
        │ pincode  │                                   │
        │isDefault │                                   │
        └──────────┘                                   │
                                                       │
              ┌────────────────────────────────────────┘
              │
              │         1:N
              ▼
        ┌──────────────┐       N:1       ┌──────────────┐
        │    ORDERS    │─────────────────│  PRODUCTS    │
        │──────────────│                 │──────────────│
        │ orderNumber  │    ┌───────────│ _id          │
        │ userId ──────│──→ │           │ name         │
        │ status       │    │           │ slug         │
        │ items[] ─────│────┘           │ sku          │
        │ subtotal     │                │ price        │
        │ total        │                │ categoryId ──│──→ ┌──────────┐
        │ paymentMethod│                │ images[]     │    │CATEGORIES│
        │ trackingNo   │                │ tags[]       │    │──────────│
        │ statusHistory│                │ isActive     │    │ _id      │
        └──────┬───────┘                └──────────────┘    │ name     │
               │                                             │ slug     │
               │ 1:N                                         │ parent ──│──→ self
               ▼                                             └──────────┘
        ┌──────────────┐
        │   PAYMENTS   │
        │──────────────│
        │ orderId      │
        │ provider     │
        │ amount       │
        │ status       │
        │ method       │
        └──────────────┘

        ┌──────────────┐      N:1       ┌──────────────┐
        │   REVIEWS    │─────────────────│  PRODUCTS    │
        │──────────────│                 │──────────────│
        │ userId ──────│──→ Users        │              │
        │ productId ───│──→ Products     │              │
        │ orderId ─────│──→ Orders       │              │
        │ rating       │                 │              │
        │ comment      │                 │              │
        │ isApproved   │                 │              │
        └──────────────┘                 └──────────────┘

        ┌──────────────┐
        │  INVENTORY   │
        │──────────────│
        │ productId ───│──→ Products
        │ warehouseId ─│──→ Warehouses
        │ quantity     │
        │ reserved     │
        │ batchNumber  │
        └──────────────┘

        ┌──────────────┐
        │  SHIPMENTS   │
        │──────────────│
        │ orderId ─────│──→ Orders
        │ carrier      │
        │ trackingNo   │
        │ events[]     │
        └──────────────┘
```

### Relationship Types

| Relationship | Type | Strategy | Justification |
|---|---|---|---|
| User → Address | One-to-Many | Referenced | Addresses change independently, need own CRUD |
| User → Cart Items | One-to-Many | Referenced | Cart items are lightweight, frequently accessed together |
| User → Wishlist Items | One-to-Many | Referenced | Same as cart |
| User → Orders | One-to-Many | Referenced | Orders are independent aggregate roots |
| User → Reviews | One-to-Many | Referenced | Reviews need independent lifecycle (moderation) |
| Product → Category | Many-to-One | Referenced | Category is a shared entity |
| Product → Images | One-to-Many | Embedded | Images always load with product, never independent |
| Product → Inventory | One-to-One/Many | Referenced | Inventory per warehouse, separate lifecycle |
| Order → Order Items | One-to-Many | Embedded | Items snapshot at order time, never change |
| Order → Payments | One-to-Many | Referenced | Payments have own lifecycle (refunds) |
| Order → Shipment | One-to-One | Referenced | Shipment tracks independently |
| Role → Permissions | Many-to-Many | Referenced (array of IDs) | Permissions are shared across roles |
| Category → Category | Self-referential | Referenced (parent) | Tree structure with materialized path |
| Coupon → Products | Many-to-Many | Referenced (array of IDs) | Coupon applicability |

**Embedded vs Referenced Decision Rules:**
1. **Embed** if: data is always read together, data is < 16MB total, data doesn't change independently
2. **Reference** if: data has its own lifecycle, data is large, data is shared across entities, needs independent CRUD
