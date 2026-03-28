/**
 * FileService - Handles file operations and storage
 * In a production environment, this would integrate with a database
 * For demo purposes, we use in-memory storage
 */

class FileService {
  constructor() {
    this.files = [];
  }

  /**
   * List all files
   * @returns {Promise<Array>} Array of file objects
   */
  async listFiles() {
    return this.files.sort((a, b) => 
      new Date(b.uploadedAt) - new Date(a.uploadedAt)
    );
  }

  /**
   * Upload a new file
   * @param {Object} fileData - File metadata
   * @returns {Promise<Object>} Created file object
   */
  async uploadFile(fileData) {
    if (!fileData.name) {
      throw new Error('File name is required');
    }

    if (!fileData.size) {
      throw new Error('File size is required');
    }

    const file = {
      id: Date.now().toString(),
      name: fileData.name,
      size: fileData.size,
      type: fileData.type || 'application/octet-stream',
      uploadedAt: new Date().toISOString(),
      owner: fileData.owner || 'anonymous'
    };

    this.files.push(file);
    return file;
  }

  /**
   * Get file by ID
   * @param {string} id - File ID
   * @returns {Promise<Object|null>} File object or null
   */
  async getFileById(id) {
    const file = this.files.find(f => f.id === id);
    if (!file) {
      throw new Error(`File with id ${id} not found`);
    }
    return file;
  }

  /**
   * Delete file by ID
   * @param {string} id - File ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteFile(id) {
    const index = this.files.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error(`File with id ${id} not found`);
    }
    this.files.splice(index, 1);
    return true;
  }

  /**
   * Get total storage used
   * @returns {Promise<number>} Total bytes
   */
  async getTotalStorage() {
    return this.files.reduce((total, file) => total + file.size, 0);
  }

  /**
   * Clear all files (for testing)
   */
  clearAll() {
    this.files = [];
  }
}

module.exports = new FileService();

// Made with Bob
