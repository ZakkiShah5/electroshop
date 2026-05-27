const Star = ({ fill }) => (
  <svg
    className={`w-4 h-4 ${fill === 'full' ? 'text-yellow-400' : fill === 'half' ? 'text-yellow-400' : 'text-slate-600'}`}
    fill={fill === 'full' ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={fill === 'empty' ? 1.5 : 0}
    viewBox="0 0 24 24"
  >
    {fill === 'half' ? (
      <>
        <defs>
          <linearGradient id="half">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          fill="url(#half)"
          stroke="currentColor"
          strokeWidth={1}
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </>
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    )}
  </svg>
);

export default function StarRating({ rating = 0, maxStars = 5, showValue = false, size = 'sm' }) {
  const stars = Array.from({ length: maxStars }, (_, i) => {
    if (i < Math.floor(rating)) return 'full';
    if (i === Math.floor(rating) && rating % 1 >= 0.5) return 'half';
    return 'empty';
  });

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {stars.map((fill, i) => (
          <Star key={i} fill={fill} />
        ))}
      </div>
      {showValue && (
        <span className="text-slate-400 text-xs ml-1">{Number(rating).toFixed(1)}</span>
      )}
    </div>
  );
}
