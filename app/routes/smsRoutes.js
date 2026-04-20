const express = require('express');
const router = express.Router();
const { sendSMSOTP, verifySMSOTP, resendSMSOTP } = require('../controllers/smsController');

// Use actual controller functions
router.post('/send-otp', sendSMSOTP);
router.post('/verify-otp', verifySMSOTP);
router.post('/resend-otp', resendSMSOTP);

module.exports = router;