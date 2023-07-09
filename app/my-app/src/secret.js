export function generatePassword(length) {
  const crypto = window.crypto || window.msCrypto;

  if (typeof crypto === 'undefined') {
    throw new Error('Crypto API is not supported. Please upgrade your web browser');
  }

  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+';

  const indexes = crypto.getRandomValues(new Uint32Array(length));

  let secret = '';

  for (const index of indexes) {
    secret += charset[index % charset.length];
  }

  return secret;
}
