'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    toast.success('Message Sent!', {
      description: "Thank you for reaching out. We'll get back to you soon.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Visit Us',
      details: ['123 Luxury Lane', 'New York, NY 10001', 'United States']
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', 'Mon-Fri: 9am - 6pm EST']
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Us',
      details: ['hello@luxecandles.com', 'support@luxecandles.com']
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lavender-50 via-white to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-4">Get In Touch</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-lavender-500 to-orange-600 rounded-full flex items-center justify-center text-white mb-6">
                  {info.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600">{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-50 to-lavender-50/30 p-8 md:p-12 rounded-2xl shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Send Us a Message</h2>
              <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lavender-700 focus:border-transparent transition-all duration-300"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lavender-700 focus:border-transparent transition-all duration-300"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lavender-700 focus:border-transparent transition-all duration-300"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lavender-700 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-8 py-4 bg-lavender-700 text-white rounded-full font-semibold hover:bg-lavender-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
              >
                <span>Send Message</span>
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Interactive Map</p>
                <p className="text-sm text-gray-500">123 Luxury Lane, New York, NY 10001</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: 'What are your shipping times?',
                answer: 'We typically ship orders within 1-2 business days. Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days.'
              },
              {
                question: 'Do you offer international shipping?',
                answer: 'Yes! We ship to most countries worldwide. International shipping times vary by location, typically 7-14 business days.'
              },
              {
                question: 'What is your return policy?',
                answer: 'We offer a 30-day satisfaction guarantee. If you\'re not completely satisfied, you can return unused candles for a full refund.'
              },
              {
                question: 'Are your candles eco-friendly?',
                answer: 'Absolutely! We use 100% natural soy wax, cotton wicks, and premium essential oils. All our packaging is recyclable.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
