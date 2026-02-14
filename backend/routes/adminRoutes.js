const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const Student = require('../models/Student');
const User = require('../models/User');

// ==========================================
// 1. CLASS MANAGEMENT
// ==========================================

// Create Class
router.post('/class', async (req, res) => {
  try {
    console.log("Adding Class:", req.body);
    const newClass = new Class(req.body);
    await newClass.save();
    console.log("Class Saved Successfully!");
    res.json(newClass);
  } catch (err) {
    console.error("Error Saving Class:", err);
    res.status(500).json(err);
  }
});

// Get All Classes
router.get('/class', async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ==========================================
// 2. STUDENT MANAGEMENT (With Limit & Auto-Login)
// ==========================================

// Add Student
router.post('/student', async (req, res) => {
  const { name, rollNo, classId } = req.body;

  try {
    // --- CHECK 1: STUDENT LIMIT (SRS Requirement) ---
    // Check karein ki is class me pehle se kitne students hain
    const currentCount = await Student.countDocuments({ classId });
    
    if (currentCount >= 10) {
      return res.status(400).json({ msg: "Class is Full! Maximum 10 students allowed." });
    }

    console.log(`Adding Student ${name} (${rollNo}) to Class...`);

    // --- STEP 2: SAVE STUDENT DATA ---
    const student = new Student({ name, rollNo, classId });
    await student.save();

    // --- STEP 3: CREATE LOGIN ACCOUNT ---
    // Email: rollno@student.com (e.g., 101@student.com)
    // Password: 123456 (Default)
    const loginEmail = `${rollNo}@student.com`;
    
    // Check if user already exists
    const userExists = await User.findOne({ email: loginEmail });
    if (!userExists) {
      await User.create({
        email: loginEmail,
        password: '123456', // User model automatically hashes this
        role: 'student',
        name: name
      });
      console.log(`Login Created: ${loginEmail}`);
    }

    res.json(student);

  } catch (err) {
    console.error("Error Adding Student:", err);
    res.status(500).json(err);
  }
});

// Get Students by Class
router.get('/student/:classId', async (req, res) => {
  try {
    const students = await Student.find({ classId: req.params.classId });
    res.json(students);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ==========================================
// 3. TEACHER MANAGEMENT
// ==========================================

// Create Teacher Account
router.post('/teacher', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    console.log("Creating Teacher:", email);
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User already exists" });

    const teacher = new User({ 
        name, 
        email, 
        password, 
        role: 'teacher' 
    });
    
    await teacher.save();
    console.log("Teacher Account Created!");
    res.json(teacher);

  } catch (err) {
    console.error("Error Creating Teacher:", err);
    res.status(500).json(err);
  }
});

// Get All Teachers
router.get('/teacher', async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' });
    res.json(teachers);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ==========================================
// 4. DEPARTMENT MANAGEMENT (Placeholder)
// ==========================================
router.get('/department', async (req, res) => {
    // Abhi ke liye static data bhej rahe hain
    res.json([
        { _id: '1', name: 'Computer Science' }, 
        { _id: '2', name: 'Commerce' },
        { _id: '3', name: 'Artificial Intelligence' }
    ]);
});

module.exports = router;