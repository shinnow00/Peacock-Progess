const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth.controller');
const User = require('../models/user.model');

// POST /auth/login
router.post('/login', login);

// GET /auth/debug - Debug endpoint to check users (remove in production)
router.get('/debug', async (req, res) => {
  try {
    console.log('=== DEBUG ENDPOINT CALLED ===');
    const users = await User.find({}, { password: 0 }); // Exclude passwords
    console.log('Users found:', users.length);
    console.log('Users:', users);
    
    res.json({ 
      message: 'Debug: Users in database',
      count: users.length,
      users: users,
      database: 'progressdb',
      connection: '127.0.0.1:27017'
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// GET /auth/test-user - Test specific user lookup
router.get('/test-user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    console.log('Testing user lookup for:', username);
    
    const user = await User.findOne({ username });
    if (user) {
      res.json({
        found: true,
        username: user.username,
        role: user.role,
        hasPassword: !!user.password,
        passwordLength: user.password ? user.password.length : 0
      });
    } else {
      res.json({ found: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Test user endpoint error:', error);
    res.status(500).json({ message: 'Error testing user lookup', error: error.message });
  }
});

module.exports = router;
