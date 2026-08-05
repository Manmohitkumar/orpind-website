## 12. Search Architecture

### Phase 1: MongoDB Text Search

**Implementation:**
```javascript
db.products.createIndex({
  name: 'text',
  description: 'text',
  tags: 'text',
  sku: 'text',
}, {
  weights: { name: 10, tags: 5, description: 2, sku: 1 },
  name: 'product_search_index',
});
```

**Search Pipeline:**
```javascript
const searchProducts = async (query, filters) => {
  const pipeline = [];

  if (query) {
    pipeline.push({
      $match: {
        $text: { $search: query },
        isActive: true,
        isDeleted: false,
      },
    });
    pipeline.push({
      $addFields: { score: { $meta: 'textScore' } },
    });
  } else {
    pipeline.push({ $match: { isActive: true, isDeleted: false } });
  }

  pipeline.push({
    $facet: {
      results: [
        ...(query ? [{ $sort: { score: -1 } }] : [{ $sort: { isBestseller: -1, createdAt: -1 } }]),
        { $skip: (filters.page - 1) * filters.limit },
        { $limit: filters.limit },
      ],
      totalCount: [{ $count: 'count' }],
      categories: [
        { $group: { _id: '$categoryId', count: { $sum: 1 } } },
      ],
      priceRange: [
        { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } },
      ],
    },
  });

  return Product.aggregate(pipeline);
};
```

**Autocomplete:**
```javascript
const autocomplete = async (q) => {
  return Product.find({
    name: { $regex: q, $options: 'i' },
    isActive: true,
  })
  .select('name slug images price')
  .limit(8);
};
```

### Phase 2: Elasticsearch Migration (when needed)

**Triggers for migration:**
- Search latency > 200ms consistently
- Need for advanced features (fuzzy matching, synonyms, faceted search)
- Multi-language support needed
- Search analytics needed

**Migration strategy:**
1. Set up Elasticsearch cluster (3 nodes minimum)
2. Use MongoDB River/Connector for data sync
3. Build search API with Elasticsearch client
4. A/B test: MongoDB search vs Elasticsearch
5. Gradual traffic shift
6. Full cutover

### Search Ranking

```
Score = (text_relevance * 10)
      + (is_featured * 5)
      + (is_bestseller * 3)
      + (average_rating * 2)
      + (recency_score * 1)
      - (out_of_stock * 20)
```

### Search Suggestions

```javascript
// Stored in Redis for fast access
// Key: search:suggestions:{first_two_chars}
// Updated daily via background job

// "tur" → ["turmeric", "turmeric powder", "turmeric latte mix"]
```
