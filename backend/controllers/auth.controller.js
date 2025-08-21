const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Does it find the user?
    const user = await User.findOne({ email });
    if (!user) {
      // This could be the cause. Is the user in the database?
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Does the password match?
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // 3. Is the JWT token being created correctly?
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    // Check Vercel logs for this error message
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = {
  login
};
