
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const groupRoutes = require('./routes/groups');
const categoryRoutes = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration to allow requests from any origin
app.use(cors({
  origin: '*', // Allows all origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow credentials (cookies, authorization headers, etc)
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/groups', groupRoutes);
app.use('/api/categories', categoryRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('HobbyHub API is running');
});

// MongoDB connection string validation
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hobbyhub';

// Check if the MongoDB URI is valid
if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
  console.error('Invalid MongoDB URI:', MONGODB_URI);
  console.error('Please set a valid MONGODB_URI environment variable that starts with "mongodb://" or "mongodb+srv://"');
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
