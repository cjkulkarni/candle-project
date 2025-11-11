'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Heart, Award, Leaf } from 'lucide-react';
import { motion } from "framer-motion";
import { container, textContainer, itemLeft, itemRight, cardVariant, containerVariant, textBounce } from '@/utils/motionVariants';

export default function About() {
  const values = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Handcrafted Excellence',
      description: 'Each candle is meticulously handcrafted with attention to every detail, ensuring unparalleled quality.'
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: 'Natural Ingredients',
      description: 'We use only premium soy wax and natural essential oils, creating eco-friendly luxury candles.'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Made with Love',
      description: 'Every candle carries the passion and dedication of our artisans, bringing warmth to your home.'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Award Winning',
      description: 'Recognized globally for our exceptional quality and innovative fragrance compositions.'
    }
  ];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1643122966676-29e8597257f7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxzY2VudGVkJTIwY2FuZGxlc3xlbnwwfHx8fDE3NjIzNDgyNDR8MA&ixlib=rb-4.1.0&q=85')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.div
            variants={textContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h1 variants={textBounce} className="text-5xl md:text-7xl font-serif font-bold mb-6">Our Story</motion.h1>
            <motion.p variants={textBounce} className="text-xl md:text-2xl font-light">Illuminating lives with handcrafted luxury since 2010</motion.p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={itemRight} className="text-center mb-12">
              <p className="text-sm uppercase tracking-widest text-lavender-700 mb-4 font-light">About Luxe Candles</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">A Journey of Light</h2>
            </motion.div>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={itemLeft} className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6">
              <p>
                Luxe Candles began with a simple vision: to create candles that transcend mere illumination and become
                an integral part of life's most precious moments. Founded in 2010, our journey started in a small studio
                where passion for craftsmanship met the art of aromatherapy.
              </p>
              <p>
                What sets us apart is our unwavering commitment to quality and sustainability. We source only the finest
                natural ingredients, from premium soy wax to hand-selected essential oils. Each fragrance is carefully
                composed to evoke emotions, create atmospheres, and transform spaces into sanctuaries.
              </p>
              <p>
                Today, Luxe Candles has grown into a beloved brand recognized for excellence. Yet, we remain true to our
                roots – every candle is still handcrafted with the same care and attention that defined our first creation.
                We believe in the power of light to bring warmth, comfort, and joy to every home.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 bg-gradient-to-br from-lavender-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              variants={textContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.h2 variants={textBounce} className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Our Values</motion.h2>
              <motion.p variants={textBounce} className="text-lg text-gray-600">The principles that guide everything we do</motion.p>
            </motion.div>
          </div>
          <motion.div
            variants={containerVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div

                variants={cardVariant}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-lavender-500 to-orange-600 rounded-full flex items-center justify-center text-white mb-6 transform transition-transform duration-300 hover:scale-110">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


          <motion.div
            variants={textContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-12"
          >
            <motion.h2 variants={textBounce} className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Craftsmanship</motion.h2>
            <motion.p variants={textBounce} className="text-lg text-gray-600">A glimpse into our creative process</motion.p>
          </motion.div>
          <motion.div
            variants={containerVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              key="image1"
              variants={cardVariant}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1707839568431-c2648f6d5184?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBjYW5kbGVzfGVufDB8fHx8MTc2MjM0ODIzOXww&ixlib=rb-4.1.0&q=85"
                alt="Craftsmanship"
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
            <motion.div
              key="image2"
              variants={cardVariant}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1580445206726-c6eace8e02e3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwyfHxzY2VudGVkJTIwY2FuZGxlc3xlbnwwfHx8fDE3NjIzNDgyNDR8MA&ixlib=rb-4.1.0&q=85"
                alt="Quality"
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
            <motion.div
              key="image3"
              variants={cardVariant}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwzfHxzY2VudGVkJTIwY2FuZGxlc3xlbnwwfHx8fDE3NjIzNDgyNDR8MA&ixlib=rb-4.1.0&q=85"
                alt="Details"
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-lavender-700 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Join Our Journey
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Experience the difference of handcrafted luxury candles
          </p>
          <a
            href="/shop"
            className="inline-block px-8 py-4 bg-white text-lavender-700 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Explore Our Collection
          </a>
        </div>
      </section>
    </div>
  );
}
