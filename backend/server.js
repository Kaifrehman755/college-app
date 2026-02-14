require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();

// --- 1. MIDDLEWARE ---
app.use(express.json());
app.use(cors());

// --- 2. ROUTES ---
// Login & Auth
app.use('/auth', require('./routes/authRoutes'));

// Admin Routes (Manage Class, Teachers, Students)
app.use('/admin', require('./routes/adminRoutes'));

// Teacher Routes (Take Attendance)
app.use('/teacher', require('./routes/teacherRoutes'));

// Student Routes (Check Attendance) - NEW ✅
app.use('/student', require('./routes/studentRoutes')); 

// --- 3. DATABASE CONNECTION & SERVER START ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:admin123@cluster0.mongodb.net/college-app?retryWrites=true&w=majority'; 

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    
    // --- AUTO ADMIN CREATION ---
    // Server start hone par check karega ki Admin hai ya nahi
    const adminExists = await User.findOne({ email: 'admin@final.com' });
    
    if (!adminExists) {
      console.log("Creating Admin Account...");
      await User.create({
        email: 'admin@final.com', 
        password: 'admin123', // Password will be hashed by User.js
        role: 'admin'
      });
      console.log('>>> Admin Created! Login: admin@final.com / admin123');
    }
  })
  .catch(err => console.log("DB Error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));