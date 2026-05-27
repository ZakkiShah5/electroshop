'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { productAPI } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/products/ProductCard';
import { formatPrice, calculateDiscount, getStockStatus } from '@/lib/utils';
import toast from 'react-hot-toast';

// ── Skeleton ─────────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#0f172a] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 mb-8">
          <div className="h-4 skeleton rounded w-16" />
          <div className="h-4 skeleton rounded w-4" />
          <div className="h-4 skeleton rounded w-20" />
          <div className="h-4 skeleton rounded w-4" />
          <div className="h-4 skeleton rounded w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="aspect-square skeleton rounded-2xl" />
            <div className="flex gap-3 mt-4">
              {[...Array(4)].map((_, i) => <div key={i} className="w-16 h-16 skeleton rounded-xl flex-shrink-0" />)}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-5 skeleton rounded w-24" />
            <div className="h-8 skeleton rounded w-3/4" />
            <div className="h-8 skeleton rounded w-2/3" />
            <div className="h-6 skeleton rounded w-28" />
            <div className="h-10 skeleton rounded w-36 mt-2" />
            <div className="space-y-2 mt-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-4 skeleton rounded w-full" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productAPI.getProduct(id)
      .then(({ data }) => {
        setProduct(data);
        setSelectedImage(0);
        return productAPI.getProducts({ category: data.category, pageSize: 4 });
      })
      .then(({ data }) => {
        setRelated((data.products ?? []).filter((p) => p._id !== id).slice(0, 4));
      })
      .catch(() => router.push('/products'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <DetailSkeleton />;
  if (!product) return null;

  const stockStatus = getStockStatus(product.stock);
  const discount = calculateDiscount(product.price, product.comparePrice);
  const fallback = `https://placehold.co/600x600/1e293b/3b82f6?text=${encodeURIComponent(product.name?.split(' ')[0] ?? 'Product')}`;
  const images = product.images?.length ? product.images : [fallback];
  const specs = product.specs instanceof Map
    ? Object.fromEntries(product.specs)
    : Array.isArray(product.specs)
      ? Object.fromEntries(product.specs.map((s) => [s.key ?? s[0] ?? '', s.value ?? s[1] ?? '']))
      : (product.specs ?? {});

  const handleAddToCart = async () => {
    setAddingToCart(true);
    addToCart(product, qty);
    setTimeout(() => setAddingToCart(false), 600);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center flex-wrap gap-1.5 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <svg className="w-3.5 h-3.5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link href="/products" className="hover:text-blue-400 transition-colors">Products</Link>
          <svg className="w-3.5 h-3.5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link href={`/products?category=${product.category}`} className="hover:text-blue-400 transition-colors capitalize">{product.category}</Link>
          <svg className="w-3.5 h-3.5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-slate-300 line-clamp-1 max-w-xs">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-20">

          {/* ── Image Gallery ─────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {!!discount && (
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow">
                  {discount}
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={[
                      'relative w-16 h-16 flex-shrink-0 bg-slate-900 rounded-xl border-2 overflow-hidden transition-all',
                      i === selectedImage ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-slate-700 hover:border-slate-500',
                    ].join(' ')}
                  >
                    <Image src={img} alt={`view ${i + 1}`} fill className="object-contain p-1.5" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ───────────────────────────────────────────── */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">{product.brand}</span>
              <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={product.rating} showValue />
              <span className="text-slate-600 text-sm">·</span>
              <span className="text-slate-400 text-sm">{product.numReviews} reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-slate-800">
              <span className="text-white font-black text-4xl">{formatPrice(product.price)}</span>
              {product.comparePrice > product.price && (
                <span className="text-slate-500 text-xl line-through">{formatPrice(product.comparePrice)}</span>
              )}
              {!!discount && (
                <span className="bg-green-900/20 text-green-400 border border-green-800/50 text-sm font-bold px-2.5 py-1 rounded-full">
                  Save {formatPrice(product.comparePrice - product.price)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-400 leading-relaxed mb-8 text-sm">{product.description}</p>

            {/* Quantity + Actions */}
            {stockStatus.available && (
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-slate-400 text-sm font-medium">Quantity:</span>
                  <div className="flex items-center border border-slate-700 rounded-xl overflow-hidden bg-slate-800">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-white font-bold text-lg w-10 text-center border-x border-slate-700">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <span className="text-slate-500 text-xs">{product.stock} in stock</span>
                </div>

                <div className="flex gap-3">
                  <Button size="lg" loading={addingToCart} onClick={handleAddToCart} className="flex-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Cart
                  </Button>
                  <Button size="lg" variant="secondary" onClick={handleBuyNow} className="flex-1">
                    Buy Now
                  </Button>
                </div>
              </div>
            )}

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3 py-5 border-t border-b border-slate-800 mb-8">
              {[
                { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" /></svg>, title: 'Free Shipping', sub: 'Orders over $50' },
                { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, title: 'Secure Pay', sub: 'SSL encrypted' },
                { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>, title: '30-Day Return', sub: 'Hassle-free' },
              ].map(({ icon, title, sub }) => (
                <div key={title} className="text-center">
                  <div className="w-10 h-10 bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-2 text-blue-400">{icon}</div>
                  <p className="text-slate-200 text-xs font-semibold">{title}</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            {/* Specs */}
            {Object.keys(specs).length > 0 && (
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Specifications</h3>
                <div className="rounded-2xl border border-slate-800 overflow-hidden">
                  {Object.entries(specs).map(([key, val], i) => (
                    <div key={key} className={`flex items-start gap-4 px-5 py-3 text-sm ${i % 2 === 0 ? 'bg-slate-800/50' : 'bg-slate-900'}`}>
                      <span className="text-slate-400 font-medium min-w-[140px] flex-shrink-0">{key}</span>
                      <span className="text-slate-200">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="border-t border-slate-800 pt-16">
            <h2 className="text-2xl font-bold text-white mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
