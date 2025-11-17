'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Award, TrendingUp } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useUser();
  const { items } = useCart();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-8">Please sign in to access your dashboard</p>
          <Button onClick={() => router.push('/auth/login')}>
            Sign In
          </Button>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const stats = [
    {
      title: 'Total Orders',
      value: '0',
      icon: ShoppingBag,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Wishlist Items',
      value: '0',
      icon: Heart,
      color: 'from-red-500 to-red-600',
    },
    {
      title: 'VIP Rewards',
      value: '0',
      icon: Award,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'Saved for Later',
      value: items.length.toString(),
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening with your account</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
              >
                <Card className="p-6 hover:shadow-lg transition duration-300">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/shop">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-lavender-600 text-white py-3 rounded-lg font-medium hover:bg-lavender-700 transition"
                  >
                    Continue Shopping
                  </motion.button>
                </Link>
                <Link href="/profile">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full border-2 border-lavender-600 text-lavender-600 py-3 rounded-lg font-medium hover:bg-lavender-50 transition"
                  >
                    View Orders
                  </motion.button>
                </Link>
                <Link href="/profile">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    Edit Profile
                  </motion.button>
                </Link>
                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    Learn More
                  </motion.button>
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* Loyalty Program */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <Card className="p-8 bg-gradient-to-br from-lavender-600 to-lavender-700 text-white">
              <h3 className="text-xl font-bold mb-4">VIP Rewards</h3>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Loyalty Points</span>
                  <span className="text-2xl font-bold">0/1000</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
              <p className="text-sm text-white/80 mb-4">
                Earn points with every purchase and unlock exclusive benefits!
              </p>
              <Button className="w-full bg-white text-lavender-600 hover:bg-gray-100">
                View Benefits
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Featured Products Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7 }}
          className="mt-12"
        >
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ y: -4 }}
                  className="group cursor-pointer"
                >
                  <div className="bg-gray-200 aspect-square rounded-lg mb-4 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Premium Candle</h3>
                  <p className="text-gray-600 text-sm mb-3">$45.00</p>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
