const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./database/db');
const authRoutes = require('./routes/auth.routes');
const cardRoutes = require('./routes/card.routes');
const progressRoutes = require('./routes/progress.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Start server function
const startServer = async () => {
  try {
    console.log('Starting server initialization...');
    
    // Connect to MongoDB first
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connection successful');
    
    // Create uploads directory if it doesn't exist
    console.log('Setting up uploads directory...');
    const fs = require('fs');
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Created uploads directory');
    }
    
    console.log('Setting up middleware...');
    // Middleware
    try {
      // Configure CORS to allow frontend requests
      const corsOptions = {
        origin: ['http://localhost:4200', 'http://127.0.0.1:4200', 'http://localhost:3000', 'http://127.0.0.1:3000', ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
      };
      
      app.use(cors(corsOptions));
      console.log('CORS middleware loaded with options:', corsOptions);
      
      // Add request logger middleware
      app.use((req, res, next) => {
        console.log(`📥 ${req.method} ${req.url} - ${new Date().toISOString()}`);
        console.log(`   Headers:`, req.headers);
        if (req.body && Object.keys(req.body).length > 0) {
          console.log(`   Body:`, req.body);
        }
        next();
      });
      
      app.use(express.json());
      console.log('JSON middleware loaded');
      app.use(express.urlencoded({ extended: true }));
      console.log('URL encoded middleware loaded');
    } catch (error) {
      console.error('Error setting up middleware:', error);
      throw error;
    }
    
    console.log('Setting up routes...');
    // Routes
    try {
      console.log('Loading auth routes...');
      app.use('/api/auth', authRoutes);
      console.log('Auth routes loaded successfully');
      
      console.log('Loading card routes...');
      app.use('/api/cards', cardRoutes);
      console.log('Card routes loaded successfully');
      
      console.log('Loading progress routes...');
      app.use('/api/progress', progressRoutes);
      console.log('Progress routes loaded successfully');
    } catch (error) {
      console.error('Error setting up routes:', error);
      throw error;
    }
    
    console.log('Setting up static files...');
    // Serve uploaded images
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    
    console.log('Setting up health check endpoint...');
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        message: 'Server is running', 
        timestamp: new Date().toISOString(),
        port: PORT,
        environment: process.env.NODE_ENV || 'development'
      });
    });
    
    console.log('Setting up error handling...');
    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      
      if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ message: 'Too many files. Maximum is 5 files.' });
        }
      }
      
      res.status(500).json({ message: 'Something went wrong!' });
    });
    
    console.log('Setting up 404 handler...');
    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({ message: 'Route not found' });
    });
    
    console.log('HTTP server started successfully');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Instead, export the app object for Vercel
module.exports = app;
