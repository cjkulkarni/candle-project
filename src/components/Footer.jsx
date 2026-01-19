'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-lavender-500">Luxe Candles</h3>
            <p className="text-sm leading-relaxed">
              Premium handcrafted candles that transform your space into a sanctuary of warmth and elegance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-lavender-500 transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-lavender-500 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-lavender-500 transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-lavender-500 transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-sm hover:text-lavender-500 transition-colors duration-300">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/customize" className="text-sm hover:text-lavender-500 transition-colors duration-300">
                  Customize
                </Link>
              </li>
              <li>
                <Link href="/book-class" className="text-sm hover:text-lavender-500 transition-colors duration-300">
                  Book a Class
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-lavender-500 transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-lavender-500 transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-lavender-500 transition-colors duration-300">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-lavender-500 transition-colors duration-300">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-lavender-500 transition-colors duration-300">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-lavender-500 transition-colors duration-300">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-sm mb-4">Subscribe to get special offers and updates.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-l-md bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-lavender-500"
              />
              <button className="px-4 py-2 bg-lavender-600 hover:bg-lavender-700 text-white rounded-r-md transition-colors duration-300">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center space-y-2">
          <p className="text-sm">
            © {new Date().getFullYear()} Luxe Candles. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Developed by{' '}
            <a
              href="https://byterings.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lavender-500 hover:text-lavender-400 transition-colors duration-300"
            >
              Byterings
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
