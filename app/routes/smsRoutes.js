const express = require('express');
const router = express.Router();

// Simple working implementations (no database required for testing)
router.post('/send-otp', (req, res) => {
  console.log('📱 SMS OTP request received:', req.body);
  const { phoneNumber } = req.body;
  
  if (!phoneNumber) {
    return res.status(400).json({ 
      success: false, 
      message: 'Phone number is required' 
    });
  }
  
  res.json({ 
    success: true, 
    message: 'SMS OTP sent successfully',
    channel: 'sms',
    devOtp: '123456'
  });
});

router.post('/verify-otp', (req, res) => {
  console.log('🔐 Verify OTP request:', req.body);
  const { phoneNumber, otpCode, name } = req.body;
  
  if (!phoneNumber || !otpCode) {
    return res.status(400).json({ 
      success: false, 
      verified: false,
      message: 'Phone number and OTP code are required' 
    });
  }
  
  // For testing, accept any 6-digit code
  if (otpCode === '123456' || otpCode.length === 6) {
    res.json({ 
      success: true, 
      verified: true, 
      message: 'OTP verified successfully',
      channel: 'sms',
      user: {
        id: 1,
        name: name || 'User',
        mobileNumber: phoneNumber,
        isVerified: true,
        preferredChannel: 'sms'
      }
    });
  } else {
    res.status(400).json({ 
      success: false, 
      verified: false,
      message: 'Invalid OTP code' 
    });
  }
});

router.post('/resend-otp', (req, res) => {
  console.log('🔄 Resend OTP request:', req.body);
  const { phoneNumber } = req.body;
  
  if (!phoneNumber) {
    return res.status(400).json({ 
      success: false, 
      message: 'Phone number is required' 
    });
  }
  
  res.json({ 
    success: true, 
    message: 'OTP resent successfully',
    channel: 'sms',
    devOtp: '654321'
  });
});

// Test route to verify router is working
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'SMS routes are working!',
    endpoints: [
      'POST /api/sms/send-otp',
      'POST /api/sms/verify-otp', 
      'POST /api/sms/resend-otp'
    ]
  });
});

module.exports = router;