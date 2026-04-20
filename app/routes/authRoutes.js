const express = require('express');
const router = express.Router();

router.get('/check', (req, res) => {
  console.log('🔍 Auth check request');
  res.json({ 
    success: true, 
    isAuthenticated: false,
    message: 'Auth check endpoint working' 
  });
});

router.post('/logout', (req, res) => {
  console.log('🚪 Logout request');
  res.json({ success: true, message: 'Logged out' });
});

module.exports = router;