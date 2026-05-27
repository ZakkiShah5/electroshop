// Format a number as USD currency: 1234.5 → "$1,234.50"
export const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price ?? 0);

// Format a date string/object: "2026-05-27T…" → "May 27, 2026"
export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// Truncate long text with ellipsis
export const truncateText = (text = '', maxLength = 120) =>
  text.length <= maxLength ? text : text.slice(0, maxLength).trimEnd() + '...';

// Return stock status label + tailwind color key
export const getStockStatus = (stock) => {
  if (stock === 0) return { label: 'Out of Stock', color: 'red',    variant: 'error',   available: false };
  if (stock <= 5)  return { label: 'Low Stock',    color: 'yellow', variant: 'warning', available: true };
  if (stock <= 20) return { label: 'Low Stock',    color: 'yellow', variant: 'warning', available: true };
  return               { label: 'In Stock',     color: 'green',  variant: 'success', available: true };
};

// Return discount string: "25% OFF", or "" if no discount
export const calculateDiscount = (price, comparePrice) => {
  if (!comparePrice || comparePrice <= price) return '';
  const pct = Math.round(((comparePrice - price) / comparePrice) * 100);
  return `${pct}% OFF`;
};

// Generate a human-readable order ID
export const generateOrderId = () => {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${year}-${rand}`;
};

// Extract a readable error message from an Axios error
export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong';

// Merge class names (lightweight cx helper)
export const cn = (...classes) => classes.filter(Boolean).join(' ');
