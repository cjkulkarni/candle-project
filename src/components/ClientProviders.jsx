'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/context/CartContext';
import { UserProvider } from '@/context/UserContext';
import CartDrawer from '@/components/CartDrawer';
import ReCaptchaProvider from '@/components/ReCaptchaProvider';

export default function ClientProviders({ children }) {
    return (
        <ReCaptchaProvider>
            <UserProvider>
                <CartProvider>
                    <Navbar />
                    {children}
                    <Footer />
                    <CartDrawer />
                    <Toaster />
                </CartProvider>
            </UserProvider>
        </ReCaptchaProvider>
    );
}
