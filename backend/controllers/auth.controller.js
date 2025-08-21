const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Username:', username);
    console.log('Password provided:', password ? 'Yes' : 'No');
    console.log('Request body:', req.body);
    
    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    console.log('Looking for user in database...');
    const user = await User.findOne({ username });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('No user found with username:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('User details from database:');
    console.log('- ID:', user._id);
    console.log('- Username:', user.username);
    console.log('- Role:', user.role);
    console.log('- Stored password hash:', user.password);
    console.log('- Password hash length:', user.password.length);
    
    console.log('Comparing passwords...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Password validation failed for user:', username);
      console.log('Input password:', password);
      console.log('Stored hash:', user.password);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('Password is valid! Creating JWT token...');
    const jwtSecret = process.env.JWT_SECRET || 'default-jwt-secret-change-in-production';
    
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        role: user.role 
      },
      jwtSecret,
      { expiresIn: '24h' }
    );
    
    console.log('JWT token created successfully');
    console.log('Login successful for user:', username);
    console.log('=== LOGIN SUCCESS ===');
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('=== LOGIN ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  login
};
