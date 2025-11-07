'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { motion } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
   
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-lavender-200 to-lavender-500 text-white py-2 px-4 text-center text-sm">
        <p className="font-light">Member's days - Your exclusive sitewide offer awaits</p>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="text-3xl font-serif font-bold text-lavender-700 transition-transform duration-300 group-hover:scale-105">
                Luxe Candles
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-medium tracking-wide transition-all duration-300 relative group ${
                    pathname === link.path
                      ? 'text-lavender-700'
                      : 'text-gray-700 hover:text-lavender-700'
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-lavender-700 transition-all duration-300 ${
                    pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-6">
              <button className="text-gray-700 hover:text-lavender-700 transition-colors duration-300">
                <Search className="w-5 h-5" />
              </button>
              <button className="text-gray-700 hover:text-lavender-700 transition-colors duration-300">
                <User className="w-5 h-5" />
              </button>
              <button className="relative text-gray-700 hover:text-lavender-700 transition-colors duration-300">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-lavender-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-700 hover:text-lavender-700 transition-colors duration-300"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-64 border-t border-gray-200' : 'max-h-0'
        }`}>
          <div className="px-4 py-4 space-y-3 bg-white">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2 text-sm font-medium transition-colors duration-300 ${
                  pathname === link.path
                    ? 'text-lavender-700'
                    : 'text-gray-700 hover:text-lavender-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        </nav>
        
    </>
  );
};

export default Navbar;
