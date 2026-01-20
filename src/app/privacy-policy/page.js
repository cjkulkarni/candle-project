'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: [
        {
          subtitle: 'Personal Information',
          text: 'When you make a purchase or create an account, we collect information such as your name, email address, shipping address, phone number, and payment information.'
        },
        {
          subtitle: 'Usage Information',
          text: 'We automatically collect information about how you interact with our website, including your IP address, browser type, pages visited, and time spent on our site.'
        },
        {
          subtitle: 'Cookies',
          text: 'We use cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze website traffic.'
        }
      ]
    },
    {
      title: '2. How We Use Your Information',
      content: [
        {
          text: 'We use the information we collect to:'
        },
        {
          list: [
            'Process and fulfill your orders',
            'Send order confirmations and shipping updates',
            'Respond to your inquiries and provide customer support',
            'Send promotional emails (with your consent)',
            'Improve our website and services',
            'Prevent fraud and ensure security',
            'Comply with legal obligations'
          ]
        }
      ]
    },
    {
      title: '3. Information Sharing',
      content: [
        {
          text: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with:'
        },
        {
          list: [
            'Shipping partners to deliver your orders',
            'Payment processors to handle transactions',
            'Service providers who assist with our operations',
            'Law enforcement when required by law'
          ]
        },
        {
          text: 'All third parties are required to protect your information and use it only for the purposes specified.'
        }
      ]
    },
    {
      title: '4. Data Security',
      content: [
        {
          text: 'We implement industry-standard security measures to protect your personal information, including:'
        },
        {
          list: [
            'Secure HTTPS encryption for all data transmission',
            'Regular security assessments and updates',
            'Limited access to personal information on a need-to-know basis',
            'Secure storage of sensitive data'
          ]
        },
        {
          text: 'While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.'
        }
      ]
    },
    {
      title: '5. Your Rights',
      content: [
        {
          text: 'You have the right to:'
        },
        {
          list: [
            'Access the personal information we hold about you',
            'Request correction of inaccurate information',
            'Request deletion of your personal information',
            'Opt-out of marketing communications',
            'Withdraw consent where applicable'
          ]
        },
        {
          text: 'To exercise these rights, please contact us at privacy@luxecandles.com.'
        }
      ]
    },
    {
      title: '6. Cookies Policy',
      content: [
        {
          text: 'We use the following types of cookies:'
        },
        {
          list: [
            'Essential cookies: Required for basic website functionality',
            'Analytics cookies: Help us understand how visitors use our site',
            'Preference cookies: Remember your settings and preferences',
            'Marketing cookies: Used to deliver relevant advertisements'
          ]
        },
        {
          text: 'You can manage cookie preferences through your browser settings. Note that disabling certain cookies may affect website functionality.'
        }
      ]
    },
    {
      title: '7. Third-Party Links',
      content: [
        {
          text: 'Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.'
        }
      ]
    },
    {
      title: '8. Children\'s Privacy',
      content: [
        {
          text: 'Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.'
        }
      ]
    },
    {
      title: '9. Changes to This Policy',
      content: [
        {
          text: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.'
        }
      ]
    },
    {
      title: '10. Contact Us',
      content: [
        {
          text: 'If you have any questions about this Privacy Policy or our data practices, please contact us at:'
        },
        {
          contact: {
            email: 'privacy@luxecandles.com',
            address: 'Luxe Candles, Mumbai, Maharashtra, India'
          }
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
            <Shield className="w-8 h-8 text-lavender-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4"
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            Last updated: January 2026
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-8 mb-8">
            <p className="text-gray-600 leading-relaxed">
              At Luxe Candles, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from us.
            </p>
          </Card>
        </motion.div>

        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="mb-8"
          >
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
              <div className="space-y-4">
                {section.content.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    {item.subtitle && (
                      <h3 className="font-medium text-gray-900 mb-2">{item.subtitle}</h3>
                    )}
                    {item.text && (
                      <p className="text-gray-600 leading-relaxed">{item.text}</p>
                    )}
                    {item.list && (
                      <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                        {item.list.map((listItem, listIndex) => (
                          <li key={listIndex}>{listItem}</li>
                        ))}
                      </ul>
                    )}
                    {item.contact && (
                      <div className="bg-gray-50 p-4 rounded-lg mt-2">
                        <p className="text-gray-600">
                          <strong>Email:</strong>{' '}
                          <a href={`mailto:${item.contact.email}`} className="text-lavender-600 hover:underline">
                            {item.contact.email}
                          </a>
                        </p>
                        <p className="text-gray-600">
                          <strong>Address:</strong> {item.contact.address}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
