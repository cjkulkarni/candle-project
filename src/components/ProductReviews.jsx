'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

export default function ProductReviews({ productSlug, onReviewSubmitted }) {
  const { user, isAuthenticated } = useUser();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    fetchReviews();

    // Pre-fill user info if authenticated
    if (isAuthenticated && user) {
      setReviewerName(user.username || user.email?.split('@')[0] || '');
      setReviewerEmail(user.email || '');
    }
  }, [productSlug, isAuthenticated, user]);

  // Check if user has already reviewed this product
  useEffect(() => {
    if (isAuthenticated && user && reviews.length > 0) {
      const existingReview = reviews.find(
        review => review.reviewer_email.toLowerCase() === user.email?.toLowerCase()
      );
      if (existingReview) {
        setUserReview(existingReview);
        setRating(existingReview.rating);
        setReviewText(existingReview.review);
      }
    }
  }, [reviews, isAuthenticated, user]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products/${productSlug}/reviews`);

      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        console.error('Failed to fetch reviews');
        toast.error('Failed to load reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Error loading reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }

    if (!reviewerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!reviewerEmail.trim()) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/products/${productSlug}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          review: reviewText,
          reviewer: reviewerName,
          reviewer_email: reviewerEmail,
        }),
      });

      if (response.ok) {
        toast.success('Review submitted successfully!');
        setRating(0);
        setReviewText('');

        // Only reset name/email if user is not authenticated
        if (!isAuthenticated) {
          setReviewerName('');
          setReviewerEmail('');
        }

        // Refresh reviews list
        fetchReviews();

        // Notify parent component to refresh product data
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (count, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${interactive ? 'cursor-pointer transition-colors' : ''} ${
              (interactive ? (hoverRating || rating) : count) >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          />
        ))}
      </div>
    );
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">Loading reviews...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div>
            <div className="text-4xl font-bold">{calculateAverageRating()}</div>
            <div className="text-sm text-gray-500">out of 5</div>
          </div>
          <div>
            {renderStars(Math.round(calculateAverageRating()))}
            <div className="text-sm text-gray-500 mt-1">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </div>
          </div>
        </div>

        {/* Submit Review Form */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">
            {userReview && !isEditing ? 'Your Review' : 'Write a Review'}
          </h3>

          {!isAuthenticated ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-4">
                You must be logged in to submit a review.
              </p>
              <Button
                onClick={() => window.location.href = '/auth/login'}
                variant="default"
              >
                Login to Review
              </Button>
            </div>
          ) : userReview && !isEditing ? (
            // Show existing review with edit button
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {renderStars(userReview.rating)}
                    <span className="text-sm text-gray-600">
                      Your rating: {userReview.rating} out of 5
                    </span>
                  </div>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                  >
                    Edit Review
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-gray-700 whitespace-pre-line">{userReview.review}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Submitted on {new Date(userReview.date_created).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            // Show review form for new or editing
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Rating</label>
                {renderStars(rating, true)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={reviewerEmail}
                    onChange={(e) => setReviewerEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={userReview !== null}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                  {isSubmitting
                    ? (userReview ? 'Updating...' : 'Submitting...')
                    : (userReview ? 'Update Review' : 'Submit Review')}
                </Button>
                {userReview && isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setRating(userReview.rating);
                      setReviewText(userReview.review);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            No reviews yet. Be the first to review this product!
          </Card>
        ) : (
          reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{review.reviewer}</span>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                          <CheckCircle className="h-3 w-3" />
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(review.date_created)}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-line">{review.review}</p>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
