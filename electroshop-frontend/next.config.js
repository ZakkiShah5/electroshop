/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'fakestoreapi.com',
      'i.imgur.com',
      'placehold.co',
      'store.storeimages.cdn-apple.com',
      'images.samsung.com',
      'store.google.com',
    ],
    unoptimized: true,
  },
};

export default nextConfig;
