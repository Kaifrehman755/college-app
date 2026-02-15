const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Password secure karne ke liye

dotenv.config();
const app = express();

// ===========================================
// 1. MIDDLEWARE
// ===========================================
app.use(cors()); // Frontend connection ke liye zaroori
app.use(express.json());

// ===========================================
// 2. DATABASE CONNECTION (FIXED LINK)
// ===========================================
// Aapka verified sahi link
const MONGO_URI = 'mongodb+srv://kaifr672_db_user:admin123@cluster0.gwyxct9.mongodb.net/college-app?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// ===========================================
// 3. MAGIC ROUTE: CREATE ADMIN (Sirf ek baar use karein)
// ===========================================
// Is route ko hum browser se hit karenge taaki Admin ban jaye
app.get('/api/create-admin', async (req, res) => {
    try {
        // Hamein User Model chahiye. Agar aapka path alag hai to check kar lena.
        // Zyadatar ye './models/User' ya './models/user' hota hai.
        const User = require('./models/User'); 

        const existingAdmin = await User.findOne({ email: "admin@final.com" });
        if (existingAdmin) {
            return res.send("⚠️ Admin pehle se bana hua hai! Seedha Login karo.");
        }

        // Password Hash karna (Security)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);

        const newAdmin = new User({
            name: "College Admin",
            email: "admin@final.com",
            password: hashedPassword,
            role: "admin", // Agar aapke schema mein 'isAdmin: true' hai, to wo use karein
            isAdmin: true  // Safety ke liye dono daal raha hoon
        });

        await newAdmin.save();
        res.send("🎉 MUBARAK HO! Admin User Ban Gaya. Ab Login Karein: admin@final.com / admin123");

    } catch (error) {
        console.error(error);
        res.status(500).send("❌ Error creating admin: " + error.message);
    }
});

// ===========================================
// 4. REGULAR ROUTES
// ===========================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/teacher', require('./routes/teacherRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));

// ===========================================
// 5. SERVER START
// ===========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));