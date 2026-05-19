require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middlewares/errorHandler');

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'JobConnect API is running'
  });
});

// API routes
app.use('/api/auth', require('./src/routes/authRoutes'));
// app.use('/api/jobs', require('./src/routes/jobRoutes'));
// app.use('/api/applications', require('./src/routes/applicationRoutes'));
// app.use('/api/reviews', require('./src/routes/reviewRoutes'));
// app.use('/api/users', require('./src/routes/userRoutes'));
// app.use('/api/admin', require('./src/routes/adminRoutes'));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
