'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingBag, Search, ChevronDown, Heart, User, LogOut } from 'lucide-react';
import { categories } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Wholesale', href: '/wholesale' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { getItemCount } = useCart();
  const { getItemCount: getWishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const cartCount = getItemCount();
  const wishlistCount = getWishlistCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-beige-50 shadow-soft-sm' : 'bg-transparent'}`}>
        <div className="container-custom mx-auto">
          <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div>
                <h1 className={`text-2xl font-display font-bold tracking-wider transition-colors ${scrolled ? 'text-green-700' : 'text-white'}`}>
                  ORPIND<span className="text-gold-500">.</span>
                </h1>
                <p className={`text-xs tracking-widest uppercase transition-colors ${scrolled ? 'text-green-500' : 'text-white/70'}`}>
                  Organic Spices &amp; Grains
                </p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                if (link.label === 'Shop') {
                  return (
                    <div key={link.href} className="relative" onMouseEnter={() => setShowMegaMenu(true)} onMouseLeave={() => setShowMegaMenu(false)}>
                      <Link href={link.href} className={`px-4 py-2 text-sm font-medium tracking-wide transition-colors relative group inline-flex items-center gap-1 ${scrolled ? 'text-green-700 hover:text-gold-600' : 'text-white/90 hover:text-white'}`}>
                        {link.label}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showMegaMenu ? 'rotate-180' : ''}`} />
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full" />
                      </Link>
                      {showMegaMenu && (
                        <div className="absolute top-full left-0 w-[680px] bg-white shadow-soft-lg rounded-b-lg grid grid-cols-5 overflow-hidden animate-slide-down">
                          <div className="col-span-3 p-6 space-y-1">
                            {categories.map((cat) => (
                              <Link key={cat.slug} href={`/shop?category=${cat.slug}`} className="flex items-center justify-between px-3 py-2.5 text-sm text-green-700 hover:bg-beige-50 hover:text-gold-600 rounded-sm transition-colors">
                                <span>{cat.name}</span>
                                <span className="text-xs text-beige-400">{cat.productCount}</span>
                              </Link>
                            ))}
                          </div>
                          <div className="col-span-2 relative h-full min-h-[320px]">
                            <Image src={categories[0]?.image || '/images/categories/whole-spices.svg'} alt="Premium Spices" fill className="object-cover" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link key={link.href} href={link.href} className={`px-4 py-2 text-sm font-medium tracking-wide transition-colors relative group ${scrolled ? 'text-green-700 hover:text-gold-600' : 'text-white/90 hover:text-white'}`}>
                    {link.label}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full" />
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <button onClick={() => setShowSearch(true)} className={`p-2.5 rounded-sm transition-colors ${scrolled ? 'text-green-700 hover:bg-beige-100' : 'text-white hover:bg-white/10'}`}>
                <Search className="w-5 h-5" />
              </button>

              {isAuthenticated ? (
                <div className="relative">
                  <button onClick={() => setShowUserMenu(!showUserMenu)} className={`p-2.5 rounded-sm transition-colors hidden sm:flex items-center gap-1 ${scrolled ? 'text-green-700 hover:bg-beige-100' : 'text-white hover:bg-white/10'}`}>
                    <User className="w-5 h-5" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute top-full right-0 w-56 bg-white shadow-soft-lg rounded-md py-2 mt-2 animate-fade-in">
                      <div className="px-4 py-2 border-b border-beige-100">
                        <p className="text-sm font-medium text-green-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-beige-500">{user?.email}</p>
                      </div>
                      <Link href="/account" className="block px-4 py-2.5 text-sm text-green-700 hover:bg-beige-50">My Account</Link>
                      <Link href="/account/orders" className="block px-4 py-2.5 text-sm text-green-700 hover:bg-beige-50">Orders</Link>
                      <Link href="/account/wishlist" className="block px-4 py-2.5 text-sm text-green-700 hover:bg-beige-50">Wishlist</Link>
                      {(user?.role === 'admin' || user?.role === 'super_admin') && (
                        <Link href="/admin" className="block px-4 py-2.5 text-sm text-gold-600 hover:bg-gold-50 font-medium">Admin</Link>
                      )}
                      <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-semantic-error hover:bg-semantic-error/5">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth/login" className={`p-2.5 rounded-sm transition-colors hidden sm:block ${scrolled ? 'text-green-700 hover:bg-beige-100' : 'text-white hover:bg-white/10'}`}>
                  <User className="w-5 h-5" />
                </Link>
              )}

              <Link href="/account/wishlist" className={`p-2.5 rounded-sm relative transition-colors hidden sm:block ${scrolled ? 'text-green-700 hover:bg-beige-100' : 'text-white hover:bg-white/10'}`}>
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishlistCount}</span>}
              </Link>

              <Link href="/cart" className={`p-2.5 rounded-sm relative transition-colors ${scrolled ? 'text-green-700 hover:bg-beige-100' : 'text-white hover:bg-white/10'}`}>
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
              </Link>

              <button onClick={() => setIsOpen(!isOpen)} className={`lg:hidden p-2.5 rounded-sm transition-colors ${scrolled ? 'text-green-700 hover:bg-beige-100' : 'text-white hover:bg-white/10'}`}>
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsOpen(false)} />
            <div className="fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-soft-xl animate-slide-left overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-beige-100">
                <h2 className="text-xl font-display font-bold text-green-700">ORPIND<span className="text-gold-500">.</span></h2>
                <button onClick={() => setIsOpen(false)} className="p-2 text-green-700 hover:bg-beige-100 rounded-sm">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-4 py-6 space-y-1">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="block px-4 py-3 text-green-800 hover:bg-beige-50 hover:text-gold-600 rounded-sm font-medium transition-colors">
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-beige-100">
                  <p className="px-4 py-2 text-xs font-semibold text-beige-400 uppercase tracking-wider">Categories</p>
                  {categories.map((cat) => (
                    <Link key={cat.slug} href={`/shop?category=${cat.slug}`} onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-sm text-green-600 hover:bg-beige-50 hover:text-gold-600 transition-colors">
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <div className="pt-4 border-t border-beige-100">
                  {isAuthenticated ? (
                    <>
                      <Link href="/account" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-green-800 hover:bg-beige-50 font-medium">My Account</Link>
                      <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-left px-4 py-3 text-semantic-error hover:bg-semantic-error/5 font-medium">Logout</button>
                    </>
                  ) : (
                    <Link href="/auth/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-green-800 hover:bg-beige-50 font-medium">Login / Register</Link>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {showSearch && (
        <div className="fixed inset-0 z-[60] bg-green-900/60 backdrop-blur-sm flex items-start justify-center pt-24 animate-fade-in" onClick={() => setShowSearch(false)}>
          <div className="w-full max-w-2xl mx-4" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="bg-white rounded-md shadow-soft-lg p-4 flex items-center gap-3">
              <Search className="w-5 h-5 text-beige-400 flex-shrink-0" />
              <input autoFocus type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search for spices, grains, recipes..." className="flex-1 text-lg outline-none text-green-900 placeholder:text-beige-400" />
              <button type="button" onClick={() => setShowSearch(false)} className="p-2 hover:bg-beige-100 rounded-sm"><X className="w-5 h-5 text-beige-500" /></button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
