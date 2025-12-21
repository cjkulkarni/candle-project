'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Phone, MapPin, User } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ProfileEditModal({ isOpen, onClose, onSave, user }) {
  const { updateProfile, isLoading } = useUser();
  const [copyBillingToShipping, setCopyBillingToShipping] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    billing: {
      first_name: '',
      last_name: '',
      company: '',
      address_1: '',
      address_2: '',
      city: '',
      postcode: '',
      country: '',
      state: '',
      email: '',
      phone: '',
    },
    shipping: {
      first_name: '',
      last_name: '',
      company: '',
      address_1: '',
      address_2: '',
      city: '',
      postcode: '',
      country: '',
      state: '',
      phone: '',
    },
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        billing: {
          first_name: user.billing?.first_name || user.firstName || '',
          last_name: user.billing?.last_name || user.lastName || '',
          company: user.billing?.company || '',
          address_1: user.billing?.address_1 || '',
          address_2: user.billing?.address_2 || '',
          city: user.billing?.city || '',
          postcode: user.billing?.postcode || '',
          country: user.billing?.country || '',
          state: user.billing?.state || '',
          email: user.billing?.email || user.email || '',
          phone: user.billing?.phone || user.phone || '',
        },
        shipping: {
          first_name: user.shipping?.first_name || user.firstName || '',
          last_name: user.shipping?.last_name || user.lastName || '',
          company: user.shipping?.company || '',
          address_1: user.shipping?.address_1 || '',
          address_2: user.shipping?.address_2 || '',
          city: user.shipping?.city || '',
          postcode: user.shipping?.postcode || '',
          country: user.shipping?.country || '',
          state: user.shipping?.state || '',
          phone: user.shipping?.phone || user.phone || '',
        },
      });
    }
  }, [user, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleAddressChange = (addressType, field, value) => {
    setFormData(prev => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Convert form data to API format (camelCase address fields to underscore)
      const apiFormData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        billing: {
          first_name: formData.billing.first_name,
          last_name: formData.billing.last_name,
          company: formData.billing.company,
          address_1: formData.billing.address_1,
          address_2: formData.billing.address_2,
          city: formData.billing.city,
          postcode: formData.billing.postcode,
          country: formData.billing.country,
          state: formData.billing.state,
          email: formData.billing.email,
          phone: formData.billing.phone,
        },
        shipping: {
          first_name: formData.shipping.first_name,
          last_name: formData.shipping.last_name,
          company: formData.shipping.company,
          address_1: formData.shipping.address_1,
          address_2: formData.shipping.address_2,
          city: formData.shipping.city,
          postcode: formData.shipping.postcode,
          country: formData.shipping.country,
          state: formData.shipping.state,
          phone: formData.shipping.phone,
        },
      };

      await updateProfile(apiFormData);
      onSave(formData);
      onClose();
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Update error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-lavender-600 to-lavender-700 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Personal Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-lavender-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 transition ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 transition ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>

              {/* Phone */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="pt-6 border-t">
            {/* Checkbox to copy billing to shipping */}
            <div className="mb-6 flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
              <input
                type="checkbox"
                id="copyBilling"
                checked={copyBillingToShipping}
                onChange={(e) => {
                  setCopyBillingToShipping(e.target.checked);
                  if (e.target.checked) {
                    setFormData(prev => ({
                      ...prev,
                      shipping: {
                        first_name: prev.billing.first_name,
                        last_name: prev.billing.last_name,
                        company: prev.billing.company,
                        address_1: prev.billing.address_1,
                        address_2: prev.billing.address_2,
                        city: prev.billing.city,
                        postcode: prev.billing.postcode,
                        country: prev.billing.country,
                        state: prev.billing.state,
                        phone: prev.billing.phone,
                      }
                    }));
                  }
                }}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
              />
              <label htmlFor="copyBilling" className="cursor-pointer text-sm font-medium text-gray-700">
                Use billing address as shipping address
              </label>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-lavender-600" />
              Billing Address
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.billing.first_name}
                    onChange={(e) => handleAddressChange('billing', 'first_name', e.target.value)}
                    placeholder="John"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.billing.last_name}
                    onChange={(e) => handleAddressChange('billing', 'last_name', e.target.value)}
                    placeholder="Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.billing.company}
                  onChange={(e) => handleAddressChange('billing', 'company', e.target.value)}
                  placeholder="Company Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Address Line 1</label>
                <input
                  type="text"
                  value={formData.billing.address_1}
                  onChange={(e) => handleAddressChange('billing', 'address_1', e.target.value)}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Address Line 2</label>
                <input
                  type="text"
                  value={formData.billing.address_2}
                  onChange={(e) => handleAddressChange('billing', 'address_2', e.target.value)}
                  placeholder="Apartment, Suite, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.billing.city}
                    onChange={(e) => handleAddressChange('billing', 'city', e.target.value)}
                    placeholder="New York"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Postal Code</label>
                  <input
                    type="text"
                    value={formData.billing.postcode}
                    onChange={(e) => handleAddressChange('billing', 'postcode', e.target.value)}
                    placeholder="10001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Country</label>
                  <input
                    type="text"
                    value={formData.billing.country}
                    onChange={(e) => handleAddressChange('billing', 'country', e.target.value)}
                    placeholder="United States"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">State</label>
                  <input
                    type="text"
                    value={formData.billing.state}
                    onChange={(e) => handleAddressChange('billing', 'state', e.target.value)}
                    placeholder="NY"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.billing.email}
                    onChange={(e) => handleAddressChange('billing', 'email', e.target.value)}
                    placeholder="billing@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.billing.phone}
                    onChange={(e) => handleAddressChange('billing', 'phone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address Section */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Shipping Address
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.shipping.first_name}
                    onChange={(e) => handleAddressChange('shipping', 'first_name', e.target.value)}
                    placeholder="John"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.shipping.last_name}
                    onChange={(e) => handleAddressChange('shipping', 'last_name', e.target.value)}
                    placeholder="Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.shipping.company}
                  onChange={(e) => handleAddressChange('shipping', 'company', e.target.value)}
                  placeholder="Company Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Address Line 1</label>
                <input
                  type="text"
                  value={formData.shipping.address_1}
                  onChange={(e) => handleAddressChange('shipping', 'address_1', e.target.value)}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Address Line 2</label>
                <input
                  type="text"
                  value={formData.shipping.address_2}
                  onChange={(e) => handleAddressChange('shipping', 'address_2', e.target.value)}
                  placeholder="Apartment, Suite, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.shipping.city}
                    onChange={(e) => handleAddressChange('shipping', 'city', e.target.value)}
                    placeholder="New York"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Postal Code</label>
                  <input
                    type="text"
                    value={formData.shipping.postcode}
                    onChange={(e) => handleAddressChange('shipping', 'postcode', e.target.value)}
                    placeholder="10001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Country</label>
                  <input
                    type="text"
                    value={formData.shipping.country}
                    onChange={(e) => handleAddressChange('shipping', 'country', e.target.value)}
                    placeholder="United States"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">State</label>
                  <input
                    type="text"
                    value={formData.shipping.state}
                    onChange={(e) => handleAddressChange('shipping', 'state', e.target.value)}
                    placeholder="NY"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.shipping.phone}
                  onChange={(e) => handleAddressChange('shipping', 'phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-lavender-600 hover:bg-lavender-700"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
