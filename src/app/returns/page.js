'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle, XCircle, AlertCircle, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function ReturnsPage() {
  const eligibleItems = [
    'Unused and unopened candles in original packaging',
    'Items received damaged or defective',
    'Wrong item received',
    'Items that don\'t match the description'
  ];

  const nonEligibleItems = [
    'Used or burned candles',
    'Items without original packaging',
    'Items returned after 15 days',
    'Items damaged due to misuse',
    'Sale items (unless defective)'
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
            Returns & Refunds
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            Our hassle-free return policy for your peace of mind
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Return Policy Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8 mb-8 bg-lavender-50 border-lavender-200">
            <div className="flex items-start gap-4">
              <div className="bg-lavender-600 p-3 rounded-full">
                <RotateCcw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">15-Day Return Policy</h2>
                <p className="text-gray-600">
                  We want you to be completely satisfied with your purchase. If you're not happy with your order, you can return eligible items within 15 days of delivery for a full refund or exchange.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Eligible Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 h-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Eligible for Return
              </h3>
              <ul className="space-y-3">
                {eligibleItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>

          {/* Non-Eligible Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 h-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Not Eligible for Return
              </h3>
              <ul className="space-y-3">
                {nonEligibleItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>

        {/* Return Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">How to Return</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-lavender-600 text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Initiate Return Request</h4>
                  <p className="text-gray-600">Email us at support@luxecandles.com with your order number and reason for return.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-lavender-600 text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Receive Return Authorization</h4>
                  <p className="text-gray-600">We'll review your request and send you a return authorization with shipping instructions within 24-48 hours.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-lavender-600 text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Ship the Item</h4>
                  <p className="text-gray-600">Pack the item securely in its original packaging and ship it to our return address. Keep the tracking number.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-lavender-600 text-white rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Receive Refund</h4>
                  <p className="text-gray-600">Once we receive and inspect the item, your refund will be processed within 5-7 business days.</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Refund Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Refund Information</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                <strong>Refund Method:</strong> Refunds will be issued to the original payment method used for the purchase.
              </p>
              <p>
                <strong>Processing Time:</strong> Please allow 5-7 business days for the refund to reflect in your account after we process it.
              </p>
              <p>
                <strong>Shipping Costs:</strong> Original shipping charges are non-refundable unless the return is due to our error (wrong item, damaged, or defective).
              </p>
              <p>
                <strong>Return Shipping:</strong> Customers are responsible for return shipping costs unless the item is defective or we made an error.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-8 bg-gray-900 text-white">
            <div className="flex items-center gap-4">
              <Mail className="w-8 h-8 text-lavender-400" />
              <div>
                <h3 className="text-lg font-semibold mb-1">Need Help?</h3>
                <p className="text-gray-300">
                  Contact our support team at{' '}
                  <a href="mailto:support@luxecandles.com" className="text-lavender-400 hover:underline">
                    support@luxecandles.com
                  </a>
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
