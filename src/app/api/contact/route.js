/**
 * API Route: POST /api/contact
 * Handles contact form submissions - sends data to WordPress for email notification
 */

import { verifyRecaptcha } from '@/lib/recaptcha';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL;

export async function POST(request) {
  try {
    const data = await request.json();

    // Verify reCAPTCHA token
    const recaptchaResult = await verifyRecaptcha(data.recaptchaToken, 'contact');
    if (!recaptchaResult.success && !recaptchaResult.skipped) {
      console.error('reCAPTCHA verification failed:', recaptchaResult.error);
      return Response.json({
        success: false,
        message: 'Security verification failed. Please try again.',
      }, { status: 400 });
    }

    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return Response.json({
        success: false,
        message: 'Missing required fields: name, email, subject, and message are required',
      }, { status: 400 });
    }

    const contactData = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      submittedAt: new Date().toISOString(),
    };

    // Log the contact request
    console.log('Contact Form Submission:', contactData);

    // Send to WordPress for email notification
    try {
      const wpResponse = await fetch(`${WORDPRESS_API_URL}/wp-json/luxe/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      const wpResult = await wpResponse.json();

      if (wpResponse.ok && wpResult.success) {
        return Response.json({
          success: true,
          message: 'Message sent successfully! We will get back to you soon.',
          data: contactData,
        }, { status: 200 });
      } else {
        // WordPress call failed, but still return success to user
        console.error('WordPress email notification failed:', wpResult);

        return Response.json({
          success: true,
          message: 'Message sent successfully! We will get back to you soon.',
          data: contactData,
        }, { status: 200 });
      }
    } catch (wpError) {
      // WordPress endpoint not available, still accept the message
      console.error('WordPress API error:', wpError.message);

      return Response.json({
        success: true,
        message: 'Message sent successfully! We will get back to you soon.',
        data: contactData,
      }, { status: 200 });
    }

  } catch (error) {
    console.error('Error processing contact form:', error);
    return Response.json({
      success: false,
      message: 'Failed to send your message. Please try again.',
      error: error.message,
    }, { status: 500 });
  }
}
