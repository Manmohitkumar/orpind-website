'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Star, FileText, Image,
  Settings, BarChart3, Truck, Receipt, CreditCard, Shield, Activity, ChevronDown,
  ChevronRight, Search, Bell, Menu, X, Warehouse, Mail, Globe,
} from 'lucide-react';

const sidebarSections = [
  { title: 'Main', items: [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Analytics', href: '/admin/reports', icon: BarChart3 },
  ]},
  { title: 'Catalog', items: [
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: Globe },
    { label: 'Inventory', href: '/admin/inventory', icon: Warehouse },
  ]},
  { title: 'Sales', items: [
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Coupons', href: '/admin/coupons', icon: Tag },
    { label: 'Reviews', href: '/admin/reviews', icon: Star },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
  ]},
  { title: 'Content', items: [
    { label: 'Blog', href: '/admin/blog', icon: FileText },
    { label: 'Banners', href: '/admin/banners', icon: Image },
    { label: 'Email Templates', href: '/admin/email-templates', icon: Mail },
  ]},
  { title: 'Operations', items: [
    { label: 'Shipping', href: '/admin/shipping', icon: Truck },
    { label: 'Tax', href: '/admin/tax', icon: Receipt },
    { label: 'Employees', href: '/admin/employees', icon: Shield },
  ]},
  { title: 'System', items: [
    { label: 'Settings', href: '/admin/settings', icon: Settings },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: Activity },
  ]},
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-green-900 text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 h-16 border-b border-neutral-800`}>
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-sm bg-gold-600 flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">O</span>
              </div>
              <span className="font-display font-bold text-sm">Admin</span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="text-neutral-400 hover:text-white p-1">
            <ChevronRight className={`w-4 h-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {sidebarSections.map(section => (
            <div key={section.title} className="mb-4">
              {!collapsed && <p className="px-4 mb-2 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">{section.title}</p>}
              {section.items.map(item => (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-sm text-sm transition-colors ${pathname === item.href ? 'bg-gold-600 text-white' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'}`}
                  title={collapsed ? item.label : undefined}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-green-900 text-white overflow-y-auto">
            <div className="flex items-center justify-between px-4 h-16 border-b border-neutral-800">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-sm bg-gold-600 flex items-center justify-center"><span className="text-white font-display font-bold text-sm">O</span></div>
                <span className="font-display font-bold text-sm">Admin Panel</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <nav className="py-4">
              {sidebarSections.map(section => (
                <div key={section.title} className="mb-4">
                  <p className="px-4 mb-2 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">{section.title}</p>
                  {section.items.map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-sm text-sm ${pathname === item.href ? 'bg-gold-600 text-white' : 'text-neutral-300 hover:bg-neutral-800'}`}>
                      <item.icon className="w-4 h-4" /> {item.label}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-neutral-100 flex items-center justify-between px-4 lg:px-8">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-sm">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:flex items-center bg-neutral-50 rounded-sm px-3 py-2 w-80">
            <Search className="w-4 h-4 text-neutral-400" />
            <input type="text" placeholder="Search..." className="ml-2 bg-transparent text-sm outline-none w-full" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-sm">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Link href="/" target="_blank" className="hidden sm:inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-gold-600">
              View Store →
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">PW</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-neutral-800">Pawan</p>
                <p className="text-[10px] text-neutral-500">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
