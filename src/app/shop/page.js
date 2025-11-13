'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { candleProducts } from '@/data/mockData';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobile, setIsMobile] = useState(false);

  const categories = ['All', ...new Set(candleProducts.map(p => p.category))];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024); // tailwind lg = 1024px
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredProducts = useMemo(() => {
    let products = [...candleProducts];

    // Filter by category
    if (selectedCategory !== 'All') {
      products = products.filter(p => p.category === selectedCategory);
    }

    // Filter by price
    products = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // featured - no sorting needed
        break;
    }

    return products;
  }, [selectedCategory, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-lavender-50 via-white to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-4">Our Collection</h1>
          <p className="text-lg text-gray-600">Discover our handcrafted luxury candles</p>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm sticky top-24">
              {/* extract the filters content so we can render it inside an accordion on mobile
                  and render expanded on desktop */}
              {isMobile ? (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <div className="flex items-center w-auto p-3">
                        <Filter className="w-5 h-5 ml-2 text-lavender-700" />
                        <h2 className="pl-2 text-lg font-semibold text-gray-900">Filters</h2>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-6" >
                      {/* Category Filter */}
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Category</h3>
                        <select
                          onChange={(e) => { setSelectedCategory(e.target.value); }}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-lavender-700 transition-colors duration-300">
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      {/* Price Range */}
                      <div className="mb-6 border-b pb-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Price Range</h3>
                        <div className="space-y-3">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lavender-700"
                          />
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}</span>
                          </div>
                        </div>
                      </div>

                      {/* Sort By */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Sort By</h3>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-lavender-700 transition-colors duration-300"
                        >
                          <option value="featured">Featured</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                          <option value="name">Name: A to Z</option>
                        </select>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <div className="p-6">
                  {/* Category Filter */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Category</h3>
                    <select
                      onChange={(e) => { setSelectedCategory(e.target.value); }}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-lavender-700 transition-colors duration-300">
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6 border-b pb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Price Range</h3>
                    <div className="space-y-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lavender-700"
                      />
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Sort By</h3>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-lavender-700 transition-colors duration-300"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
              </p>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 lg:hidden">
                <SlidersHorizontal className="w-5 h-5 text-lavender-700" />
                <span>Filters</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}
