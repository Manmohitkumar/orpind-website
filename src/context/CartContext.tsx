'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, weight: string, quantity?: number) => Promise<void>;
  removeItem: (productId: string, weight: string) => Promise<void>;
  updateQuantity: (productId: string, weight: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
  getSubtotal: () => number;
  isInCart: (productId: string, weight: string) => boolean;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = 'orpind_cart';

function loadLocalCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function saveLocalCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load on mount
  useEffect(() => {
    if (user) {
      fetchServerCart();
    } else {
      setItems(loadLocalCart());
    }
  }, [user]);

  // When user logs in, merge local cart to server
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!user) return;
    const local = loadLocalCart();
    if (local.length > 0) {
      mergeLocalCart(local);
    } else {
      fetchServerCart();
    }
  }, [user?.id]);

  const fetchServerCart = async () => {
    try {
      const data = await api.get<{ items: any[] }>('/api/cart');
      setItems(data.items.map((i: any) => ({
        product: {
          id: i.product.id,
          name: i.product.name,
          slug: i.product.slug,
          price: i.product.price,
          images: i.product.images || [],
          weight: i.product.weight || [],
          category: i.product.category || '',
          description: '',
          shortDescription: '',
          inStock: true,
          isOrganic: true,
          origin: '',
          tags: [],
          rating: 0,
          reviewCount: 0,
          createdAt: '',
        },
        quantity: i.quantity,
        selectedWeight: i.weight || i.product.weight?.[0] || '',
      })));
    } catch { setItems(loadLocalCart()); }
  };

  const mergeLocalCart = async (local: CartItem[]) => {
    setLoading(true);
    try {
      for (const item of local) {
        await api.post('/api/cart', { productId: item.product.id, quantity: item.quantity });
      }
      localStorage.removeItem(STORAGE_KEY);
      await fetchServerCart();
    } catch {
      setItems(local);
    } finally { setLoading(false); }
  };

  const addItem = useCallback(async (product: Product, weight: string, quantity = 1) => {
    const newItem: CartItem = { product, quantity, selectedWeight: weight };
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.selectedWeight === weight);
      const updated = existing
        ? prev.map(i => i.product.id === product.id && i.selectedWeight === weight ? { ...i, quantity: i.quantity + quantity } : i)
        : [...prev, newItem];
      if (!user) saveLocalCart(updated);
      return updated;
    });
    if (user) {
      try { await api.post('/api/cart', { productId: product.id, quantity }); } catch {}
    }
  }, [user]);

  const removeItem = useCallback(async (productId: string, weight: string) => {
    setItems(prev => {
      const updated = prev.filter(i => !(i.product.id === productId && i.selectedWeight === weight));
      if (!user) saveLocalCart(updated);
      return updated;
    });
    if (user) {
      try {
        const item = items.find(i => i.product.id === productId && i.selectedWeight === weight);
        if (item) await api.delete(`/api/cart?itemId=${item.id}`);
      } catch {}
    }
  }, [user, items]);

  const updateQuantity = useCallback(async (productId: string, weight: string, quantity: number) => {
    if (quantity <= 0) { await removeItem(productId, weight); return; }
    setItems(prev => {
      const updated = prev.map(i =>
        i.product.id === productId && i.selectedWeight === weight ? { ...i, quantity } : i
      );
      if (!user) saveLocalCart(updated);
      return updated;
    });
  }, [user, removeItem]);

  const clearCart = useCallback(async () => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
    if (user) { try { await api.delete('/api/cart'); } catch {} }
  }, [user]);

  const getItemCount = useCallback(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const getSubtotal = useCallback(() => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0), [items]);
  const isInCart = useCallback((productId: string, weight: string) =>
    items.some(i => i.product.id === productId && i.selectedWeight === weight), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, getItemCount, getSubtotal, isInCart, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
