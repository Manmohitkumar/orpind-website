'use client';

import Link from 'next/link';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import Breadcrumb from '@/components/ui/Breadcrumb';
import QuantityStepper from '@/components/ui/QuantityStepper';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getItemCount, getSubtotal, loading } = useCart();
  const subtotal = getSubtotal();
  const shipping = subtotal >= 999 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <>
      <section className="relative pt-32 pb-12 bg-green-900">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} className="mb-6" />
          <h1 className="heading-lg text-white">Shopping Cart</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom mx-auto">
          {loading && <div className="text-center py-16"><div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full mx-auto" /></div>}

          {!loading && items.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-neutral-400" />
              </div>
              <h2 className="heading-sm text-neutral-800 mb-3">Your cart is empty</h2>
              <p className="text-body text-neutral-500 mb-8 max-w-md mx-auto">Looks like you haven&apos;t added any spices to your cart yet. Explore our collection and find your favorites.</p>
              <Link href="/shop" className="btn-primary group">Start Shopping<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></Link>
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedWeight}`} className="flex gap-4 p-4 bg-white rounded-sm border border-neutral-100">
                    <div className="w-20 h-20 bg-neutral-100 rounded-sm flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">🌶️</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-neutral-800">{item.product.name}</h3>
                          <p className="text-sm text-neutral-500">{item.selectedWeight}</p>
                        </div>
                        <button onClick={() => removeItem(item.product.id, item.selectedWeight)} className="text-neutral-400 hover:text-red-500 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <QuantityStepper
                          value={item.quantity}
                          onChange={(qty) => updateQuantity(item.product.id, item.selectedWeight, qty)}
                          min={1}
                          size="sm"
                        />
                        <span className="font-semibold text-neutral-800">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-sm border border-neutral-100 sticky top-24">
                  <h3 className="font-display font-semibold text-neutral-800 mb-6">Order Summary</h3>
                  <div className="space-y-3 pb-4 border-b border-neutral-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Subtotal ({getItemCount()} items)</span>
                      <span className="text-neutral-800">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Shipping</span>
                      <span className="text-green-600 font-medium">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between py-4">
                    <span className="font-semibold text-neutral-800">Total</span>
                    <span className="text-xl font-bold text-neutral-800">{formatPrice(total)}</span>
                  </div>
                  <Link href="/checkout" className="btn-primary w-full text-center block">Proceed to Checkout</Link>
                  <Link href="/shop" className="block text-center mt-4 text-sm text-gold-600 hover:text-gold-700">Continue Shopping</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
