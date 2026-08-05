## 9. Authorization Strategy

### RBAC Model

```
┌──────────────────────────────────────────────────────┐
│                   ROLE HIERARCHY                      │
│                                                       │
│  SUPER_ADMIN (5)                                      │
│       │                                               │
│  ┌────┴────┐                                          │
│  │         │                                          │
│  OWNER (4) │                                          │
│  │         │                                          │
│  MANAGER (3)                                          │
│  │                                                     │
│  ├── EMPLOYEE (2)                                      │
│  │    ├── WAREHOUSE_STAFF                              │
│  │    ├── SUPPORT_EXECUTIVE                            │
│  │    └── MARKETING                                    │
│  │                                                     │
│  WHOLESALE (1)                                         │
│  │                                                     │
│  CUSTOMER (0)                                          │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### Permission Matrix

| Module | Resource | Customer | Wholesale | Employee | Warehouse | Support | Marketing | Manager | Owner | Super Admin |
|---|---|---|---|---|---|---|---|---|---|---|
| Products | Read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Products | Create | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Products | Update | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Products | Delete | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Orders | Read (own) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Orders | Read (all) | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Orders | Update | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Users | Read (own) | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Users | Read (all) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Users | Update | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Users | Delete | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Inventory | Read | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Inventory | Update | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Payments | Read | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Payments | Refund | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Settings | Read | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Settings | Update | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Employees | CRUD | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Analytics | Read | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Audit Logs | Read | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

### Middleware Implementation Pattern

```javascript
// 1. Auth middleware — extracts user from JWT
authMiddleware(req, res, next)

// 2. Role middleware — checks role level
roleMiddleware('MANAGER')(req, res, next)

// 3. Permission middleware — checks specific permission
permissionMiddleware('products:create')(req, res, next)

// 4. Ownership middleware — checks if user owns the resource
ownershipMiddleware(Order, 'userId')(req, res, next)

// Route definition:
router.get('/orders/:id',
  authMiddleware,
  ownershipMiddleware(Order, 'userId'),
  orderController.getById
);

router.get('/admin/orders',
  authMiddleware,
  roleMiddleware('EMPLOYEE'),
  permissionMiddleware('orders:read_all'),
  orderController.getAll
);
```

### Dynamic Permission Management

- Permissions stored in database, not hardcoded
- Admin UI to create/edit permissions
- Role-permission mapping changeable at runtime
- Permission cache in Redis (invalidated on role update)
- New permissions added via migration script
