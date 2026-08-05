'use client';

import { useState } from 'react';
import { Save, Upload, Settings, Building, Truck, CreditCard, Bell } from 'lucide-react';
import { siteConfig } from '@/data/products';

type Tab = 'general' | 'business' | 'shipping' | 'payment' | 'notifications';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'general', label: 'General', icon: <Settings className="w-4 h-4" /> },
  { id: 'business', label: 'Business', icon: <Building className="w-4 h-4" /> },
  { id: 'shipping', label: 'Shipping', icon: <Truck className="w-4 h-4" /> },
  { id: 'payment', label: 'Payment', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [saved, setSaved] = useState(false);
  const [general, setGeneral] = useState({
    siteName: siteConfig.name,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
    logoUrl: '/images/logo/logo.svg',
    favicon: '/favicon.ico',
    metaTitle: `${siteConfig.name} - ${siteConfig.tagline}`,
    metaDescription: siteConfig.description,
  });
  const [business, setBusiness] = useState({
    fssai: siteConfig.fssai,
    gstin: siteConfig.gstin,
    phone: siteConfig.phone,
    email: siteConfig.email,
    address: siteConfig.address,
    city: 'Phagwara',
    state: 'Punjab',
    pincode: '144401',
    country: 'India',
  });
  const [shipping, setShipping] = useState({
    flatRate: 49,
    freeShippingThreshold: 999,
    expressRate: 99,
    expressCities: 'Delhi, Mumbai, Bangalore, Chandigarh, Pune',
    internationalEnabled: false,
    internationalRate: 999,
    weightLimit: 25,
    estimatedDays: '3-5',
    expressDays: '1-2',
  });
  const [payment, setPayment] = useState({
    razorpayKeyId: 'rzp_test_XXXXXXXXXXXXXXX',
    razorpayKeySecret: '••••••••••••••••',
    codEnabled: true,
    codFee: 0,
    upiEnabled: true,
    cardEnabled: true,
    netbankingEnabled: true,
    walletEnabled: false,
    autoSettle: true,
    refundTdays: 7,
  });
  const [notifications, setNotifications] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    orderCancelled: true,
    promotionalEmails: true,
    smsEnabled: false,
    whatsappEnabled: true,
    lowStockAlert: true,
    lowStockThreshold: 10,
    newReviewAlert: true,
    dailyReport: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Settings</h1>
          <p className="text-sm text-neutral-500">Configure your store settings</p>
        </div>
        <button onClick={handleSave} className="btn-primary text-sm py-2">
          <Save className="w-4 h-4 mr-1" /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 overflow-hidden">
        <div className="flex border-b border-neutral-100 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-gold-500 text-gold-600 bg-gold-50/50'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-sm font-semibold text-neutral-800 mb-4">Site Identity</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Site Name</label>
                    <input type="text" value={general.siteName} onChange={e => setGeneral({ ...general, siteName: e.target.value })} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Tagline</label>
                    <input type="text" value={general.tagline} onChange={e => setGeneral({ ...general, tagline: e.target.value })} className="input-field text-sm" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Site Description</label>
                <textarea value={general.description} onChange={e => setGeneral({ ...general, description: e.target.value })} rows={3} className="input-field text-sm resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-neutral-100 rounded-sm border border-neutral-200 flex items-center justify-center text-neutral-400 text-xs">Logo</div>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-200 rounded-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                    <Upload className="w-4 h-4" /> Upload Logo
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Favicon</label>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-neutral-100 rounded-sm border border-neutral-200 flex items-center justify-center text-neutral-400 text-[8px]">ICO</div>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-200 rounded-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                    <Upload className="w-4 h-4" /> Upload Favicon
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-800 mb-4">SEO</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Meta Title</label>
                    <input type="text" value={general.metaTitle} onChange={e => setGeneral({ ...general, metaTitle: e.target.value })} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Meta Description</label>
                    <textarea value={general.metaDescription} onChange={e => setGeneral({ ...general, metaDescription: e.target.value })} rows={2} className="input-field text-sm resize-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-sm font-semibold text-neutral-800 mb-4">Legal & Compliance</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">FSSAI License</label>
                    <input type="text" value={business.fssai} onChange={e => setBusiness({ ...business, fssai: e.target.value })} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">GSTIN</label>
                    <input type="text" value={business.gstin} onChange={e => setBusiness({ ...business, gstin: e.target.value })} className="input-field text-sm" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-800 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone</label>
                    <input type="tel" value={business.phone} onChange={e => setBusiness({ ...business, phone: e.target.value })} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
                    <input type="email" value={business.email} onChange={e => setBusiness({ ...business, email: e.target.value })} className="input-field text-sm" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-800 mb-4">Business Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Address</label>
                    <input type="text" value={business.address} onChange={e => setBusiness({ ...business, address: e.target.value })} className="input-field text-sm" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">City</label>
                      <input type="text" value={business.city} onChange={e => setBusiness({ ...business, city: e.target.value })} className="input-field text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">State</label>
                      <input type="text" value={business.state} onChange={e => setBusiness({ ...business, state: e.target.value })} className="input-field text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Pincode</label>
                      <input type="text" value={business.pincode} onChange={e => setBusiness({ ...business, pincode: e.target.value })} className="input-field text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Country</label>
                      <input type="text" value={business.country} onChange={e => setBusiness({ ...business, country: e.target.value })} className="input-field text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-sm font-semibold text-neutral-800 mb-4">Domestic Shipping</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Flat Rate (₹)</label>
                    <input type="number" value={shipping.flatRate} onChange={e => setShipping({ ...shipping, flatRate: Number(e.target.value) })} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Free Shipping Above (₹)</label>
                    <input type="number" value={shipping.freeShippingThreshold} onChange={e => setShipping({ ...shipping, freeShippingThreshold: Number(e.target.value) })} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Max Weight (kg)</label>
                    <input type="number" value={shipping.weightLimit} onChange={e => setShipping({ ...shipping, weightLimit: Number(e.target.value) })} className="input-field text-sm" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-800 mb-4">Express Shipping</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Express Rate (₹)</label>
                    <input type="number" value={shipping.expressRate} onChange={e => setShipping({ ...shipping, expressRate: Number(e.target.value) })} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Standard Delivery</label>
                    <input type="text" value={shipping.estimatedDays} onChange={e => setShipping({ ...shipping, estimatedDays: e.target.value })} className="input-field text-sm" placeholder="e.g. 3-5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Express Delivery</label>
                    <input type="text" value={shipping.expressDays} onChange={e => setShipping({ ...shipping, expressDays: e.target.value })} className="input-field text-sm" placeholder="e.g. 1-2" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Express Cities</label>
                  <input type="text" value={shipping.expressCities} onChange={e => setShipping({ ...shipping, expressCities: e.target.value })} className="input-field text-sm" />
                  <p className="text-xs text-neutral-400 mt-1">Comma-separated list of cities with express delivery</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-800 mb-4">International Shipping</h3>
                <div className="flex items-center gap-3 mb-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={shipping.internationalEnabled} onChange={e => setShipping({ ...shipping, internationalEnabled: e.target.checked })} className="sr-only peer" />
                    <div className="w-9 h-5 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold-500"></div>
                  </label>
                  <span className="text-sm font-medium text-neutral-700">Enable International Shipping</span>
                </div>
                {shipping.internationalEnabled && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">International Rate (₹)</label>
                    <input type="number" value={shipping.internationalRate} onChange={e => setShipping({ ...shipping, internationalRate: Number(e.target.value) })} className="input-field text-sm w-48" />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-sm font-semibold text-neutral-800 mb-4">Razorpay Configuration</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Key ID</label>
                    <input type="text" value={payment.razorpayKeyId} onChange={e => setPayment({ ...payment, razorpayKeyId: e.target.value })} className="input-field text-sm font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Key Secret</label>
                    <input type="password" value={payment.razorpayKeySecret} onChange={e => setPayment({ ...payment, razorpayKeySecret: e.target.value })} className="input-field text-sm font-mono" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-800 mb-4">Payment Methods</h3>
                <div className="space-y-3">
                  {[
                    { key: 'codEnabled', label: 'Cash on Delivery (COD)', desc: 'Allow customers to pay on delivery' },
                    { key: 'upiEnabled', label: 'UPI Payments', desc: 'Google Pay, PhonePe, BHIM, etc.' },
                    { key: 'cardEnabled', label: 'Credit / Debit Cards', desc: 'Visa, Mastercard, RuPay' },
                    { key: 'netbankingEnabled', label: 'Net Banking', desc: 'All major banks supported' },
                    { key: 'walletEnabled', label: 'Wallets', desc: 'Paytm, Amazon Pay, etc.' },
                  ].map(method => (
                    <div key={method.key} className="flex items-center justify-between p-3 bg-neutral-50 rounded-sm">
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{method.label}</p>
                        <p className="text-xs text-neutral-500">{method.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(payment as unknown as Record<string, boolean>)[method.key]}
                          onChange={e => setPayment({ ...payment, [method.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {payment.codEnabled && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">COD Handling Fee (₹)</label>
                  <input type="number" value={payment.codFee} onChange={e => setPayment({ ...payment, codFee: Number(e.target.value) })} className="input-field text-sm w-48" />
                  <p className="text-xs text-neutral-400 mt-1">Set to 0 for no extra fee</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-semibold text-neutral-800 mb-4">Settlement</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-sm">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={payment.autoSettle} onChange={e => setPayment({ ...payment, autoSettle: e.target.checked })} className="sr-only peer" />
                      <div className="w-9 h-5 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold-500"></div>
                    </label>
                    <div>
                      <p className="text-sm font-medium text-neutral-800">Auto-settle on Delivery</p>
                      <p className="text-xs text-neutral-500">Automatically settle COD orders</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Refund Processing (days)</label>
                    <input type="number" value={payment.refundTdays} onChange={e => setPayment({ ...payment, refundTdays: Number(e.target.value) })} className="input-field text-sm w-48" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-sm font-semibold text-neutral-800 mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  {[
                    { key: 'orderConfirmation', label: 'Order Confirmation', desc: 'Send email when order is placed' },
                    { key: 'orderShipped', label: 'Order Shipped', desc: 'Send email when order is shipped' },
                    { key: 'orderDelivered', label: 'Order Delivered', desc: 'Send email when order is delivered' },
                    { key: 'orderCancelled', label: 'Order Cancelled', desc: 'Send email when order is cancelled' },
                    { key: 'promotionalEmails', label: 'Promotional Emails', desc: 'Marketing and promotional campaigns' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-3 bg-neutral-50 rounded-sm">
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{item.label}</p>
                        <p className="text-xs text-neutral-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(notifications as unknown as Record<string, boolean>)[item.key]}
                          onChange={e => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-800 mb-4">SMS & Messaging</h3>
                <div className="space-y-3">
                  {[
                    { key: 'smsEnabled', label: 'SMS Notifications', desc: 'Send order updates via SMS' },
                    { key: 'whatsappEnabled', label: 'WhatsApp Notifications', desc: 'Send order updates via WhatsApp' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-3 bg-neutral-50 rounded-sm">
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{item.label}</p>
                        <p className="text-xs text-neutral-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(notifications as unknown as Record<string, boolean>)[item.key]}
                          onChange={e => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-800 mb-4">Admin Alerts</h3>
                <div className="space-y-3">
                  {[
                    { key: 'lowStockAlert', label: 'Low Stock Alert', desc: 'Alert when product stock falls below threshold' },
                    { key: 'newReviewAlert', label: 'New Review Alert', desc: 'Alert when a new review is submitted' },
                    { key: 'dailyReport', label: 'Daily Report', desc: 'Receive daily sales summary via email' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-3 bg-neutral-50 rounded-sm">
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{item.label}</p>
                        <p className="text-xs text-neutral-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(notifications as unknown as Record<string, boolean>)[item.key]}
                          onChange={e => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
                {notifications.lowStockAlert && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Low Stock Threshold</label>
                    <input type="number" value={notifications.lowStockThreshold} onChange={e => setNotifications({ ...notifications, lowStockThreshold: Number(e.target.value) })} className="input-field text-sm w-48" />
                    <p className="text-xs text-neutral-400 mt-1">Alert when stock falls below this quantity</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-sm shadow-lg text-sm font-medium flex items-center gap-2 z-50 animate-in slide-in-from-bottom-2">
          <Save className="w-4 h-4" /> Settings saved successfully!
        </div>
      )}
    </div>
  );
}
