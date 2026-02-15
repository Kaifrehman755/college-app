const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Aapka User Model (Path check kar lena agar alag ho)
const User = require('./models/User'); 

// 2. Aapka Asli Database Link
const MONGO_URI = 'mongodb+srv://kaifr672_db_user:admin123@cluster0.gwyxct9.mongodb.net/college-app?retryWrites=true&w=majority';

// 3. Connect & Create Function
const seedAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Database Connected Successfully!");

        // Check agar pehle se hai
        const existingUser = await User.findOne({ email: "admin@final.com" });
        if (existingUser) {
            console.log("⚠️ Admin User Pehle se hai!");
            process.exit();
        }

        // Password Hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);

        // Create User
        const newAdmin = new User({
            name: "College Admin",
            email: "admin@final.com",
            password: hashedPassword,
            role: "admin",
            isAdmin: true 
        });

        await newAdmin.save();
        console.log("🎉 SUCCESS! Admin User Ban Gaya.");
        console.log("👉 Ab Login karo: admin@final.com / admin123");

        process.exit();

    } catch (error) {
        console.log("❌ Error:", error);
        process.exit(1);
    }
};

seedAdmin();