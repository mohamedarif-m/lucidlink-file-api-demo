/**
 * Validation utilities for file operations
 */

const MIN_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const MAX_FILE_SIZE = 300 * 1024 * 1024; // 300MB (updated from 500MB per issue #10)
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/plain',
  'application/json',
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'application/octet-stream'
];

/**
 * Validate file size
 * @param {number} size - File size in bytes
 * @returns {Object} Validation result
 */
const validateFileSize = (size) => {
  if (!size || size <= 0) {
    return {
      valid: false,
      error: 'File size must be greater than 0'
    };
  }

  if (size < MIN_FILE_SIZE) {
    return {
      valid: false,
      error: `File size is below minimum allowed size of ${MIN_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  return { valid: true };
};

/**
 * Validate file type
 * @param {string} type - MIME type
 * @returns {Object} Validation result
 */
const validateFileType = (type) => {
  if (!type) {
    return {
      valid: false,
      error: 'File type is required'
    };
  }

  if (!ALLOWED_FILE_TYPES.includes(type)) {
    return {
      valid: false,
      error: `File type ${type} is not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`
    };
  }

  return { valid: true };
};

/**
 * Validate file name
 * @param {string} name - File name
 * @returns {Object} Validation result
 */
const validateFileName = (name) => {
  if (!name || name.trim().length === 0) {
    return {
      valid: false,
      error: 'File name is required'
    };
  }

  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/g;
  if (invalidChars.test(name)) {
    return {
      valid: false,
      error: 'File name contains invalid characters'
    };
  }

  // Check length
  if (name.length > 255) {
    return {
      valid: false,
      error: 'File name is too long (max 255 characters)'
    };
  }

  return { valid: true };
};

/**
 * Validate complete file data
 * @param {Object} fileData - File metadata
 * @returns {Object} Validation result
 */
const validateFile = (fileData) => {
  const nameValidation = validateFileName(fileData.name);
  if (!nameValidation.valid) {
    return nameValidation;
  }

  const sizeValidation = validateFileSize(fileData.size);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }

  if (fileData.type) {
    const typeValidation = validateFileType(fileData.type);
    if (!typeValidation.valid) {
      return typeValidation;
    }
  }

  return { valid: true };
};

module.exports = {
  validateFileSize,
  validateFileType,
  validateFileName,
  validateFile,
  MIN_FILE_SIZE,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES
};

// Made with Bob
