'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { candleProducts, categories } from '@/data/mockData';
import { motion } from "framer-motion";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const featuredProducts = candleProducts.filter(p => p.featured);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parent controls timing for children
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // delay between children
    },
  },
};

// Each child’s entrance animation
const itemLeft = {
  hidden: { opacity: 0, x: -100 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const itemRight = {
  hidden: { opacity: 0, x: 100 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};
  const containerVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
  };
  
   const textContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

 const textBounce = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 10,
      duration: 0.6,
    },
  },
};

 const textSlideLeft = {
  hidden: { opacity: 0, x: -50 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

 const textSlideRight = {
  hidden: { opacity: 0, x: 50 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};


  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-lavender-50 via-white to-orange-50">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 "
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/34568583/pexels-photo-34568583.jpeg')`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
           
            }}
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div variants={itemRight}>
            <p className="text-sm uppercase tracking-widest text-lavender-700 mb-4 font-light flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Our Premium Collection</span>
              <Sparkles className="w-4 h-4" />
            </p>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              The New
              <span className="block text-lavender-700 mt-2">Ambiance</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Handcrafted luxury candles that illuminate your space with warmth, elegance, and unforgettable fragrances.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/shop"
                className="group inline-flex items-center px-8 py-4 bg-lavender-700 text-white rounded-full hover:bg-lavender-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-4 bg-white text-lavender-700 rounded-full border-2 border-lavender-700 hover:bg-lavender-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Discover More
              </Link>
              </div>
              </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-lavender-700 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-lavender-700 rounded-full animate-scroll" />
          </div>
        </div> */}
      </section>

      {/* Featured Section 1 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-lg"
      >
        <motion.div variants={itemLeft} >
              <Image
                src="https://images.unsplash.com/photo-1707839568483-9f1924d5f5de?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYW5kbGVzfGVufDB8fHx8MTc2MjM0ODIzOXww&ixlib=rb-4.1.0&q=85"
                alt="Original Candles"
                width={800}
                height={500}
                className="w-full h-[500px] object-cover rounded-2xl shadow-2xl animate-fade-in-left"
              />
            </motion.div>
             </motion.div>
            <div className="order-1 lg:order-2 space-y-6">
                        <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-lg"
      >
        <motion.div variants={itemRight} >
              <p className="text-sm uppercase tracking-widest text-lavender-700 font-light">Our Original Collection</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                The New <span className="text-lavender-700">Fragrance</span>
              </h2>
              <p className="text-gray-600 leading-relaxed fade-in-10">
                Experience the perfect blend of artistry and aromatherapy. Each candle is carefully crafted with premium
                soy wax and infused with captivating fragrances that transform any space into a haven of tranquility.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center text-lavender-700 font-semibold hover:text-lavender-800 group"
              >
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
                </motion.div>
                </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section 2 */}
      <section className="py-20 bg-gradient-to-br from-lavender-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                        <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-lg"
      >
        <motion.div variants={itemLeft} >
              <p className="text-sm uppercase tracking-widest text-lavender-700 font-light">Wellness Collection</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                Instinctive and <span className="text-lavender-700">Calming</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Discover our wellness collection designed to soothe your senses and create a peaceful atmosphere.
                Natural ingredients meet sophisticated design for the ultimate relaxation experience.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center text-lavender-700 font-semibold hover:text-lavender-800 group"
              >
                Discover
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
                </motion.div>
                </motion.div>
            </div>
                       <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-lg"
      >
        <motion.div variants={itemRight} >
              <Image
                src="https://images.unsplash.com/photo-1599313804818-2eaba0b14cba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHw0fHxzY2VudGVkJTIwY2FuZGxlc3xlbnwwfHx8fDE3NjIzNDgyNDR8MA&ixlib=rb-4.1.0&q=85"
                alt="Wellness Candles"
                width={800}
                height={500}
                className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
              />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-lavender-700 mb-2 font-light">Check out our</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Best Sellers</h2>
          </div>
           <motion.div
      variants={containerVariant}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
    >
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 bg-gradient-to-r from-lavender-700 to-orange-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="1" fill-rule="evenodd"/%3E%3C/svg%3E')`
          }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
           <motion.div
        variants={textContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
          <motion.h3  variants={textBounce} className="text-3xl md:text-4xl font-serif font-bold mb-6">
            The new fragrance that will surprise you every day
          </motion.h3>
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-4 bg-white text-lavender-700 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Discover
            <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            </motion.div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-lavender-700 mb-2 font-light">New Candles</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href="/shop"
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-serif font-bold mb-2">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.count} Products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
