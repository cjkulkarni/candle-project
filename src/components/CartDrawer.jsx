'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    toggleCart,
    removeItem,
    updateQuantity,
    cartTotal,
    cartCount,
    loading,
  } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({cartCount} items)
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => toggleCart(false)}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-6">
              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex gap-4 py-4 border-b"
                  >
                    <div className="relative aspect-square h-20 w-20 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Size: {item.size}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.key, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1 || loading}
                            className="p-2 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.key, item.quantity + 1)
                            }
                            disabled={loading}
                            className="p-2 hover:bg-gray-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="font-medium">
                          {item.currencySymbol}{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Footer */}
            <div className="border-t pt-6">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-6">
                <p>Subtotal</p>
                <p>{items[0]?.currencySymbol || '₹'}{cartTotal.toFixed(2)}</p>
              </div>

              <div className="space-y-4">
                <Link href="/checkout" onClick={() => toggleCart(false)}>
                  <Button className="w-full" disabled={loading || items.length === 0}>
                    Proceed to Checkout
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => toggleCart(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}