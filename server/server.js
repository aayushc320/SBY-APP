const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const errorHandler = require('./middleware/error');
const path = require('path');
const connectDB = require('./config/db');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

// Allow Render to set the port via environment variable
const PORT = process.env.PORT || 5000;

// Create Express app
const app = express();

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security middleware
app.use(helmet()); // Set security headers
app.use(xss()); // Prevent XSS attacks
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(hpp()); // Prevent HTTP param pollution

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(cors({
  origin: '*',  // Allow all origins during testing
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add a simple health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'Server is running',
    timestamp: new Date(),
    env: process.env.NODE_ENV
  });
});

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const classRoutes = require('./routes/classes');
const paymentRoutes = require('./routes/payments');
const zoomRoutes = require('./routes/zoom');
const bookingRoutes = require('./routes/bookingRoutes');
const mongodbRoutes = require('./routes/mongodb');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/zoom', zoomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/mongodb', mongodbRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder - look for files in multiple possible locations
  const possiblePaths = [
    path.join(__dirname, '../ui/build'),      // If UI is built in ui/build
    path.join(__dirname, 'client/build'),     // If UI is copied to server/client/build
    path.join(__dirname, '../client/build'),  // Another possible location
    path.join(__dirname, 'public')            // Default public folder
  ];
  
  // Log where we're looking for static files
  console.log('Checking for static files in these locations:');
  possiblePaths.forEach(p => {
    const exists = fs.existsSync(p);
    console.log(`- ${p} (${exists ? 'EXISTS' : 'NOT FOUND'})`);
    if (exists) {
      app.use(express.static(p));
    }
  });

  // Serve index.html for any route not found
  app.get('*', (req, res) => {
    // Try to find index.html in any of the possible paths
    for (const p of possiblePaths) {
      const indexPath = path.join(p, 'index.html');
      if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }
    }
    
    // If we can't find index.html, serve an error message
    res.status(404).send('Frontend files not found. Please check build configuration.');
  });
}

// Error handler middleware
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
}); 