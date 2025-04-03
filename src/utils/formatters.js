// Import existing formatDate utility
import { formatDate as originalFormatDate } from './formatDate';

// Re-export the original formatDate
export const formatDate = originalFormatDate;

// Format price to the selected currency (defaults to Nigerian Naira)
export const formatPrice = (price) => {
  return Number(price).toLocaleString();
};

// Format receipt number
export const formatReceiptNumber = (prefix = 'FEB', id = Date.now()) => {
  return `${prefix}-${id.toString().slice(-8)}`;
};

// Format phone number with country code
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if it already has the country code
  if (cleaned.startsWith('234')) {
    return `+${cleaned}`;
  }
  
  // If it starts with 0, replace with country code
  if (cleaned.startsWith('0')) {
    return `+234${cleaned.substring(1)}`;
  }
  
  // Otherwise, assume it's without country code
  return `+234${cleaned}`;
}; 