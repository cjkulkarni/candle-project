/**
 * Server-side reCAPTCHA verification utility
 */

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

/**
 * Verify reCAPTCHA token on the server side
 * @param {string} token - The reCAPTCHA token from the client
 * @param {string} action - Expected action name (optional)
 * @param {number} minScore - Minimum score threshold (0.0 - 1.0, default 0.5)
 * @returns {Promise<{success: boolean, score?: number, error?: string}>}
 */
export async function verifyRecaptcha(token, action = null, minScore = 0.5) {
  // If no secret key is configured, skip verification
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn('reCAPTCHA secret key not configured. Skipping verification.');
    return { success: true, score: 1.0, skipped: true };
  }

  if (!token) {
    return { success: false, error: 'No reCAPTCHA token provided' };
  }

  try {
    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: 'reCAPTCHA verification failed',
        errorCodes: data['error-codes'],
      };
    }

    // Check action if specified
    if (action && data.action !== action) {
      return {
        success: false,
        error: `Invalid reCAPTCHA action. Expected: ${action}, Got: ${data.action}`,
      };
    }

    // Check score threshold
    if (data.score < minScore) {
      return {
        success: false,
        error: 'reCAPTCHA score too low. Possible bot detected.',
        score: data.score,
      };
    }

    return {
      success: true,
      score: data.score,
      action: data.action,
      hostname: data.hostname,
    };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return {
      success: false,
      error: 'Failed to verify reCAPTCHA: ' + error.message,
    };
  }
}
