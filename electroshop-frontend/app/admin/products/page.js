'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { productAPI } from '@/lib/api';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatPrice, getStockStatus, getErrorMessage } from '@/lib/utils';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const CATEGORIES = ['phones', 'laptops', 'tablets', 'accessories'];

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  comparePrice: '',
  category: 'phones',
  brand: '',
  stock: '',
  images: '',
  specs: [{ key: '', value: '' }],
};

// ── Spec rows ────────────────────────────────────────────────────────────────
function SpecRows({ specs, onChange }) {
  const inp = 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 w-full';

  const set = (i, field) => (e) => {
    const next = specs.map((s, idx) => idx === i ? { ...s, [field]: e.target.value } : s);
    onChange(next);
  };
  const add = () => onChange([...specs, { key: '', value: '' }]);
  const remove = (i) => onChange(specs.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      {specs.map((s, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input value={s.key} onChange={set(i, 'key')} className={inp} placeholder="Key (e.g. RAM)" />
          <input value={s.value} onChange={set(i, 'value')} className={inp} placeholder="Value (e.g. 16GB)" />
          <button
            type="button"
            onClick={() => remove(i)}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors mt-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add spec
      </button>
    </div>
  );
}

// ── Delete confirmation dialog ────────────────────────────────────────────────
function DeleteDialog({ product, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
      <div className="bg-slate-900 border border-red-900/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="w-12 h-12 bg-red-900/40 border border-red-800/50 rounded-xl flex items-center justify-center mb-4 mx-auto">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-white font-bold text-lg text-center mb-2">Delete Product</h3>
        <p className="text-slate-400 text-sm text-center mb-6">
          Are you sure you want to delete <span className="text-white font-semibold">"{product?.name}"</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={onCancel} type="button">Cancel</Button>
          <Button
            fullWidth
            loading={loading}
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            type="button"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Product modal form ────────────────────────────────────────────────────────
function ProductModal({ product, onClose, onSaved }) {
  const isEdit = !!product;
  const [form, setForm] = useState(() =>
    isEdit
      ? {
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          comparePrice: product.comparePrice || '',
          category: product.category || 'phones',
          brand: product.brand || '',
          stock: product.stock || '',
          images: (product.images || []).join(', '),
          specs: product.specs?.length
            ? product.specs.map((s) => ({ key: s.key || s[0] || '', value: s.value || s[1] || '' }))
            : [{ key: '', value: '' }],
        }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const inp = 'w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors';
  const lbl = 'block text-slate-400 text-xs font-medium mb-1.5';

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const imageList = form.images
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const specList = form.specs
        .filter((s) => s.key.trim() && s.value.trim())
        .map((s) => ({ key: s.key.trim(), value: s.value.trim() }));

      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
        category: form.category,
        brand: form.brand,
        stock: Number(form.stock),
        images: imageList,
        specs: specList,
      };

      if (isEdit) {
        const { data } = await productAPI.updateProduct(product._id, payload);
        toast.success('Product updated');
        onSaved(data, 'update');
      } else {
        const { data } = await productAPI.createProduct(payload);
        toast.success('Product created');
        onSaved(data, 'create');
      }
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl my-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className={lbl}>Product Name *</label>
            <input required value={form.name} onChange={set('name')} className={inp} placeholder="e.g. iPhone 15 Pro Max" />
          </div>

          {/* Description */}
          <div>
            <label className={lbl}>Description *</label>
            <textarea required rows={3} value={form.description} onChange={set('description')} className={`${inp} resize-none`} placeholder="Product description…" />
          </div>

          {/* Price row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Price ($) *</label>
              <input required type="number" min="0" step="0.01" value={form.price} onChange={set('price')} className={inp} placeholder="999.99" />
            </div>
            <div>
              <label className={lbl}>Compare Price ($) <span className="text-slate-600">optional</span></label>
              <input type="number" min="0" step="0.01" value={form.comparePrice} onChange={set('comparePrice')} className={inp} placeholder="1199.99" />
            </div>
          </div>

          {/* Brand + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Brand *</label>
              <input required value={form.brand} onChange={set('brand')} className={inp} placeholder="Apple" />
            </div>
            <div>
              <label className={lbl}>Category *</label>
              <select required value={form.category} onChange={set('category')} className={inp}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize bg-slate-800">{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Stock *</label>
              <input required type="number" min="0" value={form.stock} onChange={set('stock')} className={inp} placeholder="50" />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className={lbl}>Image URLs <span className="text-slate-600">(comma-separated)</span></label>
            <input value={form.images} onChange={set('images')} className={inp} placeholder="https://…/img1.jpg, https://…/img2.jpg" />
            {/* Preview first image */}
            {form.images.split(',')[0]?.trim() && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {form.images.split(',').map((url, i) => url.trim() && (
                  <div key={i} className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 relative overflow-hidden">
                    <Image src={url.trim()} alt="" fill className="object-contain p-1" onError={() => {}} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Specs */}
          <div>
            <label className={lbl}>Specifications</label>
            <SpecRows specs={form.specs} onChange={(specs) => setForm((f) => ({ ...f, specs }))} />
          </div>

          <div className="flex gap-3 pt-2 border-t border-slate-800">
            <Button variant="secondary" fullWidth type="button" onClick={onClose}>Cancel</Button>
            <Button fullWidth type="submit" loading={saving}>
              {isEdit ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalProduct, setModalProduct] = useState(undefined); // undefined = closed, null = create, obj = edit
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getProducts({ pageSize: 200 });
      setProducts(data.products ?? []);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSaved = (saved, action) => {
    if (action === 'create') {
      setProducts((prev) => [saved, ...prev]);
    } else {
      setProducts((prev) => prev.map((p) => (p._id === saved._id ? saved : p)));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productAPI.deleteProduct(deleteTarget._id);
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      toast.success('Product deleted');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <PageLoader />;

  const filtered = products.filter((p) => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-slate-400 text-sm mt-1">{products.length} products total</p>
        </div>
        <Button onClick={() => setModalProduct(null)}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or brand…"
          className="flex-1 bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
        />
        <div className="flex gap-2 flex-wrap">
          {['all', ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={[
                'px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all',
                categoryFilter === c
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700',
              ].join(' ')}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-slate-500 font-medium px-5 py-3 text-xs">Product</th>
                <th className="text-left text-slate-500 font-medium px-5 py-3 text-xs">Category</th>
                <th className="text-left text-slate-500 font-medium px-5 py-3 text-xs">Price</th>
                <th className="text-left text-slate-500 font-medium px-5 py-3 text-xs">Stock</th>
                <th className="text-left text-slate-500 font-medium px-5 py-3 text-xs">Rating</th>
                <th className="text-right text-slate-500 font-medium px-5 py-3 text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const stock = getStockStatus(product.stock);
                return (
                  <tr key={product._id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-slate-800 rounded-xl flex-shrink-0 relative overflow-hidden border border-slate-700">
                          {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-contain p-1" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">?</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium text-xs leading-snug line-clamp-2 max-w-[180px]">{product.name}</p>
                          <p className="text-slate-500 text-[11px] mt-0.5">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="default" className="capitalize">{product.category}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-white font-semibold text-xs">{formatPrice(product.price)}</p>
                      {product.comparePrice > product.price && (
                        <p className="text-slate-600 text-[11px] line-through">{formatPrice(product.comparePrice)}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={stock.variant}>{product.stock}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-yellow-400 text-xs font-medium">★ {product.rating?.toFixed(1) ?? '0.0'}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setModalProduct(product)}
                          className="px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-slate-400 font-medium">No products found</p>
            <p className="text-slate-600 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Product modal */}
      {modalProduct !== undefined && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(undefined)}
          onSaved={handleSaved}
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <DeleteDialog
          product={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
