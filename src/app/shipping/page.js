'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, MapPin, Package, Shield, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function ShippingPage() {
  const shippingInfo = [
    {
      icon: Truck,
      title: 'Standard Shipping',
      description: 'Delivery within 5-7 business days',
      details: 'Free on orders above ₹999'
    },
    {
      icon: Clock,
      title: 'Express Shipping',
      description: 'Delivery within 2-3 business days',
      details: '₹149 flat rate'
    },
    {
      icon: MapPin,
      title: 'Delivery Areas',
      description: 'We deliver across India',
      details: 'PAN India coverage'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-lavender-50 via-white to-orange-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4"
          >
            Shipping Information
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            Everything you need to know about our shipping policies
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Shipping Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {shippingInfo.map((item, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-lavender-100 rounded-full mb-4">
                <item.icon className="w-6 h-6 text-lavender-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-1">{item.description}</p>
              <p className="text-sm text-lavender-600 font-medium">{item.details}</p>
            </Card>
          ))}
        </motion.div>

        {/* Detailed Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-8"
        >
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-lavender-600" />
              Shipping Rates
            </h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Orders below ₹999</span>
                  <span className="text-gray-600">₹79 (Standard) / ₹149 (Express)</span>
                </div>
              </div>
              <div className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Orders ₹999 and above</span>
                  <span className="text-green-600 font-medium">FREE Standard Shipping</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Express shipping upgrade</span>
                  <span className="text-gray-600">₹70 additional</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-lavender-600" />
              Processing Time
            </h2>
            <div className="space-y-3 text-gray-600">
              <p>
                All orders are processed within <strong>1-2 business days</strong> (excluding weekends and holidays) after receiving your order confirmation email.
              </p>
              <p>
                During peak seasons or sale periods, processing may take an additional 1-2 days.
              </p>
              <p>
                You will receive a shipping confirmation email with tracking information once your order has been dispatched.
              </p>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-lavender-600" />
              Safe Packaging
            </h2>
            <div className="space-y-3 text-gray-600">
              <p>
                Our candles are carefully packaged to ensure they arrive in perfect condition. Each candle is individually wrapped and placed in custom-designed boxes with protective padding.
              </p>
              <p>
                During summer months, we take extra precautions to protect your candles from heat damage during transit.
              </p>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-lavender-600" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Can I track my order?</h4>
                <p className="text-gray-600 text-sm">Yes, once your order is shipped, you will receive a tracking number via email.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Do you ship internationally?</h4>
                <p className="text-gray-600 text-sm">Currently, we only ship within India. International shipping coming soon!</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">What if my order is delayed?</h4>
                <p className="text-gray-600 text-sm">Please contact our customer support if your order hasn't arrived within the estimated delivery time.</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
