/**
 * End-to-End Encryption (E2EE) & 2FA Security Utilities
 * Utilizing standard Web Crypto API (SubtleCrypto)
 */

export class E2EEService {
  private static masterKey: CryptoKey | null = null;
  private static cachedFingerprint: string = '';

  // Initialize or get the AES-GCM 256-bit key
  public static async getOrCreateKey(): Promise<CryptoKey> {
    if (this.masterKey) return this.masterKey;

    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );

    this.masterKey = key;
    await this.computeFingerprint(key);
    return key;
  }

  // Compute a SHA-256 visual verification fingerprint of the key
  private static async computeFingerprint(key: CryptoKey): Promise<string> {
    const rawKey = await window.crypto.subtle.exportKey('raw', key);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', rawKey);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    this.cachedFingerprint = `SHA256:${hashHex.slice(0, 8)}...${hashHex.slice(-8)}`;
    return this.cachedFingerprint;
  }

  public static async getFingerprint(): Promise<string> {
    if (this.cachedFingerprint) return this.cachedFingerprint;
    await this.getOrCreateKey();
    return this.cachedFingerprint;
  }

  // Encrypt string data using AES-GCM with 96-bit random IV
  public static async encrypt(text: string): Promise<{ ciphertext: string; iv: string }> {
    const key = await this.getOrCreateKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(text);

    const cipherBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encoded
    );

    const cipherArray = Array.from(new Uint8Array(cipherBuffer));
    const ciphertext = btoa(String.fromCharCode(...cipherArray));
    const ivBase64 = btoa(String.fromCharCode(...Array.from(iv)));

    return { ciphertext, iv: ivBase64 };
  }

  // Decrypt data
  public static async decrypt(ciphertext: string, ivBase64: string): Promise<string> {
    const key = await this.getOrCreateKey();
    const iv = new Uint8Array(
      atob(ivBase64)
        .split('')
        .map((c) => c.charCodeAt(0))
    );
    const cipherBytes = new Uint8Array(
      atob(ciphertext)
        .split('')
        .map((c) => c.charCodeAt(0))
    );

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      cipherBytes
    );

    return new TextDecoder().decode(decryptedBuffer);
  }
}

// 2FA TOTP Simulation helper
export function generate2FASecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 16; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

export function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 6; i++) {
    const p1 = Math.floor(1000 + Math.random() * 9000);
    const p2 = Math.floor(1000 + Math.random() * 9000);
    codes.push(`${p1}-${p2}`);
  }
  return codes;
}

export function getCurrentTotpCode(secret: string): string {
  // Deterministic 6-digit code based on 30s window and secret
  const timeStep = Math.floor(Date.now() / 30000);
  let hash = 0;
  const str = secret + timeStep;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash);
  return (positive % 1000000).toString().padStart(6, '0');
}
