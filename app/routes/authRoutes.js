const express = require('express');
const router = express.Router();

router.get('/check', (req, res) => {
  res.json({ authenticated: false, success: true });
});

router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out' });
});

module.exports = router;