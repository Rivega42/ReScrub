import crypto from 'crypto';
import { z } from 'zod';

// Validation schema for token data
const tokenDataSchema = z.object({
  deletionRequestId: z.string(),
  type: z.literal('confirm_deletion'),
  expiresAt: z.number() // Unix timestamp
});

export type TokenData = z.infer<typeof tokenDataSchema>;

/**
 * Generate a secure HMAC confirmation token for operator actions
 * @param deletionRequestId - ID of the deletion request
 * @param type - Type of action (always 'confirm_deletion')
 * @param expiresAt - Expiration date
 * @returns Base64 encoded HMAC token
 */
export function generateConfirmationToken(
  deletionRequestId: string,
  type: 'confirm_deletion',
  expiresAt: Date
): string {
  const hmacSecret = process.env.HMAC_SECRET;
  if (!hmacSecret) {
    throw new Error('HMAC_SECRET environment variable is required');
  }

  // Token payload
  const payload: TokenData = {
    deletionRequestId,
    type,
    expiresAt: Math.floor(expiresAt.getTime() / 1000) // Convert to Unix timestamp
  };

  // Create JSON string of payload
  const payloadString = JSON.stringify(payload);
  
  // Generate HMAC signature
  const hmac = crypto.createHmac('sha256', hmacSecret);
  hmac.update(payloadString);
  const signature = hmac.digest('hex');

  // Combine payload and signature
  const tokenData = {
    payload: payloadString,
    signature
  };

  // Return base64 encoded token
  return Buffer.from(JSON.stringify(tokenData)).toString('base64');
}

/**
 * Verify and decode a confirmation token
 * @param token - Base64 encoded HMAC token
 * @returns Decoded token data or null if invalid
 */
export function verifyConfirmationToken(token: string): TokenData | null {
  try {
    const hmacSecret = process.env.HMAC_SECRET;
    if (!hmacSecret) {
      console.error('HMAC_SECRET environment variable is required');
      return null;
    }

    // Decode base64 token
    let tokenData: { payload: string; signature: string };
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      tokenData = JSON.parse(decoded);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }

    if (!tokenData.payload || !tokenData.signature) {
      console.error('Invalid token structure');
      return null;
    }

    // Verify HMAC signature
    const hmac = crypto.createHmac('sha256', hmacSecret);
    hmac.update(tokenData.payload);
    const expectedSignature = hmac.digest('hex');

    // Use crypto.timingSafeEqual to prevent timing attacks
    const signatureBuffer = Buffer.from(tokenData.signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    
    if (signatureBuffer.length !== expectedBuffer.length) {
      console.error('Invalid signature length');
      return null;
    }

    if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
      console.error('Invalid HMAC signature');
      return null;
    }

    // Parse and validate payload
    let payload: TokenData;
    try {
      const parsedPayload = JSON.parse(tokenData.payload);
      payload = tokenDataSchema.parse(parsedPayload);
    } catch (error) {
      console.error('Invalid token payload:', error);
      return null;
    }

    // Check if token has expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.expiresAt < now) {
      console.error('Token has expired');
      return null;
    }

    return payload;

  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Create expiration date 30 days from now
 * @returns Date object set to 30 days in the future
 */
export function createTokenExpiration(): Date {
  const now = new Date();
  return new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
}