const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Attendance = require('../models/Attendance'); // Ensure this model exists

// 1. Get All Classes (Teacher needs to select a class)
// We can reuse the Class model or just fetch from the same place
const Class = require('../models/Class');

router.get('/classes', async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) { res.status(500).json(err); }
});

// 2. Get Students of a Class (To show the list)
router.get('/students/:classId', async (req, res) => {
  try {
    const students = await Student.find({ classId: req.params.classId });
    res.json(students);
  } catch (err) { res.status(500).json(err); }
});

// 3. MARK ATTENDANCE (The Main Feature)
router.post('/attendance', async (req, res) => {
  try {
    const { date, classId, records } = req.body; 
    // records = [ { studentId: "123", status: "Present" }, ... ]

    const newAttendance = new Attendance({
      date,
      classId,
      records
    });

    await newAttendance.save();
    console.log("Attendance Saved for:", date);
    res.json({ msg: "Success" });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;