const express = require('express');
const router = express.Router();

// Simple working endpoints first
router.post('/send-otp', (req, res) => {
  console.log('📱 SMS OTP request:', req.body);
  res.json({ 
    success: true, 
    message: 'SMS OTP sent successfully',
    channel: 'sms',
    devOtp: '123456'
  });
});

router.post('/verify-otp', (req, res) => {
  console.log('🔐 Verify OTP:', req.body);
  res.json({ success: true, verified: true, message: 'OTP verified' });
});

router.post('/resend-otp', (req, res) => {
  console.log('🔄 Resend OTP:', req.body);
  res.json({ success: true, message: 'OTP resent' });
});

module.exports = router;