import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ClientLayout from './components/ClientLayout';

export const metadata = { title: 'WanderShare', description: 'Discover Travel Experiences' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f8faff' }}>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}