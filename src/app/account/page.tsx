'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, Heart, FileText, Bell, Settings, LogOut, ChevronRight, Edit, Plus, Trash2, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { api } from '@/lib/api';
import { formatPrice, formatDate, getOrderStatusColor } from '@/lib/utils';

const tabs = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'invoices', label: 'Invoices', icon: FileText },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout, updateProfile } = useAuth();
  const { items: wishlistItems, removeItem: removeFromWishlist } = useWishlist();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', phone: '', email: '' });

  useEffect(() => {
    if (user) {
      setProfileForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || '', email: user.email });
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await api.get<any>('/api/orders?limit=50');
      setOrders(data.orders);
    } catch {} finally { setLoadingOrders(false); }
  };

  const handleLogout = async () => { await logout(); router.push('/'); };

  if (!user) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-neutral-50 pt-20">
        <div className="text-center">
          <h1 className="heading-md text-neutral-800 mb-4">Please login to view your account</h1>
          <Link href="/auth/login" className="btn-primary">Login</Link>
        </div>
      </section>
    );
  }

  const overviewStats = [
    { label: 'Total Orders', value: String(orders.length), icon: Package },
    { label: 'Wishlist Items', value: String(wishlistItems.length), icon: Heart },
  ];

  return (
    <>
      <section className="pt-28 pb-4 bg-green-900">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="heading-lg text-white">My Account</h1>
        </div>
      </section>

      <section className="section-padding bg-neutral-50">
        <div className="container-custom mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-sm border border-neutral-100 p-4 lg:sticky lg:top-24">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-100">
                  <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center">
                    <span className="text-white font-bold">{user.firstName[0]}{user.lastName[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-800 text-sm">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-neutral-500">{user.email}</p>
                  </div>
                </div>
                <nav className="space-y-1">
                  {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-gold-50 text-gold-600' : 'text-neutral-600 hover:bg-neutral-50'}`}>
                      <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                  ))}
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium text-red-600 hover:bg-red-50 mt-2 border-t border-neutral-100 pt-3">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </nav>
              </div>
            </aside>

            <div className="flex-1">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-sm border border-neutral-100 p-6">
                    <h2 className="font-display font-semibold text-neutral-800 mb-4">Welcome back, {user.firstName}!</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {overviewStats.map(stat => (
                        <div key={stat.label} className="bg-neutral-50 rounded-sm p-4">
                          <stat.icon className="w-5 h-5 text-gold-500 mb-2" />
                          <p className="text-2xl font-bold text-neutral-800">{stat.value}</p>
                          <p className="text-xs text-neutral-500">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-sm border border-neutral-100 p-6">
                    <h3 className="font-semibold text-neutral-800 mb-4">Recent Orders</h3>
                    {loadingOrders ? (
                      <div className="animate-pulse space-y-3">{[1,2].map(i => <div key={i} className="h-16 bg-neutral-100 rounded-sm" />)}</div>
                    ) : orders.length === 0 ? (
                      <p className="text-neutral-500 text-sm">No orders yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {orders.slice(0, 5).map((order: any) => (
                          <div key={order.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-sm">
                            <div>
                              <p className="font-medium text-neutral-800 text-sm">#{order.orderNumber || order.id}</p>
                              <p className="text-xs text-neutral-500">{formatDate(order.createdAt)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-neutral-800 text-sm">{formatPrice(order.total)}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-sm ${getOrderStatusColor(order.status?.toLowerCase())}`}>{order.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="bg-white rounded-sm border border-neutral-100 p-6">
                  <h2 className="font-display font-semibold text-neutral-800 mb-6">My Orders</h2>
                  {loadingOrders ? (
                    <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-neutral-100 rounded-sm" />)}</div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12"><Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" /><p className="text-neutral-500">No orders yet</p></div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div key={order.id} className="border border-neutral-100 rounded-sm p-4 hover:border-gold-200 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold text-neutral-800">#{order.orderNumber || order.id}</p>
                              <p className="text-xs text-neutral-500">{formatDate(order.createdAt)} · {order.items?.length || 0} items</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-neutral-800">{formatPrice(order.total)}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-sm ${getOrderStatusColor(order.status?.toLowerCase())}`}>{order.status}</span>
                            </div>
                          </div>
                          {order.trackingNumber && <p className="text-xs text-neutral-500 mt-1">Tracking: {order.trackingNumber}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="bg-white rounded-sm border border-neutral-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-semibold text-neutral-800">My Addresses</h2>
                    <button className="btn-primary text-sm py-2"><Plus className="w-4 h-4 mr-1" /> Add Address</button>
                  </div>
                  {addresses.length === 0 ? (
                    <div className="text-center py-12"><MapPin className="w-12 h-12 text-neutral-300 mx-auto mb-4" /><p className="text-neutral-500">No addresses saved yet</p></div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((addr: any) => (
                        <div key={addr.id} className={`border rounded-sm p-4 ${addr.isDefault ? 'border-gold-500 bg-gold-50/30' : 'border-neutral-100'}`}>
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-semibold text-neutral-800">{addr.name}</p>
                            {addr.isDefault && <span className="badge bg-gold-500 text-white text-[10px]">Default</span>}
                          </div>
                          <p className="text-sm text-neutral-600">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                          <p className="text-sm text-neutral-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                          <p className="text-sm text-neutral-500 mt-1">{addr.phone}</p>
                          <div className="flex gap-3 mt-3 pt-3 border-t border-neutral-100">
                            <button className="text-xs text-gold-600 hover:text-gold-700 font-medium flex items-center gap-1"><Edit className="w-3 h-3" /> Edit</button>
                            {!addr.isDefault && <button className="text-xs text-neutral-500 hover:text-red-600 font-medium flex items-center gap-1"><Trash2 className="w-3 h-3" /> Remove</button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="bg-white rounded-sm border border-neutral-100 p-6">
                  <h2 className="font-display font-semibold text-neutral-800 mb-6">My Wishlist ({wishlistItems.length})</h2>
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-12"><Heart className="w-12 h-12 text-neutral-300 mx-auto mb-4" /><p className="text-neutral-500 mb-4">Your wishlist is empty</p><Link href="/shop" className="btn-primary">Browse Products</Link></div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlistItems.map(item => (
                        <div key={item.id} className="border border-neutral-100 rounded-sm p-4">
                          <div className="aspect-square bg-neutral-50 rounded-sm mb-3 flex items-center justify-center"><span className="text-4xl">🌶️</span></div>
                          <Link href={`/shop/${item.slug}`} className="font-medium text-neutral-800 hover:text-gold-600 text-sm">{item.name}</Link>
                          <p className="text-gold-600 font-semibold mt-1">{formatPrice(item.price)}</p>
                          <button onClick={() => removeFromWishlist(item.id)} className="mt-2 text-xs text-red-500 hover:text-red-600">Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'invoices' && (
                <div className="bg-white rounded-sm border border-neutral-100 p-6">
                  <h2 className="font-display font-semibold text-neutral-800 mb-6">My Invoices</h2>
                  {orders.length === 0 ? (
                    <p className="text-neutral-500">No invoices available yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-sm">
                          <div>
                            <p className="font-medium text-neutral-800 text-sm">INV-{order.orderNumber || order.id}</p>
                            <p className="text-xs text-neutral-500">Order #{order.orderNumber || order.id} · {formatDate(order.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-neutral-800">{formatPrice(order.total)}</span>
                            <button className="text-xs text-gold-600 hover:text-gold-700 font-medium">Download PDF</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-white rounded-sm border border-neutral-100 p-6">
                  <h2 className="font-display font-semibold text-neutral-800 mb-6">Notifications</h2>
                  <div className="space-y-3">
                    <div className="p-4 rounded-sm border border-neutral-100 text-center text-neutral-500">No new notifications</div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="bg-white rounded-sm border border-neutral-100 p-6">
                  <h2 className="font-display font-semibold text-neutral-800 mb-6">Account Settings</h2>
                  <form className="space-y-6 max-w-lg" onSubmit={async e => { e.preventDefault(); await updateProfile(profileForm); }}>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-neutral-700 mb-1.5">First Name</label><input type="text" value={profileForm.firstName} onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })} className="input-field" /></div>
                      <div><label className="block text-sm font-medium text-neutral-700 mb-1.5">Last Name</label><input type="text" value={profileForm.lastName} onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })} className="input-field" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label><input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} className="input-field" disabled /></div>
                    <div><label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone</label><input type="tel" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} className="input-field" /></div>
                    <button type="submit" className="btn-primary">Save Changes</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
