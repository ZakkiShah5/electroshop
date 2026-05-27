'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const footerLinks = {
  Shop: [
    { label: 'All Products', href: '/products' },
    { label: 'Smartphones', href: '/products?category=phones' },
    { label: 'Laptops', href: '/products?category=laptops' },
    { label: 'Tablets', href: '/products?category=tablets' },
    { label: 'Accessories', href: '/products?category=accessories' },
  ],
  Account: [
    { label: 'Sign In', href: '/auth/login' },
    { label: 'Create Account', href: '/auth/register' },
    { label: 'My Orders', href: '/orders' },
    { label: 'Cart', href: '/cart' },
  ],
  Support: [
    { label: 'Contact Us', href: '#' },
    { label: 'FAQ', href: '#' },
    { label: 'Shipping Policy', href: '#' },
    { label: 'Returns', href: '#' },
  ],
};

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white font-bold text-xl">
                Electro<span className="text-blue-400">Shop</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Your trusted source for premium electronics. Smartphones, laptops, tablets and accessories from the world's top brands.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              {['twitter', 'instagram', 'facebook', 'youtube'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                  aria-label={s}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold text-sm mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} ElectroShop. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
              <a key={l} href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
