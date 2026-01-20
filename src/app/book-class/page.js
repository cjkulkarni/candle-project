'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MapPin, CheckCircle, GraduationCap, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function BookClass() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    classType: '',
    preferredDate: '',
    preferredTime: '',
    participants: '1',
    experience: 'beginner',
    specialRequirements: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const classTypes = [
    {
      id: 'beginner',
      name: 'Beginner Workshop',
      duration: '2 hours',
      price: '₹1,500',
      description: 'Learn the basics of candle making with hands-on guidance.',
    },
    {
      id: 'intermediate',
      name: 'Intermediate Class',
      duration: '3 hours',
      price: '₹2,500',
      description: 'Advanced techniques including layering and scent blending.',
    },
    {
      id: 'advanced',
      name: 'Advanced Masterclass',
      duration: '4 hours',
      price: '₹4,000',
      description: 'Professional techniques for creating artisan candles.',
    },
    {
      id: 'private',
      name: 'Private Session',
      duration: 'Flexible',
      price: '₹6,000',
      description: 'One-on-one personalized candle making experience.',
    },
  ];

  const timeSlots = [
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
    '6:00 PM - 8:00 PM',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.classType || !formData.preferredDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get reCAPTCHA token
      let recaptchaToken = null;
      if (executeRecaptcha) {
        try {
          recaptchaToken = await executeRecaptcha('book_class');
        } catch (recaptchaError) {
          console.error('reCAPTCHA error:', recaptchaError);
        }
      }

      const response = await fetch('/api/book-class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        toast.success('Your class booking has been submitted!');
      } else {
        throw new Error(result.message || 'Failed to submit booking');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedClass = classTypes.find(c => c.id === formData.classType);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-orange-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for booking a candle-making class with us! We&apos;ve sent a confirmation email to <strong>{formData.email}</strong>. Our team will contact you shortly to confirm the date and time.
          </p>
          <div className="bg-lavender-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Booking Details:</h3>
            <p className="text-sm text-gray-600">Class: {selectedClass?.name}</p>
            <p className="text-sm text-gray-600">Date: {formData.preferredDate}</p>
            <p className="text-sm text-gray-600">Time: {formData.preferredTime || 'To be confirmed'}</p>
            <p className="text-sm text-gray-600">Participants: {formData.participants}</p>
          </div>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-lavender-700 text-white rounded-full hover:bg-lavender-800 transition-colors"
          >
            Back to Home
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lavender-50 via-white to-orange-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-4">
                Book Your <span className="text-lavender-700">Candle Making</span> Class
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Join our hands-on workshops and learn the art of candle making. Create your own beautiful, fragrant candles to take home.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-gray-600">
                  <GraduationCap className="w-5 h-5 mr-2 text-lavender-700" />
                  <span>Expert Instructors</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Sparkles className="w-5 h-5 mr-2 text-lavender-700" />
                  <span>All Materials Included</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-2 text-lavender-700" />
                  <span>Small Group Sizes</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <Image
                src="https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600"
                alt="Candle Making Class"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Class Types */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 text-center mb-10">
            Choose Your Class
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {classTypes.map((classItem, index) => (
              <motion.div
                key={classItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => setFormData(prev => ({ ...prev, classType: classItem.id }))}
                className={`cursor-pointer rounded-xl p-6 border-2 transition-all duration-300 ${
                  formData.classType === classItem.id
                    ? 'border-lavender-700 bg-lavender-50 shadow-lg'
                    : 'border-gray-200 hover:border-lavender-300 hover:shadow-md'
                }`}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{classItem.name}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <Clock className="w-4 h-4 mr-1" />
                  {classItem.duration}
                </div>
                <p className="text-2xl font-bold text-lavender-700 mb-3">{classItem.price}</p>
                <p className="text-sm text-gray-600">{classItem.description}</p>
                {formData.classType === classItem.id && (
                  <div className="mt-4 flex items-center text-lavender-700">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Selected</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-10"
          >
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8 text-center">
              Complete Your Booking
            </h2>

            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-lavender-700" />
                Your Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lavender-500 focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lavender-500 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lavender-500 focus:border-transparent transition-all"
                    placeholder="+91 12345 67890"
                  />
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-lavender-700" />
                Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lavender-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time Slot
                  </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lavender-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select time slot</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Participants
                  </label>
                  <select
                    name="participants"
                    value={formData.participants}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lavender-500 focus:border-transparent transition-all"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lavender-500 focus:border-transparent transition-all"
                  >
                    <option value="beginner">Beginner - First time</option>
                    <option value="some">Some experience</option>
                    <option value="experienced">Experienced crafter</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Special Requirements */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requirements or Questions
              </label>
              <textarea
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lavender-500 focus:border-transparent transition-all resize-none"
                placeholder="Any dietary restrictions, accessibility needs, or questions..."
              />
            </div>

            {/* Selected Class Summary */}
            {selectedClass && (
              <div className="mb-8 bg-lavender-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Selected Class:</h4>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lavender-700 font-medium">{selectedClass.name}</p>
                    <p className="text-sm text-gray-600">{selectedClass.duration}</p>
                  </div>
                  <p className="text-2xl font-bold text-lavender-700">{selectedClass.price}</p>
                </div>
                {parseInt(formData.participants) > 1 && (
                  <p className="text-sm text-gray-500 mt-2">
                    * Price shown is per person. Total for {formData.participants} participants will be calculated.
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting || !formData.classType}
                className="inline-flex items-center px-8 py-4 bg-lavender-700 text-white rounded-full font-semibold hover:bg-lavender-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Booking...
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Now
                  </>
                )}
              </button>
              <p className="text-sm text-gray-500 mt-4">
                By booking, you agree to our terms and cancellation policy.
              </p>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-lavender-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-lavender-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">Our studio in the heart of the city. Address will be shared upon booking confirmation.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-lavender-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-lavender-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What&apos;s Included</h3>
              <p className="text-gray-600">All materials, tools, and 2 candles to take home. Refreshments provided.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-lavender-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-lavender-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Group Bookings</h3>
              <p className="text-gray-600">Special rates for groups of 6+. Perfect for team building or celebrations.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
