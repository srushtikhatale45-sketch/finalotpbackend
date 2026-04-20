const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const { connectDB } = require('./config/database');
const corsMiddleware = require('./middleware/corsMiddleware');
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

// Debug: List all registered routes (place this BEFORE 404 handler)
console.log('\n📋 Registered Routes:');
const listRoutes = (stack, basePath = '') => {
  stack.forEach(layer => {
    if (layer.route) {
      // Routes registered directly on app
      const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
      console.log(`${methods.padEnd(7)} ${basePath}${layer.route.path}`);
    } else if (layer.name === 'router' && layer.handle.stack) {
      // Router middleware
      let routerPath = basePath;
      
      // Extract the path from the regexp
      if (layer.regexp) {
        const pattern = layer.regexp.source;
        // Remove escaped slashes and other regex characters
        let path = pattern.replace(/\\\//g, '/').replace(/\^|\?|\$/g, '');
        // Remove trailing/leading slashes appropriately
        if (path !== '/') {
          routerPath = basePath + path;
        }
      }
      
      // Clean up the path
      routerPath = routerPath.replace(/\/\(\[\^\/\]\*\?\)\?/g, '').replace(/\/\?/g, '');
      
      // Recursively list routes in the router
      listRoutes(layer.handle.stack, routerPath);
    }
  });
};

// Start listing routes from the app's router stack
if (app._router && app._router.stack) {
  listRoutes(app._router.stack);
} else {
  console.log('No routes registered yet');
}
console.log('');

// 404 handler (must be after all routes)
app.use((req, res) => {
  console.log('❌ Route not found:', req.method, req.originalUrl);
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler (must be last)
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
      console.log(`\n📝 Available API Endpoints:`);
      console.log(`   POST   /api/sms/send-otp`);
      console.log(`   POST   /api/sms/verify-otp`);
      console.log(`   POST   /api/sms/resend-otp`);
      console.log(`   POST   /api/whatsapp/send-otp`);
      console.log(`   POST   /api/whatsapp/verify-otp`);
      console.log(`   POST   /api/whatsapp/resend-otp`);
      console.log(`   GET    /api/auth/check`);
      console.log(`   POST   /api/auth/logout\n`);
    });
  } catch (error) {
    console.error('Failed to connect to DB:', error);
    // Still start server even without DB
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`⚠️ Server running without DB on port ${PORT}`);
      console.log(`\n📝 Available API Endpoints (DB not connected):`);
      console.log(`   POST   /api/sms/send-otp`);
      console.log(`   POST   /api/sms/verify-otp`);
      console.log(`   POST   /api/sms/resend-otp`);
      console.log(`   POST   /api/whatsapp/send-otp`);
      console.log(`   POST   /api/whatsapp/verify-otp`);
      console.log(`   POST   /api/whatsapp/resend-otp`);
      console.log(`   GET    /api/auth/check`);
      console.log(`   POST   /api/auth/logout\n`);
    });
  }
};

startServer();