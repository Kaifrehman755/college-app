const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ==========================================
// 1. FINAL REPAIR ROUTE (Isse Browser mein kholna hai)
// ==========================================
router.get('/repair-admin', async (req, res) => {
    try {
        // Purana user delete karo
        await User.deleteOne({ email: "admin@final.com" });

        // Naya Hash Render Server par hi banao
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);

        // Naya User create karo
        const newAdmin = new User({
            name: "Render Admin",
            email: "admin@final.com",
            password: admin123,
            role: "admin",
            isAdmin: true
        });

        await newAdmin.save();
        res.send("<h1>✅ REPAIR COMPLETE</h1> <p>User: admin@final.com <br> Pass: admin123 <br><br> <b>AB LOGIN KARO!</b></p>");
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

// ==========================================
// 2. LOGIN ROUTE (Debug Mode)
// ==========================================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`👉 Login Attempt: ${email} | Pass Length: ${password.length}`);

    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log("❌ User Not Found");
            return res.status(400).json({ msg: "User not found" });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log("❌ Password Mismatch!");
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        console.log("🎉 SUCCESS! Password Matched.");
        
        // Token Generate
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, "secret_token_123", { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, role: user.role });
        });

    } catch (err) {
        console.error("Server Error:", err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;