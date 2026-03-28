const {
  validateFileSize,
  validateFileType,
  validateFileName,
  validateFile,
  MAX_FILE_SIZE
} = require('../backend/utils/validator');

describe('Validator Utilities', () => {
  describe('validateFileSize', () => {
    test('should accept valid file size', () => {
      const result = validateFileSize(1024);
      expect(result.valid).toBe(true);
    });

    test('should reject zero size', () => {
      const result = validateFileSize(0);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('greater than 0');
    });

    test('should reject negative size', () => {
      const result = validateFileSize(-100);
      expect(result.valid).toBe(false);
    });

    test('should reject size exceeding maximum', () => {
      const result = validateFileSize(MAX_FILE_SIZE + 1);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum');
    });

    test('should accept maximum allowed size', () => {
      const result = validateFileSize(MAX_FILE_SIZE);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateFileType', () => {
    test('should accept valid MIME types', () => {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
      validTypes.forEach(type => {
        const result = validateFileType(type);
        expect(result.valid).toBe(true);
      });
    });

    test('should reject invalid MIME type', () => {
      const result = validateFileType('application/x-malware');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not allowed');
    });

    test('should reject empty type', () => {
      const result = validateFileType('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });
  });

  describe('validateFileName', () => {
    test('should accept valid file names', () => {
      const validNames = ['test.txt', 'my-file.pdf', 'document_2024.docx'];
      validNames.forEach(name => {
        const result = validateFileName(name);
        expect(result.valid).toBe(true);
      });
    });

    test('should reject empty name', () => {
      const result = validateFileName('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    test('should reject name with invalid characters', () => {
      const invalidNames = ['file<test>.txt', 'file:test.txt', 'file|test.txt'];
      invalidNames.forEach(name => {
        const result = validateFileName(name);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('invalid characters');
      });
    });

    test('should reject name exceeding 255 characters', () => {
      const longName = 'a'.repeat(256) + '.txt';
      const result = validateFileName(longName);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too long');
    });

    test('should accept name with exactly 255 characters', () => {
      const name = 'a'.repeat(251) + '.txt'; // 255 total
      const result = validateFileName(name);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateFile', () => {
    test('should accept valid file data', () => {
      const fileData = {
        name: 'test.txt',
        size: 1024,
        type: 'text/plain'
      };
      const result = validateFile(fileData);
      expect(result.valid).toBe(true);
    });

    test('should reject file with invalid name', () => {
      const fileData = {
        name: 'test<>.txt',
        size: 1024,
        type: 'text/plain'
      };
      const result = validateFile(fileData);
      expect(result.valid).toBe(false);
    });

    test('should reject file with invalid size', () => {
      const fileData = {
        name: 'test.txt',
        size: MAX_FILE_SIZE + 1,
        type: 'text/plain'
      };
      const result = validateFile(fileData);
      expect(result.valid).toBe(false);
    });

    test('should reject file with invalid type', () => {
      const fileData = {
        name: 'test.txt',
        size: 1024,
        type: 'application/x-invalid'
      };
      const result = validateFile(fileData);
      expect(result.valid).toBe(false);
    });

    test('should accept file without type specified', () => {
      const fileData = {
        name: 'test.txt',
        size: 1024
      };
      const result = validateFile(fileData);
      expect(result.valid).toBe(true);
    });
  });
});

// Made with Bob
