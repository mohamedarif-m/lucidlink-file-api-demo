const express = require('express');
const router = express.Router();
const fileService = require('../services/fileService');
const validator = require('../utils/validator');

/**
 * GET /api/files
 * List all files
 */
router.get('/', async (req, res) => {
  try {
    const files = await fileService.listFiles();
    res.json({
      success: true,
      count: files.length,
      data: files
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

/**
 * POST /api/files/upload
 * Upload a new file
 */
router.post('/upload', async (req, res) => {
  try {
    // Validate file data before upload
    const validation = validator.validateFile(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const file = await fileService.uploadFile(req.body);
    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: file
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/files/:id
 * Get file by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const file = await fileService.getFileById(req.params.id);
    res.json({
      success: true,
      data: file
    });
  } catch (error) {
    res.status(404).json({ 
      success: false,
      error: error.message 
    });
  }
});

/**
 * DELETE /api/files/:id
 * Delete file by ID
 */
router.delete('/:id', async (req, res) => {
  try {
    await fileService.deleteFile(req.params.id);
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    res.status(404).json({ 
      success: false,
      error: error.message 
    });
  }
});

/**
 * GET /api/files/stats/storage
 * Get storage statistics
 */
router.get('/stats/storage', async (req, res) => {
  try {
    const totalBytes = await fileService.getTotalStorage();
    const files = await fileService.listFiles();
    
    res.json({
      success: true,
      data: {
        totalFiles: files.length,
        totalBytes: totalBytes,
        totalMB: (totalBytes / (1024 * 1024)).toFixed(2),
        averageFileSize: files.length > 0 ? Math.round(totalBytes / files.length) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;

// Made with Bob
