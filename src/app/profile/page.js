'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar, Edit2, LogOut, Shield, Download, Heart, Clock } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileEditModal from '@/components/ProfileEditModal';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-8">Please sign in to view your profile</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push('/auth/login')}>
              Sign In
            </Button>
            <Button variant="outline" onClick={() => router.push('/auth/register')}>
              Create Account
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleEditSave = (updatedData) => {
    setIsEditModalOpen(false);
    toast.success('Profile updated successfully!');
  };

  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  }) : 'Recent';

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-lavender-200 shadow-lg">
                  <Image
                    src={user?.avatar1 || 'https://ui-avatars.com/api/?name=User&background=random'}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4" />
                  <span>Member since {memberSince}</span>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-2 bg-lavender-600 text-white px-4 py-2 rounded-lg hover:bg-lavender-700 transition"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center gap-2 border-2 border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <Tabs defaultValue="information" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-0 rounded-none border-b">
              <TabsTrigger value="information" className="rounded-none border-b-2 border-transparent data-[state=active]:border-lavender-600">
                Information
              </TabsTrigger>
              <TabsTrigger value="address" className="rounded-none border-b-2 border-transparent data-[state=active]:border-lavender-600">
                Address
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-none border-b-2 border-transparent data-[state=active]:border-lavender-600">
                Orders
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-none border-b-2 border-transparent data-[state=active]:border-lavender-600">
                Security
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="information" className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">First Name</label>
                  <p className="text-lg text-gray-900">{user?.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Last Name</label>
                  <p className="text-lg text-gray-900">{user?.lastName}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </label>
                  <p className="text-lg text-gray-900">{user?.email}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </label>
                  <p className="text-lg text-gray-900">{user?.phone || 'Not provided'}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditModalOpen(true)}
                className="mt-6 flex items-center gap-2 bg-lavender-600 text-white px-4 py-2 rounded-lg hover:bg-lavender-700 transition"
              >
                <Edit2 className="h-4 w-4" />
                Edit Information
              </motion.button>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address" className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Address</label>
                  <p className="text-lg text-gray-900">{user?.address || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">City</label>
                  <p className="text-lg text-gray-900">{user?.city || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Postal Code</label>
                  <p className="text-lg text-gray-900">{user?.zipCode || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Country</label>
                  <p className="text-lg text-gray-900">{user?.country || 'Not provided'}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditModalOpen(true)}
                className="mt-6 flex items-center gap-2 bg-lavender-600 text-white px-4 py-2 rounded-lg hover:bg-lavender-700 transition"
              >
                <Edit2 className="h-4 w-4" />
                Edit Address
              </motion.button>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h2>
              <div className="space-y-4">
                <Card className="p-6 border-2 border-dashed border-gray-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-lavender-100 p-4 rounded-lg">
                        <Download className="h-6 w-6 text-lavender-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">No orders yet</p>
                        <p className="text-sm text-gray-600">Start shopping and your orders will appear here</p>
                      </div>
                    </div>
                    <Button onClick={() => router.push('/shop')}>
                      Browse Products
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
              <div className="space-y-6">
                <Card className="p-6 border-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg mt-1">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Change Password</h3>
                        <p className="text-sm text-gray-600">Update your password regularly to keep your account secure</p>
                      </div>
                    </div>
                    <Button variant="outline">Change</Button>
                  </div>
                </Card>

                <Card className="p-6 border-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 p-3 rounded-lg mt-1">
                        <Heart className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                </Card>

                <Card className="p-6 border-2 border-red-200 bg-red-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-red-100 p-3 rounded-lg mt-1">
                        <LogOut className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Delete Account</h3>
                        <p className="text-sm text-gray-600">Permanently delete your account and all associated data</p>
                      </div>
                    </div>
                    <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-100">
                      Delete
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSave}
        user={user}
      />
    </div>
  );
}
