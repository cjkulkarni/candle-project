/**
 * API Route: POST /api/book-class
 * Handles candle-making class bookings - sends data to WordPress for email notification
 */

import { verifyRecaptcha } from '@/lib/recaptcha';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL;

export async function POST(request) {
  try {
    const data = await request.json();

    // Verify reCAPTCHA token
    const recaptchaResult = await verifyRecaptcha(data.recaptchaToken, 'book_class');
    if (!recaptchaResult.success && !recaptchaResult.skipped) {
      console.error('reCAPTCHA verification failed:', recaptchaResult.error);
      return Response.json({
        success: false,
        message: 'Security verification failed. Please try again.',
      }, { status: 400 });
    }

    // Validate required fields
    if (!data.name || !data.email || !data.classType || !data.preferredDate) {
      return Response.json({
        success: false,
        message: 'Missing required fields: name, email, classType, and preferredDate are required',
      }, { status: 400 });
    }

    // Class pricing
    const classPricing = {
      beginner: 1500,
      intermediate: 2500,
      advanced: 4000,
      private: 6000,
    };

    const classNames = {
      beginner: 'Beginner Workshop',
      intermediate: 'Intermediate Class',
      advanced: 'Advanced Masterclass',
      private: 'Private Session',
    };

    const bookingData = {
      bookingId: `BK-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || 'Not provided',
      classType: classNames[data.classType] || data.classType,
      classPrice: classPricing[data.classType] || 0,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime || 'To be confirmed',
      participants: parseInt(data.participants) || 1,
      experience: data.experience || 'beginner',
      specialRequests: data.specialRequirements || 'None',
      totalPrice: (classPricing[data.classType] || 0) * (parseInt(data.participants) || 1),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    // Log the booking
    console.log('Class Booking Request:', bookingData);

    // Send to WordPress for email notification
    try {
      const wpResponse = await fetch(`${WORDPRESS_API_URL}/wp-json/luxe/v1/book-class`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const wpResult = await wpResponse.json();

      if (wpResponse.ok && wpResult.success) {
        return Response.json({
          success: true,
          message: 'Class booking submitted successfully! We will contact you to confirm your slot.',
          data: {
            ...bookingData,
            bookingId: wpResult.bookingId || bookingData.bookingId,
          },
        }, { status: 200 });
      } else {
        // WordPress call failed, but still return success to user
        console.error('WordPress email notification failed:', wpResult);

        return Response.json({
          success: true,
          message: 'Class booking submitted successfully! We will contact you to confirm your slot.',
          data: bookingData,
        }, { status: 200 });
      }
    } catch (wpError) {
      // WordPress endpoint not available, still accept the booking
      console.error('WordPress API error:', wpError.message);

      return Response.json({
        success: true,
        message: 'Class booking submitted successfully! We will contact you to confirm your slot.',
        data: bookingData,
      }, { status: 200 });
    }

  } catch (error) {
    console.error('Error processing class booking:', error);
    return Response.json({
      success: false,
      message: 'Failed to process your booking. Please try again.',
      error: error.message,
    }, { status: 500 });
  }
}
