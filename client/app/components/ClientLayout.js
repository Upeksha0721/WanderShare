'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <div style={{ margin: 0, padding: 0 }}>{children}</div>;
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: '0' }}>{children}</div>
    </>
  );
}