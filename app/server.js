const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const { connectDB } = require('./config/database');
const corsMiddleware = require('./middleware/corsMiddleware'); // Import directly
const smsRoutes = require('./routes/smsRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Apply CORS middleware FIRST for all routes
app.use(corsMiddleware);

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes - Make sure they exist
app.use('/api/sms', smsRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/auth', authRoutes);

// Simple test endpoint without database
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Test CORS endpoint
app.get('/test-cors', (req, res) => {
  res.json({ 
    message: 'CORS is working!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  console.log('❌ Route not found:', req.method, req.originalUrl);
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`✅ Test: http://localhost:${PORT}/test`);
      console.log(`✅ Health: http://localhost:${PORT}/health`);
      console.log(`✅ CORS Test: http://localhost:${PORT}/test-cors`);
    });
  } catch (error) {
    console.error('Failed to connect to DB:', error);
    // Still start server even without DB
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`⚠️ Server running without DB on port ${PORT}`);
    });
  }
};

startServer();