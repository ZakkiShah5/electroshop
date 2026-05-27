'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'All Products' },
  { href: '/products?category=phones', label: 'Phones' },
  { href: '/products?category=laptops', label: 'Laptops' },
  { href: '/products?category=tablets', label: 'Tablets' },
  { href: '/products?category=accessories', label: 'Accessories' },
];

export default function MobileMenu({ isOpen, onClose }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogout = () => { logout(); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative ml-auto w-72 h-full bg-slate-900 border-l border-slate-800 flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <span className="text-white font-bold text-lg">
            Electro<span className="text-blue-400">Shop</span>
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User info */}
        {isAuthenticated && (
          <div className="p-4 border-b border-slate-800 bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{user?.name}</p>
                <p className="text-slate-400 text-xs">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex items-center px-5 py-3 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium"
            >
              {label}
            </Link>
          ))}

          <div className="border-t border-slate-800 mt-2 pt-2">
            <Link href="/cart" onClick={onClose} className="flex items-center justify-between px-5 py-3 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium">
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{cartCount}</span>
              )}
            </Link>
            {isAuthenticated && (
              <Link href="/orders" onClick={onClose} className="flex items-center px-5 py-3 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium">
                My Orders
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" onClick={onClose} className="flex items-center px-5 py-3 text-blue-400 hover:text-blue-300 hover:bg-slate-800 transition-colors text-sm font-medium">
                Admin Panel
              </Link>
            )}
          </div>
        </nav>

        {/* Auth actions */}
        <div className="p-4 border-t border-slate-800">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="w-full bg-red-900/40 hover:bg-red-900/70 text-red-400 hover:text-red-300 py-2.5 rounded-xl text-sm font-medium transition-colors border border-red-900">
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/auth/login" onClick={onClose} className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                Sign In
              </Link>
              <Link href="/auth/register" onClick={onClose} className="w-full text-center border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
