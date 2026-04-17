const express = require('express');
const router = express.Router();

// Simple test response first
router.post('/send-otp', async (req, res) => {
  console.log('📱 SMS OTP request received:', req.body);
  res.json({ 
    success: true, 
    message: 'SMS OTP sent successfully',
    channel: 'sms',
    devOtp: '123456'
  });
});

router.post('/verify-otp', async (req, res) => {
  console.log('🔐 Verify OTP request:', req.body);
  res.json({ success: true, verified: true, message: 'OTP verified' });
});

router.post('/resend-otp', async (req, res) => {
  console.log('🔄 Resend OTP request:', req.body);
  res.json({ success: true, message: 'OTP resent' });
});

module.exports = router;