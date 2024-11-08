// Common tracking number formats
const TRACKING_PATTERNS = [
  /^[0-9]{12,14}$/, // Standard numeric format (12-14 digits)
  /^[A-Z]{2}[0-9]{9}[A-Z]{2}$/, // International postal format
  /^1Z[A-Z0-9]{16}$/, // UPS
  /^[0-9]{20,22}$/, // FedEx
  /^\d{10}$/, // DHL Express
  /^[A-Z]{2}\d{9}[A-Z]{2}$/, // EMS
  /^[A-Z]{2}[0-9]{9}FR$/, // Colissimo
  /^[A-Z0-9]{8,}$/, // Generic alphanumeric (min 8 chars)
];

export const validateTrackingNumberFormat = (trackingNumber: string): boolean => {
  if (!trackingNumber || typeof trackingNumber !== 'string') {
    return false;
  }

  const cleanNumber = trackingNumber.trim().toUpperCase();
  
  // Check if the tracking number matches any known format
  return TRACKING_PATTERNS.some(pattern => pattern.test(cleanNumber));
};