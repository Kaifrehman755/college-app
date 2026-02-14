const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if User Exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    // 2. Validate Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // 3. Generate Token (Payload includes Email & Name)
    // Ye step sabse important hai student dashboard ke liye
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role, 
        email: user.email, // <--- Added Email
        name: user.name    // <--- Added Name
      }, 
      'secret_key', // Production me ise .env file me rakhein
      { expiresIn: '1d' }
    );

    // 4. Send Response
    res.json({ 
      token, 
      role: user.role,
      user: { name: user.name, email: user.email } 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;