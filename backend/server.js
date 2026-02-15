const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Netlify se connect karne ke liye zaroori

dotenv.config();

const app = express();

// ===========================================
// 1. MIDDLEWARE (CORS & JSON)
// ===========================================
app.use(cors()); // Ye line sabse important hai Frontend connection ke liye
app.use(express.json());

// ===========================================
// 2. ROUTES
// ===========================================
// Aapke routes folder ke hisaab se paths
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/teacher', require('./routes/teacherRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));

// ===========================================
// 3. DATABASE CONNECTION (FIXED LINK)
// ===========================================
// Maine aapke screenshot se ye sahi link banaya hai.
// Password 'admin123' maine assume kiya hai.
const MONGO_URI = 'mongodb+srv://kaifr672_db_user:admin123@cluster0.gwyxct9.mongodb.net/college-app?retryWrites=true&w=majority';

console.log("Attempting to connect to DB...");

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => {
      console.log("❌ MongoDB Connection Error:", err);
      // Agar password galat hoga, toh error yahin dikh jayega
  });

// ===========================================
// 4. SERVER START
// ===========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Home Route (Server check karne ke liye)
app.get('/', (req, res) => {
    res.send("API is Running...");
});