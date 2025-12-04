import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Providers from './providers';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ToastProvider from '@/components/ToastProvider';
import CartDrawer from '@/components/CartDrawer';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Flour & Fantasies - Handcrafted Cakes & Pastries',
  description: 'Premium bakery offering handcrafted cakes and pastries made with love and the finest ingredients.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <Providers session={session}>
           <ToastProvider />
          <Navigation />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}