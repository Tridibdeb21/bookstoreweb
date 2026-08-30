// Utility to encrypt and decrypt personal Time Capsule notes for Bookshelf
export const CryptoUtils = {
  encrypt(plainText: string, secretKey: string = 'BookStoreSecretPassphrase2025'): string {
    if (!plainText.trim()) return '';
    try {
      // Reversible obfuscation/encryption using key byte XOR + Base64
      const textBytes = new TextEncoder().encode(plainText);
      const keyBytes = new TextEncoder().encode(secretKey);
      const encrypted = new Uint8Array(textBytes.length);
      for (let i = 0; i < textBytes.length; i++) {
        encrypted[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
      }
      let binary = '';
      encrypted.forEach((byte) => {
        binary += String.fromCharCode(byte);
      });
      return btoa(binary);
    } catch {
      return plainText;
    }
  },

  decrypt(cipherText: string, secretKey: string = 'BookStoreSecretPassphrase2025'): string {
    if (!cipherText.trim()) return '';
    try {
      const binary = atob(cipherText);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const keyBytes = new TextEncoder().encode(secretKey);
      const decrypted = new Uint8Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) {
        decrypted[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
      }
      return new TextDecoder().decode(decrypted);
    } catch {
      return '[Unable to decrypt note]';
    }
  }
};
