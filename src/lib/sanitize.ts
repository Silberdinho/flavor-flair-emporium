/**
 * Input sanitization utilities to prevent XSS and injection attacks.
 */

/** Strip HTML tags from a string */
export const stripHtml = (input: string): string =>
  input.replace(/<[^>]*>/g, "");

/** Escape HTML special characters for safe embedding */
export const escapeHtml = (input: string): string =>
  input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

/** Sanitize a plain-text user input: trim + strip HTML tags */
export const sanitizeText = (input: string, maxLength = 500): string =>
  stripHtml(input).trim().slice(0, maxLength);

/** Sanitize and lowercase an email address */
export const sanitizeEmail = (input: string): string =>
  stripHtml(input).trim().toLowerCase().slice(0, 254);

/** Sanitize a phone number — allow digits, spaces, +, - */
export const sanitizePhone = (input: string): string =>
  input.replace(/[^\d\s+\-()]/g, "").trim().slice(0, 20);
