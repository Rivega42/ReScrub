import crypto from 'crypto';

// Constants for encryption
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 128 bits
const SALT_LENGTH = 32; // 256 bits
const TAG_LENGTH = 16; // 128 bits
const KEY_LENGTH = 32; // 256 bits
const ITERATIONS = 100000; // PBKDF2 iterations

// Get or generate encryption key
function getEncryptionKey(): Buffer {
  const envKey = process.env.ENCRYPTION_KEY;
  
  if (envKey) {
    // Use existing key from environment
    const keyBuffer = Buffer.from(envKey, 'hex');
    if (keyBuffer.length !== KEY_LENGTH) {
      throw new Error('Invalid ENCRYPTION_KEY length. Must be 32 bytes (64 hex characters).');
    }
    return keyBuffer;
  } else {
    // Generate a new key if not exists (for development)
    console.warn('⚠️ ENCRYPTION_KEY not found in environment. Generating a temporary key for development.');
    console.warn('⚠️ For production, set ENCRYPTION_KEY environment variable with a 64-character hex string.');
    console.warn('⚠️ You can generate one with: openssl rand -hex 32');
    
    // Use a deterministic key for development (based on a fixed seed)
    // This ensures consistency across restarts in development
    const seed = 'development-key-seed-do-not-use-in-production';
    return crypto.pbkdf2Sync(seed, 'salt', ITERATIONS, KEY_LENGTH, 'sha256');
  }
}

// Encryption result interface
interface EncryptedData {
  encrypted: string;
  iv: string;
  tag: string;
  salt: string;
}

/**
 * Encrypt a secret using AES-256-GCM
 * @param plaintext The secret to encrypt
 * @returns Encrypted data with IV, tag, and salt
 */
export function encryptSecret(plaintext: string): EncryptedData {
  try {
    // Get the master key
    const masterKey = getEncryptionKey();
    
    // Generate random salt and IV
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Derive encryption key from master key using PBKDF2
    const key = crypto.pbkdf2Sync(masterKey, salt, ITERATIONS, KEY_LENGTH, 'sha256');
    
    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    // Encrypt the plaintext
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final()
    ]);
    
    // Get the authentication tag
    const tag = cipher.getAuthTag();
    
    return {
      encrypted: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      tag: tag.toString('base64'),
      salt: salt.toString('base64')
    };
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt secret');
  }
}

/**
 * Decrypt a secret using AES-256-GCM
 * @param encryptedData The encrypted data with IV, tag, and salt
 * @returns The decrypted plaintext
 */
export function decryptSecret(encryptedData: EncryptedData): string {
  try {
    // Get the master key
    const masterKey = getEncryptionKey();
    
    // Convert from base64
    const encrypted = Buffer.from(encryptedData.encrypted, 'base64');
    const iv = Buffer.from(encryptedData.iv, 'base64');
    const tag = Buffer.from(encryptedData.tag, 'base64');
    const salt = Buffer.from(encryptedData.salt, 'base64');
    
    // Derive the same encryption key using PBKDF2
    const key = crypto.pbkdf2Sync(masterKey, salt, ITERATIONS, KEY_LENGTH, 'sha256');
    
    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    // Decrypt the data
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt secret: Invalid key or corrupted data');
  }
}

/**
 * Hash a secret for comparison (one-way)
 * Used for validating secrets without storing plaintext
 * @param plaintext The secret to hash
 * @returns Base64 encoded hash
 */
export function hashSecret(plaintext: string): string {
  try {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const hash = crypto.pbkdf2Sync(plaintext, salt, ITERATIONS, 64, 'sha512');
    
    // Combine salt and hash for storage
    const combined = Buffer.concat([salt, hash]);
    return combined.toString('base64');
  } catch (error) {
    console.error('Hashing failed:', error);
    throw new Error('Failed to hash secret');
  }
}

/**
 * Verify a plaintext against a hash
 * @param plaintext The plaintext to verify
 * @param hashedData The hash to compare against
 * @returns True if the plaintext matches the hash
 */
export function verifyHash(plaintext: string, hashedData: string): boolean {
  try {
    const combined = Buffer.from(hashedData, 'base64');
    
    // Extract salt and hash
    const salt = combined.slice(0, SALT_LENGTH);
    const originalHash = combined.slice(SALT_LENGTH);
    
    // Hash the plaintext with the same salt
    const hash = crypto.pbkdf2Sync(plaintext, salt, ITERATIONS, 64, 'sha512');
    
    // Compare hashes
    return crypto.timingSafeEqual(originalHash, hash);
  } catch (error) {
    console.error('Hash verification failed:', error);
    return false;
  }
}

/**
 * Mask a secret value for display
 * Shows only the last 4 characters
 * @param secret The secret to mask
 * @param showLast Number of characters to show at the end (default: 4)
 * @returns Masked secret like "••••••••1234"
 */
export function maskSecret(secret: string, showLast: number = 4): string {
  if (!secret || secret.length <= showLast) {
    return '••••••••';
  }
  
  const visiblePart = secret.slice(-showLast);
  const maskedLength = Math.max(8, secret.length - showLast);
  const masked = '•'.repeat(maskedLength) + visiblePart;
  
  return masked;
}

/**
 * Generate a secure random token
 * @param length Token length in bytes (default: 32)
 * @returns Hex encoded random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}