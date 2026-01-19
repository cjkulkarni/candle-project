/**
 * API Route: POST /api/book-class
 * Handles candle-making class bookings - stores data and sends email notification
 */

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.classType || !data.preferredDate) {
      return Response.json({
        success: false,
        message: 'Missing required fields: name, email, classType, and preferredDate are required',
      }, { status: 400 });
    }

    // Class pricing (in production, fetch from database)
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
      classType: data.classType,
      className: classNames[data.classType] || data.classType,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime || 'To be confirmed',
      participants: parseInt(data.participants) || 1,
      experience: data.experience || 'beginner',
      specialRequirements: data.specialRequirements || 'None',
      pricePerPerson: classPricing[data.classType] || 0,
      totalPrice: (classPricing[data.classType] || 0) * (parseInt(data.participants) || 1),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    // Log the booking (in production, save to database and send email)
    console.log('Class Booking Request:', bookingData);

    // Here you would typically:
    // 1. Save booking to database
    // 2. Send confirmation email to customer
    // 3. Send notification email to admin
    // 4. Integrate with calendar system

    /*
    // Example email integration with WordPress:
    const emailResponse = await fetch(`${process.env.WORDPRESS_API_URL}/wp-json/custom/v1/send-class-booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    */

    return Response.json({
      success: true,
      message: 'Class booking submitted successfully',
      data: bookingData,
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing class booking:', error);
    return Response.json({
      success: false,
      message: 'Failed to process your booking. Please try again.',
      error: error.message,
    }, { status: 500 });
  }
}
