'use client';

import { usePathname } from 'next/navigation';

export default function MainShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  return (
    <main className={`flex-1 ${isAdmin ? '' : 'pt-16'}`}>
      {children}
    </main>
  );
}
