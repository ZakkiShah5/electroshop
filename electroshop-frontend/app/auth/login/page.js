'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  if (isAuthenticated) { router.push('/'); return null; }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(form.email, form.password);
      if (result.success) router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const inp = 'w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all';
  const lbl = 'block text-slate-300 text-sm font-medium mb-1.5';

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl">Electro<span className="text-blue-400">Shop</span></span>
          </Link>
          <h1 className="text-white font-bold text-2xl mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm">Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-slate-950/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={lbl}>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" required autoComplete="email" className={inp} />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className={lbl.replace('mb-1.5', '')}>Password</label>
                <a href="#" className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••" required autoComplete="current-password"
                  className={`${inp} pr-11`}
                />
                <button type="button" onClick={() => setShowPass((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-slate-600 text-xs">demo</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4">
            <p className="text-blue-400 text-xs font-semibold mb-2 uppercase tracking-wider">Demo Credentials</p>
            <div className="space-y-1 text-xs text-slate-400">
              <p><span className="font-medium text-slate-200">Admin:</span> admin@electroshop.com · admin123</p>
              <p><span className="font-medium text-slate-200">User:</span> user@electroshop.com · user123</p>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
