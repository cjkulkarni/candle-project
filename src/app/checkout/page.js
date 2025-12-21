'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart, fetchCart, nonce } = useCart();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [billingDetails, setBillingDetails] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address1: user?.billing?.address1 || '',
    address2: user?.billing?.address2 || '',
    city: user?.billing?.city || '',
    state: user?.billing?.state || '',
    postcode: user?.billing?.postcode || '',
    country: 'IN', // India country code
  });

  const [shippingDetails, setShippingDetails] = useState({
    firstName: user?.shipping?.firstName || '',
    lastName: user?.shipping?.lastName || '',
    address1: user?.shipping?.address1 || '',
    address2: user?.shipping?.address2 || '',
    city: user?.shipping?.city || '',
    state: user?.shipping?.state || '',
    postcode: user?.shipping?.postcode || '',
    country: 'IN', // India country code
  });

  const [orderNotes, setOrderNotes] = useState('');
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    if (section === 'billing') {
      setBillingDetails(prev => ({ ...prev, [name]: value }));
    } else {
      setShippingDetails(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to place an order');
      router.push('/auth/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare order data for WooCommerce Store API
      const orderData = {
        billing_address: {
          first_name: billingDetails.firstName,
          last_name: billingDetails.lastName,
          address_1: billingDetails.address1,
          address_2: billingDetails.address2,
          city: billingDetails.city,
          state: billingDetails.state,
          postcode: billingDetails.postcode,
          country: billingDetails.country,
          email: billingDetails.email,
          phone: billingDetails.phone,
        },
        shipping_address: useShippingAsBilling
          ? {
              first_name: billingDetails.firstName,
              last_name: billingDetails.lastName,
              address_1: billingDetails.address1,
              address_2: billingDetails.address2,
              city: billingDetails.city,
              state: billingDetails.state,
              postcode: billingDetails.postcode,
              country: billingDetails.country,
            }
          : {
              first_name: shippingDetails.firstName,
              last_name: shippingDetails.lastName,
              address_1: shippingDetails.address1,
              address_2: shippingDetails.address2,
              city: shippingDetails.city,
              state: shippingDetails.state,
              postcode: shippingDetails.postcode,
              country: shippingDetails.country,
            },
      };

      // Add customer note if provided
      if (orderNotes) {
        orderData.customer_note = orderNotes;
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
          'X-WC-Store-API-Nonce': nonce,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Order created successfully
      toast.success('Order placed successfully!');

      // Clear the cart
      clearCart();
      await fetchCart();

      // Redirect to order confirmation or profile page
      router.push(`/profile?order=${data.order_number || data.id}`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Add some items to your cart before checking out.
          </p>
          <Button onClick={() => router.push('/shop')}>Continue Shopping</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                {/* Billing Details */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={billingDetails.firstName}
                        onChange={(e) => handleInputChange(e, 'billing')}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={billingDetails.lastName}
                        onChange={(e) => handleInputChange(e, 'billing')}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={billingDetails.email}
                        onChange={(e) => handleInputChange(e, 'billing')}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={billingDetails.phone}
                        onChange={(e) => handleInputChange(e, 'billing')}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address1">Street Address *</Label>
                      <Input
                        id="address1"
                        name="address1"
                        value={billingDetails.address1}
                        onChange={(e) => handleInputChange(e, 'billing')}
                        placeholder="House number and street name"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        id="address2"
                        name="address2"
                        value={billingDetails.address2}
                        onChange={(e) => handleInputChange(e, 'billing')}
                        placeholder="Apartment, suite, unit, etc. (optional)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={billingDetails.city}
                        onChange={(e) => handleInputChange(e, 'billing')}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={billingDetails.state}
                        onChange={(e) => handleInputChange(e, 'billing')}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postcode">Postcode *</Label>
                      <Input
                        id="postcode"
                        name="postcode"
                        value={billingDetails.postcode}
                        onChange={(e) => handleInputChange(e, 'billing')}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        name="country"
                        value="India (IN)"
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                  </div>
                </Card>

                {/* Order Notes */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Notes</h2>
                  <Label htmlFor="orderNotes">
                    Notes about your order (optional)
                  </Label>
                  <Textarea
                    id="orderNotes"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Special notes for delivery"
                    rows={4}
                  />
                </Card>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.key}`} className="flex gap-4">
                      <div className="relative aspect-square h-16 w-16 rounded overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-sm">
                        {item.currencySymbol}
                        {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>
                      {items[0]?.currencySymbol || '₹'}
                      {cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>
                      {items[0]?.currencySymbol || '₹'}
                      {cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Your order will be processed without payment and saved to your
                    WordPress account.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
