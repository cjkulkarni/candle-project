'use client';

import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // API data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginationMeta, setPaginationMeta] = useState({
    page: 1,
    perPage: 12,
    total: 0,
    hasMore: false,
  });

  // Debounce price range changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
      setCurrentPage(1); // Reset to page 1 when price changes
    }, 500); // Wait 500ms after user stops sliding

    return () => clearTimeout(timer);
  }, [priceRange]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Build query string with all filters
        // Convert price from rupees to paise (multiply by 100) for WooCommerce API
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          sortBy: sortBy,
          minPrice: (debouncedPriceRange[0] * 100).toString(),
          maxPrice: (debouncedPriceRange[1] * 100).toString(),
        });

        if (selectedCategory !== 'All') {
          queryParams.append('category', selectedCategory);
        }

        const response = await fetch(`/api/products?${queryParams.toString()}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch products');
        }

        // Transform WooCommerce Store API format to our UI format
        const transformedProducts = data.data.map(product => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          category: product.categories?.[0]?.name || 'Uncategorized',
          // Convert price from minor units (paise) to major units (rupees)
          price_html: product?.price_html,
          currency_symbol: product.prices?.currency_symbol,
          price: parseFloat(product.prices?.price) / 100 || 0,
          originalPrice: product.prices?.regular_price ? parseFloat(product.prices.regular_price) / 100 : null,
          rating: parseFloat(product.average_rating) || 5,
          image: product.images?.[0]?.src || '/placeholder.jpg',
          images: product.images?.map(img => img.src) || [],
          description: product.description?.replace(/<[^>]*>/g, '') || product.short_description?.replace(/<[^>]*>/g, '') || '',
          featured: false, // Store API doesn't have featured flag
          sale: product.on_sale || false,
        }));

        setProducts(transformedProducts);
        setPaginationMeta(data.meta);

        // Extract unique categories from products (only on first load)
        if (categories.length === 1) {
          const uniqueCategories = [...new Set(transformedProducts.map(p => p.category).filter(c => c !== 'Uncategorized'))];
          setCategories(['All', ...uniqueCategories]);
        }

      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, selectedCategory, debouncedPriceRange, sortBy]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = () => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  };

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
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">Error loading products</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

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
                          value={selectedCategory}
                          onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            handleFilterChange();
                          }}
                          disabled={isLoading}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-lavender-700 transition-colors duration-300 disabled:bg-gray-100">
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
                            max="10000"
                            step="100"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                            disabled={isLoading}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lavender-700 disabled:opacity-50"
                          />
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>₹{priceRange[0]}</span>
                            <span>₹{priceRange[1]}</span>
                          </div>
                        </div>
                      </div>

                      {/* Sort By */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Sort By</h3>
                        <select
                          value={sortBy}
                          onChange={(e) => {
                            setSortBy(e.target.value);
                            handleFilterChange();
                          }}
                          disabled={isLoading}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-lavender-700 transition-colors duration-300 disabled:bg-gray-100"
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
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        handleFilterChange();
                      }}
                      disabled={isLoading}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-lavender-700 transition-colors duration-300 disabled:bg-gray-100">
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
                        max="10000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                        disabled={isLoading}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lavender-700 disabled:opacity-50"
                      />
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Sort By</h3>
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        handleFilterChange();
                      }}
                      disabled={isLoading}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-lavender-700 transition-colors duration-300 disabled:bg-gray-100"
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
                {isLoading ? (
                  <span>Loading products...</span>
                ) : (
                  <>
                    Showing <span className="font-semibold text-gray-900">{products.length}</span> of <span className="font-semibold text-gray-900">{paginationMeta.total}</span> products
                  </>
                )}
              </p>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 lg:hidden">
                <SlidersHorizontal className="w-5 h-5 text-lavender-700" />
                <span>Filters</span>
              </button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                    <div className="h-64 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && !error && products.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && !error && products.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={paginationMeta.totalPages}
                onPageChange={handlePageChange}
                hasMore={paginationMeta.hasMore}
              />
            )}

          </div>
        </div>
      </div>
    </div >
  );
}
