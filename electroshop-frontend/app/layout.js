import './globals.css';
import Providers from './providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MainShell from '@/components/layout/MainShell';

export const metadata = {
  title: { default: 'ElectroShop — Next-Gen Electronics', template: '%s | ElectroShop' },
  description: 'Shop the latest smartphones, laptops, tablets and accessories from top brands at ElectroShop.',
  keywords: ['electronics', 'smartphones', 'laptops', 'tablets', 'accessories', 'tech'],
  openGraph: {
    title: 'ElectroShop — Next-Gen Electronics',
    description: 'Premium electronics store. Top brands, best prices.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#0f172a] text-slate-100 min-h-screen flex flex-col antialiased">
        <Providers>
          <Navbar />
          <MainShell>{children}</MainShell>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
