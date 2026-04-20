const express = require('express');
const router = express.Router();

router.get('/check', (req, res) => {
  console.log('🔍 Auth check request');
  
  // Check for token in cookies (simplified for testing)
  const token = req.cookies?.accessToken;
  
  res.json({ 
    success: true, 
    isAuthenticated: !!token,
    message: token ? 'User is authenticated' : 'User is not authenticated'
  });
});

router.post('/logout', (req, res) => {
  console.log('🚪 Logout request');
  
  // Clear cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  
  res.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
});

module.exports = router;