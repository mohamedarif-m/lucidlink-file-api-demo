/**
 * LucidLink API Routes
 * 
 * Endpoints for LucidLink integration
 */

const express = require('express');
const router = express.Router();
const lucidlinkService = require('../services/lucidlinkService');

/**
 * GET /api/lucidlink/status
 * Get connection status
 */
router.get('/status', async (req, res) => {
  try {
    const result = await lucidlinkService.getConnectionStatus();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get connection status',
      details: error.message
    });
  }
});

/**
 * GET /api/lucidlink/filespaces
 * Get all filespaces
 */
router.get('/filespaces', async (req, res) => {
  try {
    const result = await lucidlinkService.getFilespaces();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch filespaces',
      details: error.message
    });
  }
});

/**
 * GET /api/lucidlink/filespaces/:id
 * Get filespace by ID
 */
router.get('/filespaces/:id', async (req, res) => {
  try {
    const result = await lucidlinkService.getFilespaceById(req.params.id);
    
    if (!result.success) {
      return res.status(404).json(result);
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch filespace',
      details: error.message
    });
  }
});

/**
 * POST /api/lucidlink/filespaces
 * Create new filespace
 */
router.post('/filespaces', async (req, res) => {
  try {
    const { name, domain, storageSize } = req.body;
    
    // Validation
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Filespace name is required'
      });
    }
    
    const result = await lucidlinkService.createFilespace({
      name,
      domain,
      storageSize
    });
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create filespace',
      details: error.message
    });
  }
});

/**
 * DELETE /api/lucidlink/filespaces/:id
 * Delete filespace
 */
router.delete('/filespaces/:id', async (req, res) => {
  try {
    const result = await lucidlinkService.deleteFilespace(req.params.id);
    
    if (!result.success) {
      return res.status(404).json(result);
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete filespace',
      details: error.message
    });
  }
});

/**
 * GET /api/lucidlink/domains
 * Get all domains
 */
router.get('/domains', async (req, res) => {
  try {
    const result = await lucidlinkService.getDomains();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch domains',
      details: error.message
    });
  }
});

/**
 * GET /api/lucidlink/stats
 * Get storage statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const result = await lucidlinkService.getStorageStats();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch storage statistics',
      details: error.message
    });
  }
});

module.exports = router;

// Made with Bob