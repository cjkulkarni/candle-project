import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'Luxe Candles - Premium Handcrafted Candles',
  description: 'Handcrafted luxury candles that illuminate your space with warmth, elegance, and unforgettable fragrances.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
