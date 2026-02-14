const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // <--- YE SABSE ZAROORI HAI (Netlify ke liye)

dotenv.config();

const app = express();

// ===========================================
// 1. MIDDLEWARE (CORS Fix)
// ===========================================
app.use(cors()); 
// Iska matlab: "Duniya ki koi bhi website (Netlify included) is server se data le sakti hai."
// Bina iske, browser login block kar dega.

app.use(express.json()); // JSON data padhne ke liye

// ===========================================
// 2. ROUTES
// ===========================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/teacher', require('./routes/teacherRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));

// ===========================================
// 3. DATABASE CONNECTION
// ===========================================
// Agar .env file nahi mili, toh hardcoded link use karega (Backup ke liye)
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:admin123@cluster0.mongodb.net/college-app?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// ===========================================
// 4. START SERVER
// ===========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));