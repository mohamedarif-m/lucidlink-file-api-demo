/**
 * Authentication middleware
 * For demo purposes, this is a simple implementation
 * In production, use proper JWT or OAuth
 */

const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // For demo: accept any API key or allow without one
  if (process.env.REQUIRE_AUTH === 'true' && !apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key required'
    });
  }
  
  // Add user info to request
  req.user = {
    id: apiKey || 'anonymous',
    name: 'Demo User'
  };
  
  next();
};

module.exports = { authenticate };

// Made with Bob
