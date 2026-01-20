'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FAQPage() {
  const faqCategories = [
    {
      title: 'Orders & Shipping',
      questions: [
        {
          question: 'How long does shipping take?',
          answer: 'Standard shipping takes 5-7 business days, while express shipping delivers within 2-3 business days. Processing time is 1-2 business days before dispatch.'
        },
        {
          question: 'Do you offer free shipping?',
          answer: 'Yes! We offer free standard shipping on all orders above ₹999. For orders below ₹999, a flat shipping fee of ₹79 applies.'
        },
        {
          question: 'Can I track my order?',
          answer: 'Absolutely! Once your order is shipped, you will receive an email with a tracking number and link to track your package in real-time.'
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Currently, we only ship within India. We are working on expanding our shipping to international locations soon. Stay tuned!'
        },
        {
          question: 'Can I change my shipping address after placing an order?',
          answer: 'If your order hasn\'t been shipped yet, please contact us immediately at support@luxecandles.com and we\'ll try to update the address. Once shipped, address changes are not possible.'
        }
      ]
    },
    {
      title: 'Products & Quality',
      questions: [
        {
          question: 'What are your candles made of?',
          answer: 'Our candles are made from 100% natural soy wax, cotton wicks, and premium fragrance oils. We never use paraffin or artificial additives.'
        },
        {
          question: 'How long do your candles burn?',
          answer: 'Burn time varies by size: Small (30-35 hours), Medium (45-50 hours), Large (60-70 hours). For optimal burn, trim the wick to 1/4 inch before each use.'
        },
        {
          question: 'Are your candles eco-friendly?',
          answer: 'Yes! Our candles are made with sustainable soy wax, lead-free cotton wicks, and recyclable packaging. We are committed to environmentally conscious practices.'
        },
        {
          question: 'Are your products vegan and cruelty-free?',
          answer: 'All our products are 100% vegan and cruelty-free. We never test on animals and don\'t use any animal-derived ingredients.'
        },
        {
          question: 'How should I store my candles?',
          answer: 'Store candles in a cool, dry place away from direct sunlight. Extreme heat can cause discoloration or melting. Keep the lid on when not in use to preserve the fragrance.'
        }
      ]
    },
    {
      title: 'Candle Care',
      questions: [
        {
          question: 'How do I get the best burn from my candle?',
          answer: 'For the first burn, let the wax pool reach the edges (about 2-3 hours). Always trim the wick to 1/4 inch before lighting. Don\'t burn for more than 4 hours at a time.'
        },
        {
          question: 'Why is my candle tunneling?',
          answer: 'Tunneling happens when the first burn wasn\'t long enough. To fix it, burn the candle until the wax melts to the edges. Using a candle warmer can also help even out the wax pool.'
        },
        {
          question: 'My candle has white frost on it. Is it damaged?',
          answer: 'No! This is called "frosting" and is natural in soy candles. It doesn\'t affect the burn quality or scent throw - it\'s actually a sign of pure, natural soy wax.'
        },
        {
          question: 'How do I clean candle wax from surfaces?',
          answer: 'For hard surfaces, let the wax cool and harden, then gently scrape it off. For fabric, place paper towels on both sides and iron on low heat. The paper will absorb the wax.'
        }
      ]
    },
    {
      title: 'Customization & Classes',
      questions: [
        {
          question: 'Can I customize a candle?',
          answer: 'Yes! Visit our Customize page to create your own personalized candle. You can choose the scent, color, size, and even add custom labels or messages.'
        },
        {
          question: 'How long does a custom order take?',
          answer: 'Custom orders typically take 5-7 business days to create, plus shipping time. We\'ll keep you updated throughout the process.'
        },
        {
          question: 'What candle-making classes do you offer?',
          answer: 'We offer Beginner, Intermediate, Advanced, and Private classes. Each class teaches different techniques and you get to take home your creations!'
        },
        {
          question: 'Do I need any experience for the classes?',
          answer: 'Not at all! Our Beginner class is perfect for first-timers. Our experienced instructors will guide you through every step of the process.'
        }
      ]
    },
    {
      title: 'Returns & Refunds',
      questions: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 15-day return policy for unused items in original packaging. Damaged or defective items can be returned for a full refund or replacement.'
        },
        {
          question: 'How do I initiate a return?',
          answer: 'Email us at support@luxecandles.com with your order number and reason for return. We\'ll send you return instructions within 24-48 hours.'
        },
        {
          question: 'When will I receive my refund?',
          answer: 'Once we receive and inspect the returned item, refunds are processed within 5-7 business days. It may take additional time for the refund to appear in your account.'
        },
        {
          question: 'Can I exchange an item instead of returning it?',
          answer: 'Yes! If you\'d like to exchange for a different scent or size, just mention it in your return request and we\'ll arrange the exchange.'
        }
      ]
    },
    {
      title: 'Payment & Security',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'Currently, we accept Cash on Delivery (COD) for all orders within India. Additional payment options coming soon!'
        },
        {
          question: 'Is my personal information secure?',
          answer: 'Absolutely. We use industry-standard security measures to protect your personal information. We never share your data with third parties without consent.'
        },
        {
          question: 'Do you offer gift cards?',
          answer: 'Gift cards are coming soon! In the meantime, you can purchase our candles as gifts and we\'ll include a beautiful gift message.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-lavender-50 via-white to-orange-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-lavender-100 rounded-full mb-6"
          >
            <HelpCircle className="w-8 h-8 text-lavender-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            Find answers to common questions about our products and services
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {faqCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * categoryIndex }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{category.title}</h2>
            <Accordion type="single" collapsible className="bg-white rounded-lg shadow-sm">
              {category.questions.map((item, index) => (
                <AccordionItem key={index} value={`${category.title}-${index}`}>
                  <AccordionTrigger className="px-6 hover:no-underline hover:bg-gray-50">
                    <span className="text-left font-medium text-gray-900">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        ))}

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-lavender-50 rounded-lg p-8 text-center mt-12"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-4">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-lavender-600 text-white font-medium rounded-lg hover:bg-lavender-700 transition-colors"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </div>
  );
}
