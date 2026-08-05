'use client';

import { useState } from 'react';
import { Edit, Eye, Mail, Clock, Search, Send, FileText, ShoppingCart, Truck, Gift, AlertTriangle } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  category: 'transactional' | 'marketing' | 'system';
  lastEdited: string;
  isActive: boolean;
  icon: React.ReactNode;
}

const templates: EmailTemplate[] = [
  { id: '1', name: 'Order Confirmation', subject: 'Your Orpind order #{{order_id}} is confirmed!', description: 'Sent immediately after a successful order placement with order summary and payment details.', category: 'transactional', lastEdited: '2024-04-10', isActive: true, icon: <ShoppingCart className="w-5 h-5" /> },
  { id: '2', name: 'Shipping Confirmation', subject: 'Your order #{{order_id}} has been shipped!', description: 'Sent when order is dispatched with tracking number and estimated delivery date.', category: 'transactional', lastEdited: '2024-04-08', isActive: true, icon: <Truck className="w-5 h-5" /> },
  { id: '3', name: 'Out for Delivery', subject: 'Your Orpind order is out for delivery today!', description: 'Sent on the day of delivery with delivery time window and contact info.', category: 'transactional', lastEdited: '2024-04-05', isActive: true, icon: <Truck className="w-5 h-5" /> },
  { id: '4', name: 'Delivery Confirmed', subject: 'Your order has been delivered. Enjoy your spices!', description: 'Sent after successful delivery with product care tips and review request.', category: 'transactional', lastEdited: '2024-04-03', isActive: true, icon: <Gift className="w-5 h-5" /> },
  { id: '5', name: 'Welcome Email', subject: 'Welcome to Orpind! Here\'s 10% off your first order', description: 'Sent to new users upon registration with brand story and welcome discount code.', category: 'marketing', lastEdited: '2024-03-28', isActive: true, icon: <Mail className="w-5 h-5" /> },
  { id: '6', name: 'Abandoned Cart', subject: 'You left some spices in your cart! Complete your order', description: 'Sent 1 hour and 24 hours after cart abandonment with product reminders.', category: 'marketing', lastEdited: '2024-03-25', isActive: true, icon: <AlertTriangle className="w-5 h-5" /> },
  { id: '7', name: 'Order Cancelled', subject: 'Your order #{{order_id}} has been cancelled', description: 'Sent when an order is cancelled with refund details and timeline.', category: 'system', lastEdited: '2024-03-20', isActive: true, icon: <FileText className="w-5 h-5" /> },
  { id: '8', name: 'Password Reset', subject: 'Reset your Orpind account password', description: 'Sent when user requests a password reset with secure link.', category: 'system', lastEdited: '2024-03-15', isActive: true, icon: <FileText className="w-5 h-5" /> },
  { id: '9', name: 'Monthly Newsletter', subject: 'Your monthly spice guide from Orpind', description: 'Monthly newsletter with new products, recipes, and seasonal offers.', category: 'marketing', lastEdited: '2024-03-01', isActive: false, icon: <Mail className="w-5 h-5" /> },
];

const categoryColors: Record<string, string> = {
  transactional: 'bg-blue-100 text-blue-700',
  marketing: 'bg-purple-100 text-purple-700',
  system: 'bg-neutral-100 text-neutral-600',
};

export default function AdminEmailTemplatesPage() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string>('all');
  const [previewId, setPreviewId] = useState<string | null>(null);

  const filtered = templates.filter(t => {
    if (catFilter !== 'all' && t.category !== catFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q);
    }
    return true;
  });

  const previewTemplate = templates.find(t => t.id === previewId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Email Templates</h1>
          <p className="text-sm text-neutral-500">{templates.length} templates &middot; {templates.filter(t => t.isActive).length} active</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Transactional', value: templates.filter(t => t.category === 'transactional').length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Marketing', value: templates.filter(t => t.category === 'marketing').length, color: 'bg-purple-50 text-purple-700' },
          { label: 'System', value: templates.filter(t => t.category === 'system').length, color: 'bg-neutral-50 text-neutral-700' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-sm border border-neutral-100 p-3 text-center`}>
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-xs opacity-75">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates..." className="input-field pl-10 text-sm" />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="input-field text-sm w-auto">
            <option value="all">All Categories</option>
            <option value="transactional">Transactional</option>
            <option value="marketing">Marketing</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(template => (
          <div key={template.id} className="bg-white rounded-sm border border-neutral-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-gold-50 rounded-sm flex items-center justify-center text-gold-600">{template.icon}</div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm uppercase ${categoryColors[template.category]}`}>{template.category}</span>
            </div>
            <h3 className="text-sm font-semibold text-neutral-800 mb-1">{template.name}</h3>
            <p className="text-xs text-gold-600 font-mono mb-2 truncate">{template.subject}</p>
            <p className="text-xs text-neutral-500 mb-4 line-clamp-2">{template.description}</p>
            <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
              <div className="flex items-center gap-1 text-neutral-400">
                <Clock className="w-3 h-3" />
                <span className="text-[11px]">Edited {template.lastEdited}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setPreviewId(template.id)} className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-600 transition-colors" title="Preview">
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-600 transition-colors" title="Edit">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-gold-50 rounded-sm text-gold-600 transition-colors" title="Send test">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-sm border border-neutral-100 p-12 text-center">
          <Mail className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
          <p className="text-sm text-neutral-400">No templates found.</p>
        </div>
      )}

      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-sm border border-neutral-100 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <div>
                <h2 className="text-lg font-display font-bold text-neutral-800">{previewTemplate.name}</h2>
                <p className="text-xs text-neutral-500 mt-0.5">{previewTemplate.subject}</p>
              </div>
              <button onClick={() => setPreviewId(null)} className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-500">✕</button>
            </div>
            <div className="p-6">
              <div className="bg-neutral-50 rounded-sm border border-neutral-200 p-6 mb-4">
                <div className="text-center mb-6">
                  <div className="text-gold-600 font-display font-bold text-xl mb-1">ORPIND</div>
                  <div className="w-12 h-0.5 bg-gold-500 mx-auto"></div>
                </div>
                <div className="bg-white rounded-sm border border-neutral-200 p-6 space-y-4">
                  <h3 className="font-display font-bold text-neutral-800">{previewTemplate.subject}</h3>
                  <div className="text-sm text-neutral-600 space-y-3">
                    <p>Dear {'{{customer_name}}'},</p>
                    <p>{previewTemplate.description}</p>
                    <div className="bg-neutral-50 rounded-sm p-4 border border-neutral-100">
                      <p className="text-xs text-neutral-500">Order #{'{{order_id}}'}</p>
                      <p className="text-xs text-neutral-500">Amount: {'{{order_total}}'}</p>
                    </div>
                    <div className="text-center pt-2">
                      <span className="inline-block bg-gold-600 text-white text-xs font-medium px-6 py-2.5 rounded-sm">View Order</span>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-6">
                  <p className="text-[10px] text-neutral-400">Orpind &middot; GT Road, Phagwara, Punjab</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setPreviewId(null)} className="flex-1 px-4 py-2.5 text-sm font-medium border border-neutral-200 text-neutral-700 rounded-sm hover:bg-neutral-50 transition-colors">Close</button>
                <button className="flex-1 btn-primary text-sm py-2.5"><Edit className="w-4 h-4 mr-1" /> Edit Template</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
