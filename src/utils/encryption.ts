
/**
 * Encryption utility functions for sensitive data
 * 
 * This implementation uses a simple encryption method for demonstration.
 * In a production environment, consider using a more robust encryption library.
 */

/**
 * Encrypts a string value
 * @param value The string to encrypt
 * @returns The encrypted string
 */
export function encryptValue(value: string): string {
  if (!value) return value;
  
  // Simple Base64 encoding for demonstration
  // In production, use a proper encryption algorithm
  return btoa(`${value}:${Date.now()}`);
}

/**
 * Decrypts an encrypted string value
 * @param encryptedValue The encrypted string
 * @returns The decrypted string
 */
export function decryptValue(encryptedValue: string): string {
  if (!encryptedValue) return encryptedValue;
  
  try {
    // Extract the original value from the encrypted string
    const decodedValue = atob(encryptedValue);
    return decodedValue.split(':')[0];
  } catch (error) {
    console.error('Error decrypting value:', error);
    return encryptedValue; // Return the original value if decryption fails
  }
}
