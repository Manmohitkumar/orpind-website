## 11. File Storage Architecture

### Cloudinary Integration

```
┌────────────────────────────────────────────────────────┐
│                    UPLOAD FLOW                          │
│                                                         │
│  Client ──── Multipart ──→ Express ──→ Multer           │
│                                        │                │
│                                   Memory/Temp           │
│                                        │                │
│                                   Validation           │
│                                   (type, size)          │
│                                        │                │
│                                   Cloudinary            │
│                                   Upload API            │
│                                        │                │
│                              ┌─────────┴─────────┐      │
│                              │  Original         │      │
│                              │  Thumbnail 150px  │      │
│                              │  Thumbnail 300px  │      │
│                              │  WebP version     │      │
│                              └─────────┬─────────┘      │
│                                        │                │
│                                   Store URLs            │
│                                   in MongoDB            │
│                                        │                │
│                              Return to Client           │
└────────────────────────────────────────────────────────┘
```

### Folder Structure (Cloudinary)

```
orpind/
├── products/
│   ├── main/                    # Product main images
│   └── gallery/                 # Product gallery images
├── categories/
├── blog/
├── recipes/
├── avatars/
├── banners/
├── cms/                         # CMS content images
├── invoices/                    # Generated PDFs
├── media/                       # General media library
└── temp/                        # Temporary uploads (auto-delete 24h)
```

### Image Processing Pipeline

```
Upload → Validation → Storage → Processing → Delivery

Validation:
  - Max size: 10MB (products), 5MB (avatars), 20MB (blog)
  - Allowed types: JPEG, PNG, WebP, GIF
  - Virus scan (future: Cloudinary addon)

Processing (Cloudinary transformations):
  - Products: 1200x1200 (main), 600x600, 300x300, 150x150
  - Avatars: 400x400, 200x200, 100x100
  - Blog: 1920x1080, 960x540, 480x270
  - Auto WebP conversion for all images
  - Quality optimization: auto (q_auto)
  - Format optimization: auto (f_auto)

Delivery:
  - Cloudinary CDN (global edge network)
  - Cache-Control: public, max-age=31536000, immutable
  - Signed URLs for private content (invoices)
```

### Signed URLs

Used for:
- Invoice PDFs (private, time-limited)
- Temporary upload URLs (direct browser-to-Cloudinary)
- Media preview before publishing

```javascript
const url = cloudinary.url(folder, {
  type: 'upload',
  resource_type: 'auto',
  sign_url: true,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
});
```

### Deletion Strategy

1. **Soft delete first:** Set `isDeleted: true` in media collection
2. **Actual deletion:** Background job deletes from Cloudinary after 30 days
3. **Usage check:** Before deletion, verify `usageCount === 0`
4. **Orphan cleanup:** Weekly job finds unreferenced media and deletes

### CDN Integration

- Cloudinary serves as CDN by default
- Custom domain: `cdn.orpind.com` → Cloudinary CNAME
- Cache headers configured per folder:
  - Products: 1 year (immutable)
  - Avatars: 30 days
  - CMS content: 7 days
  - Temp: no cache
