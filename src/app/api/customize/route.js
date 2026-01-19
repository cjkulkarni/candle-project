/**
 * API Route: POST /api/customize
 * Handles custom candle requests - stores data and sends email notification
 */

export async function POST(request) {
  try {
    const formData = await request.formData();

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

    // Collect uploaded images (if any)
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

    // Log the request (in production, you would save to database and send email)
    console.log('Custom Candle Request:', {
      ...data,
      imagesCount: images.length,
      images: images.map(img => img.name),
    });

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification to admin
    // 3. Send confirmation email to customer

    // For now, we'll simulate a successful submission
    // In production, integrate with your email service (SendGrid, Nodemailer, etc.)

    /*
    // Example email integration with WordPress/WooCommerce:
    const emailResponse = await fetch(`${process.env.WORDPRESS_API_URL}/wp-json/custom/v1/send-customize-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    */

    return Response.json({
      success: true,
      message: 'Custom candle request submitted successfully',
      data: {
        requestId: `CUS-${Date.now()}`,
        ...data,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing customize request:', error);
    return Response.json({
      success: false,
      message: 'Failed to process your request. Please try again.',
      error: error.message,
    }, { status: 500 });
  }
}
