'use client';

import { useState } from 'react';
import { Search, Star, CheckCircle, XCircle, Eye, ThumbsUp, Filter } from 'lucide-react';
import { products } from '@/data/products';

interface Review {
  id: string;
  productId: string;
  productName: string;
  reviewerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  helpfulCount: number;
}

const initialReviews: Review[] = [
  { id: '1', productId: '1', productName: 'Punjabi Garam Masala', reviewerName: 'Priya Sharma', rating: 5, title: 'Best garam masala I have ever used!', comment: 'The aroma is incredible. You can clearly taste the difference compared to store-bought brands. My butter chicken has never tasted better.', date: '2024-03-20', isVerified: true, status: 'approved', helpfulCount: 24 },
  { id: '2', productId: '1', productName: 'Punjabi Garam Masala', reviewerName: 'Arjun Singh', rating: 5, title: 'Authentic Punjabi flavor', comment: 'Reminds me of my grandmother\'s homemade masala. The freshness is unmatched. Will keep ordering from Orpind.', date: '2024-03-18', isVerified: true, status: 'approved', helpfulCount: 18 },
  { id: '3', productId: '2', productName: 'Kashmiri Red Chilli', reviewerName: 'Neha Gupta', rating: 4, title: 'Great color, mild heat', comment: 'Perfect for my tandoori marinade. Gives a beautiful red color without being too spicy. Slightly pricey but worth it for the quality.', date: '2024-03-15', isVerified: true, status: 'approved', helpfulCount: 12 },
  { id: '4', productId: '3', productName: 'Organic Basmati Rice', reviewerName: 'Vikram Patel', rating: 5, title: 'The best basmati rice', comment: 'The grains are incredibly long and aromatic. Makes the fluffiest rice I have ever cooked. The 2-year aging really makes a difference.', date: '2024-03-12', isVerified: true, status: 'approved', helpfulCount: 31 },
  { id: '5', productId: '14', productName: 'Biryani Masala', reviewerName: 'Chef Harpal', rating: 5, title: 'Restaurant quality at home', comment: 'As a chef, I am very particular about spice blends. Orpind\'s Biryani Masala is the closest to authentic Lucknowi biryani I have found.', date: '2024-03-10', isVerified: true, status: 'approved', helpfulCount: 42 },
  { id: '6', productId: '4', productName: 'Haldi (Turmeric) Powder', reviewerName: 'Rajiv Mehra', rating: 3, title: 'Good but packaging could be better', comment: 'The turmeric quality is great and the color is vibrant. However, the pouch packaging was slightly damaged during delivery. Product itself is excellent.', date: '2024-03-21', isVerified: false, status: 'pending', helpfulCount: 5 },
  { id: '7', productId: '6', productName: 'Sabji Masala', reviewerName: 'Kavita Joshi', rating: 2, title: 'Not as expected', comment: 'I found the masala a bit too salty for my taste. The flavor profile was decent but could use less salt. Might not reorder.', date: '2024-03-22', isVerified: true, status: 'pending', helpfulCount: 3 },
  { id: '8', productId: '12', productName: 'Jeera (Cumin) Seeds', reviewerName: 'Deepak Verma', rating: 4, title: 'Fresh and aromatic cumin', comment: 'The cumin seeds are very fresh and have a strong aroma. Great for tempering. I use them daily for my tadka.', date: '2024-03-19', isVerified: false, status: 'pending', helpfulCount: 7 },
  { id: '9', productId: '11', productName: 'Heritage Spice Box', reviewerName: 'Meera Kaur', rating: 5, title: 'Perfect gift for my mother', comment: 'Bought this as a gift for my mother and she absolutely loved it. The wooden box is beautifully crafted and the brass containers are premium quality.', date: '2024-03-08', isVerified: true, status: 'rejected', helpfulCount: 15 },
  { id: '10', productId: '9', productName: 'Multi-Grain Atta', reviewerName: 'Suresh Kumar', rating: 1, title: 'Spam review', comment: 'Buy cheap spices at www DOT spam-link DOT com', date: '2024-03-22', isVerified: false, status: 'rejected', helpfulCount: 0 },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  approved: { label: 'Approved', color: 'text-green-700', bg: 'bg-green-100' },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-100' },
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = reviews.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (ratingFilter !== 'all' && r.rating !== Number(ratingFilter)) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.productName.toLowerCase().includes(q) || r.reviewerName.toLowerCase().includes(q) || r.title.toLowerCase().includes(q);
    }
    return true;
  });

  const approve = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const } : r));
  };

  const reject = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r));
  };

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    avgRating: (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Reviews</h1>
          <p className="text-sm text-neutral-500">Moderate and manage customer reviews</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total Reviews', value: stats.total },
          { label: 'Pending', value: stats.pending },
          { label: 'Approved', value: stats.approved },
          { label: 'Rejected', value: stats.rejected },
          { label: 'Avg Rating', value: `${stats.avgRating} ⭐` },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-sm border border-neutral-100 p-3 text-center">
            <p className="text-lg font-bold text-neutral-800">{s.value}</p>
            <p className="text-xs text-neutral-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by product, reviewer, or title..."
              className="input-field pl-10 text-sm"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field text-sm w-auto">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)} className="input-field text-sm w-auto">
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(review => (
          <div key={review.id} className="bg-white rounded-sm border border-neutral-100 p-4 hover:shadow-sm transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-neutral-800">{review.productName}</span>
                      {review.isVerified && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-sm font-medium flex items-center gap-0.5">
                          <CheckCircle className="w-2.5 h-2.5" /> Verified
                        </span>
                      )}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-medium ${statusConfig[review.status].bg} ${statusConfig[review.status].color}`}>
                        {statusConfig[review.status].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`} />
                      ))}
                      <span className="text-xs text-neutral-500 ml-1">by {review.reviewerName}</span>
                      <span className="text-xs text-neutral-400">· {review.date}</span>
                    </div>
                    <p className="text-sm font-medium text-neutral-800">{review.title}</p>
                    <p className="text-sm text-neutral-600 leading-relaxed">{review.comment}</p>
                    <div className="flex items-center gap-1 text-xs text-neutral-400 mt-1">
                      <ThumbsUp className="w-3 h-3" /> {review.helpfulCount} found helpful
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                {review.status === 'pending' && (
                  <>
                    <button
                      onClick={() => approve(review.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 rounded-sm hover:bg-green-200 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => reject(review.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-sm hover:bg-red-200 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </>
                )}
                {review.status === 'approved' && (
                  <button
                    onClick={() => reject(review.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-sm hover:bg-red-200 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                )}
                {review.status === 'rejected' && (
                  <button
                    onClick={() => approve(review.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 rounded-sm hover:bg-green-200 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-sm border border-neutral-100 p-12 text-center text-sm text-neutral-400">
            No reviews found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
