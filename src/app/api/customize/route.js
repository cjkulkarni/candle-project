/**
 * API Route: POST /api/customize
 * Handles custom candle requests - sends data to WordPress for email notification
 */

import { verifyRecaptcha } from '@/lib/recaptcha';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL;

export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extract reCAPTCHA token
    const recaptchaToken = formData.get('recaptchaToken');

    // Verify reCAPTCHA token
    const recaptchaResult = await verifyRecaptcha(recaptchaToken, 'customize');
    if (!recaptchaResult.success && !recaptchaResult.skipped) {
      console.error('reCAPTCHA verification failed:', recaptchaResult.error);
      return Response.json({
        success: false,
        message: 'Security verification failed. Please try again.',
      }, { status: 400 });
    }

    // Extract form fields
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || 'Not provided',
      candleType: formData.get('candleType'),
      scent: formData.get('scent') || 'Not specified',
      color: formData.get('color') || 'Not specified',
      size: formData.get('size') || 'Not specified',
      quantity: formData.get('quantity') || '1',
      message: formData.get('message') || 'None',
      additionalNotes: formData.get('additionalNotes') || 'None',
      submittedAt: new Date().toISOString(),
    };

    // Collect uploaded images info (if any)
    const images = [];
    for (let i = 0; i < 5; i++) {
      const image = formData.get(`image_${i}`);
      if (image && image.size > 0) {
        images.push({
          name: image.name,
          size: image.size,
          type: image.type,
        });
      }
    }

    // Add images info to data
    data.imagesCount = images.length;
    data.imageNames = images.map(img => img.name).join(', ') || 'None';

    // Log the request
    console.log('Custom Candle Request:', {
      ...data,
      imagesCount: images.length,
    });

    // Send to WordPress for email notification
    try {
      const wpResponse = await fetch(`${WORDPRESS_API_URL}/wp-json/luxe/v1/customize-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const wpResult = await wpResponse.json();

      if (wpResponse.ok && wpResult.success) {
        return Response.json({
          success: true,
          message: 'Custom candle request submitted successfully! We will contact you soon.',
          data: {
            requestId: wpResult.requestId || `CUS-${Date.now()}`,
            ...data,
          },
        }, { status: 200 });
      } else {
        // WordPress call failed, but still return success to user
        // Log the error for debugging
        console.error('WordPress email notification failed:', wpResult);

        return Response.json({
          success: true,
          message: 'Custom candle request submitted successfully! We will contact you soon.',
          data: {
            requestId: `CUS-${Date.now()}`,
            ...data,
          },
        }, { status: 200 });
      }
    } catch (wpError) {
      // WordPress endpoint not available, still accept the request
      console.error('WordPress API error:', wpError.message);

      return Response.json({
        success: true,
        message: 'Custom candle request submitted successfully! We will contact you soon.',
        data: {
          requestId: `CUS-${Date.now()}`,
          ...data,
        },
      }, { status: 200 });
    }

  } catch (error) {
    console.error('Error processing customize request:', error);
    return Response.json({
      success: false,
      message: 'Failed to process your request. Please try again.',
      error: error.message,
    }, { status: 500 });
  }
}
