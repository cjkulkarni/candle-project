import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/context/CartContext';
import { UserProvider } from '@/context/UserContext';
import CartDrawer from '@/components/CartDrawer';

export const metadata = {
  title: 'Luxe Candles - Premium Handcrafted Candles',
  description: 'Handcrafted luxury candles that illuminate your space with warmth, elegance, and unforgettable fragrances.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
            <CartDrawer />
            <Toaster />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
