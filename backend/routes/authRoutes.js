const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // BcryptJS hi use karna
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Path check kar lena

// ROUTE: POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log("👉 Login Request Aayi:", email); // Render Logs mein dikhega

    try {
        // 1. User Dhoondo
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log("❌ User Database mein nahi mila!");
            return res.status(400).json({ msg: "User not found" });
        }

        console.log("✅ User Mil Gaya:", user.email);
        console.log("🔑 Password Check Kar Raha Hoon...");

        // 2. Password Match Karo (Bcrypt compare)
        // Dhyan de: 'password' user ka input hai, 'user.password' DB ka hash hai
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log("❌ Password Match FAIL hua!");
            return res.status(400).json({ msg: "Invalid Credentials (Password Wrong)" });
        }

        console.log("🎉 SUCCESS! Login Ho Gaya");

        // 3. Token Generate
        const payload = {
            user: {
                id: user.id,
                role: user.role // Admin/Student role bhi bhejo
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || "mysecrettoken", // Fallback secret
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role }); // Token aur Role wapas bhejo
            }
        );

    } catch (err) {
        console.error("🔥 Server Error:", err.message);
        res.status(500).send("Server Error");
    }
});

// ==========================================
// FINAL MAGIC RESET ROUTE (Ye password fix karega)
// ==========================================
router.get('/fix-password', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);

        // Ye purane user ka password update kar dega
        await User.findOneAndUpdate(
            { email: "admin@final.com" },
            { password: hashedPassword, role: "admin", isAdmin: true }
        );

        res.send("<h1>✅ PASSWORD FIXED!</h1> <p>Ab jao aur <b>admin123</b> se login karo.</p>");
    } catch (err) {
        res.send("❌ Error: " + err.message);
    }
});

// module.exports = router;  <-- Ye line sabse end mein honi chahiye
//update password route
module.exports = router;