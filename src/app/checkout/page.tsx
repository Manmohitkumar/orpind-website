'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import dynamic from 'next/dynamic';

const StripeCheckoutForm = dynamic(() => import('@/components/checkout/StripeCheckoutForm'), { ssr: false });

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const { items, getSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [showStripeForm, setShowStripeForm] = useState(false);

  useEffect(() => {
    if (user) {
      setForm(f => ({ ...f, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone || '' }));
    }
  }, [user]);

  const subtotal = getSubtotal();
  const shipping = subtotal >= 999 ? 0 : 49;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setPlaceError(null);
    try {
      const orderItems = items.map(i => ({
        productId: i.product.id,
        quantity: i.quantity,
        weight: i.selectedWeight,
        price: i.product.price,
      }));
      const res = await api.post<{ order: any }>('/api/orders', {
        items: orderItems,
        shippingAddress: form,
        paymentMethod: paymentMethod.toUpperCase(),
      });
      setOrderResult(res.order);
      clearCart();
      if (paymentMethod === 'stripe') {
        setShowStripeForm(true);
        setPlacing(false);
      } else {
        setStep(3);
      }
    } catch (err: any) {
      setPlaceError(err.message || 'Failed to place order');
    } finally {
      if (paymentMethod !== 'stripe') setPlacing(false);
    }
  };

  const handleStripeSuccess = () => setStep(3);
  const handleStripeError = (msg: string) => setPlaceError(msg);

  if (items.length === 0 && !orderResult) {
    return (
      <section className="section-padding pt-32"><div className="container-custom mx-auto text-center"><h2 className="heading-sm mb-4">Your cart is empty</h2><Link href="/shop" className="btn-primary">Shop Now</Link></div></section>
    );
  }

  return (
    <>
      <section className="relative pt-32 pb-8 bg-green-900">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link><ChevronRight className="w-3 h-3" />
            <Link href="/cart" className="hover:text-white transition-colors">Cart</Link><ChevronRight className="w-3 h-3" />
            <span className="text-white">Checkout</span>
          </nav>
          <h1 className="heading-lg text-white">Checkout</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom mx-auto">
          <div className="flex items-center justify-center gap-4 mb-12">
            {[{ num: 1, label: 'Shipping' }, { num: 2, label: 'Payment' }, { num: 3, label: 'Confirm' }].map((s, i) => (
              <div key={s.num} className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s.num ? 'bg-gold-500 text-white' : 'bg-neutral-200 text-neutral-500'}`}>{s.num}</div>
                  <span className={`text-sm font-medium ${step >= s.num ? 'text-neutral-800' : 'text-neutral-400'}`}>{s.label}</span>
                </div>
                {i < 2 && <div className="w-12 h-0.5 bg-neutral-200" />}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="lg:col-span-2">
              {step === 1 && (
                <div className="bg-white p-8 rounded-sm border border-neutral-100">
                  <h2 className="heading-sm text-neutral-800 mb-6">Shipping Information</h2>
                  <div className="divider mb-8" />
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">First Name *</label>
                        <input type="text" className="input-field" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="First name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Last Name *</label>
                        <input type="text" className="input-field" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Email *</label>
                      <input type="email" className="input-field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Phone *</label>
                      <input type="tel" className="input-field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 62833 48561" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Address *</label>
                      <input type="text" className="input-field" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Street address" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">City *</label>
                        <input type="text" className="input-field" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="City" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">State *</label>
                        <input type="text" className="input-field" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="State" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Pin Code *</label>
                        <input type="text" className="input-field" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} placeholder="Pin code" />
                      </div>
                    </div>
                    <button onClick={() => setStep(2)} className="btn-primary">Continue to Payment</button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white p-8 rounded-sm border border-neutral-100">
                  <h2 className="heading-sm text-neutral-800 mb-6">Payment Method</h2>
                  <div className="divider mb-8" />
                  <div className="space-y-4">
                    {[
                      { id: 'razorpay', label: 'Razorpay (Card / UPI / Net Banking)', icon: '💳' },
                      { id: 'stripe', label: 'Credit / Debit Card (Stripe)', icon: '💳' },
                      { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
                    ].map((method) => (
                      <label key={method.id} className="flex items-center gap-4 p-4 border border-neutral-200 rounded-sm cursor-pointer hover:border-gold-500 transition-colors">
                        <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="accent-gold-500" />
                        <span className="text-xl">{method.icon}</span>
                        <span className="text-sm font-medium text-neutral-800">{method.label}</span>
                      </label>
                    ))}
                  </div>
                  {placeError && <p className="text-red-500 text-sm mt-4">{placeError}</p>}

                  {showStripeForm && orderResult ? (
                    <div className="mt-8">
                      <StripeCheckoutForm total={total} orderId={orderResult.id} onSuccess={handleStripeSuccess} onError={handleStripeError} />
                    </div>
                  ) : (
                    <div className="flex gap-4 mt-8">
                      <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
                      <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary">
                        {placing ? 'Placing Order...' : `Place Order - ${formatPrice(total)}`}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="bg-white p-8 rounded-sm border border-neutral-100 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="heading-sm text-neutral-800 mb-2">Order Confirmed!</h2>
                  <p className="text-body text-neutral-500 mb-6">Thank you for your order. We&apos;ll send you a confirmation email shortly.</p>
                  <p className="text-sm text-neutral-400 mb-8">
                    Order ID: <span className="font-mono text-neutral-700">#{orderResult?.orderNumber || orderResult?.id}</span>
                  </p>
                  <Link href="/shop" className="btn-primary">Continue Shopping</Link>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-sm border border-neutral-100 sticky top-24">
                <h3 className="font-display font-semibold text-neutral-800 mb-6">Order Summary</h3>
                <div className="space-y-4 pb-4 border-b border-neutral-100">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.selectedWeight}`} className="flex justify-between">
                      <div>
                        <p className="text-sm text-neutral-800">{item.product.name} ({item.selectedWeight})</p>
                        <p className="text-xs text-neutral-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium text-neutral-800">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 py-4 border-b border-neutral-100">
                  <div className="flex justify-between text-sm"><span className="text-neutral-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-neutral-500">Shipping</span><span className="text-green-600">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                </div>
                <div className="flex justify-between py-4">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">{formatPrice(total)}</span>
                </div>
                <div className="space-y-3 pt-4 border-t border-neutral-100">
                  <div className="flex items-center gap-2 text-xs text-neutral-500"><Truck className="w-3.5 h-3.5" /> Free delivery on orders above ₹999</div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500"><CreditCard className="w-3.5 h-3.5" /> Secure payment processing</div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500"><ShieldCheck className="w-3.5 h-3.5" /> 100% quality guaranteed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
