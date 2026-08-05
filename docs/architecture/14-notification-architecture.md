## 14. Notification Architecture

### Multi-Channel System

```
┌────────────────────────────────────────────────────────┐
│              NOTIFICATION SYSTEM                        │
│                                                         │
│  Event Trigger                                          │
│       │                                                 │
│       ▼                                                 │
│  NotificationService.create({                           │
│    userId, type, channels, data                         │
│  })                                                     │
│       │                                                 │
│       ├──→ In-App: Save to notifications collection     │
│       │                                                 │
│       ├──→ Email Queue: BullMQ job                      │
│       │         → Render template                       │
│       │         → Send via Resend/SES                   │
│       │         → Retry on failure (3 attempts)         │
│       │                                                 │
│       ├──→ SMS Queue: BullMQ job (future)               │
│       │         → MSG91 API                             │
│       │                                                 │
│       └──→ WhatsApp Queue: BullMQ job (future)          │
│                 → WhatsApp Business API                  │
│                                                         │
└────────────────────────────────────────────────────────┘
```

### Email Templates

| Template | Trigger | Priority |
|---|---|---|
| Welcome | Registration | High |
| Email Verification | Registration | High |
| Password Reset | Password reset request | High |
| Order Confirmation | Order placed | High |
| Order Shipped | Status → SHIPPED | High |
| Order Delivered | Status → DELIVERED | Medium |
| Refund Processed | Refund completed | High |
| Invoice | Order confirmed | Medium |
| Review Request | 3 days after delivery | Low |
| Abandoned Cart | 24h after abandonment | Low |
| Newsletter | Scheduled campaign | Low |
| Promotional | Campaign trigger | Low |
| Stock Alert | Back-in-stock | Medium |

### Retry Policy

```
Email Send:
  Attempt 1: Immediate
  Attempt 2: 30 seconds delay
  Attempt 3: 2 minutes delay
  Attempt 4: 10 minutes delay
  Attempt 5: 1 hour delay
  
  After 5 failures → Mark as "failed", alert admin
  
SMS Send:
  Attempt 1: Immediate
  Attempt 2: 1 minute delay
  Attempt 3: 5 minutes delay
  
  After 3 failures → Mark as "failed"
```

### User Preferences

```javascript
{
  email: {
    orderUpdates: true,
    promotions: true,
    newsletter: true,
    reviewRequests: true,
    stockAlerts: true,
  },
  sms: {
    orderUpdates: true,
    promotions: false,
  },
  whatsapp: {
    orderUpdates: true,
    promotions: false,
  },
  inApp: {
    orderUpdates: true,
    promotions: true,
    systemAlerts: true,
  },
}
```
