// ============================================================
// LORE — Encryption Utilities
// Handles client-side encryption and decryption of data.
// ============================================================

const ENCRYPTION_KEY_NAME = "lore_encryption_key";

async function getEncryptionKey(): Promise<CryptoKey> {
  let key = sessionStorage.getItem(ENCRYPTION_KEY_NAME);
  if (key) {
    return crypto.subtle.importKey(
      "jwk",
      JSON.parse(key),
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }

  const newKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  sessionStorage.setItem(ENCRYPTION_KEY_NAME, JSON.stringify(await crypto.subtle.exportKey("jwk", newKey)));
  return newKey;
}

export async function encrypt(data: string): Promise<string> {
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization Vector
  const encoded = new TextEncoder().encode(data);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encoded
  );

  const encryptedArray = new Uint8Array(encrypted);
  const result = new Uint8Array(iv.length + encryptedArray.length);
  result.set(iv, 0);
  result.set(encryptedArray, iv.length);

  return btoa(String.fromCharCode(...result));
}

export async function decrypt(encryptedData: string): Promise<string> {
  const key = await getEncryptionKey();
  const decoded = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
  const iv = decoded.slice(0, 12);
  const ciphertext = decoded.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}
