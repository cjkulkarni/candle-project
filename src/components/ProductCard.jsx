'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { fadeUp } from '@/utils/motionVariants';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  console.log(product);
  return (

    <motion.div
      variants={fadeUp}
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-square">
        <Image

          src={product.image}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay with Actions */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
          <div className="absolute inset-0 flex items-center justify-center space-x-3">
            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-lavender-600 hover:text-white">
              <ShoppingCart className="w-5 h-5" />
            </button>

            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75 hover:bg-lavender-600 hover:text-white">
              <Link
                href={`/product/${product.slug}`}
                className="block"
              >
                <Eye className="w-5 h-5" />
              </Link>
            </button>
          </div>
        </div>

        {/* Badges */}
        {product.sale && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Sale!
          </div>
        )}
        <div className="absolute top-3 right-3 bg-lavender-700 text-white text-xs font-medium px-3 py-1 rounded-full">
          {product.category}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">{product.category}</p>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-lavender-700 transition-colors duration-300">
          <Link
            href={`/product/${product.slug}`}
            className="block"
          >  {product.name} </Link>
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < product.rating ? 'text-lavender-500 fill-lavender-500' : 'text-gray-300'
                }`}
            />
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          {product.originalPrice && (
            <span className="text-gray-400 line-through text-sm">
              ${product.originalPrice}
            </span>
          )}
          <span className="text-xl font-bold text-lavender-700">${product.price}</span>
        </div>
      </div>
    </motion.div>

  );
};

export default ProductCard;
