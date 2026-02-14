const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

// GET STUDENT ATTENDANCE (By Email/RollNo logic)
router.get('/my-attendance/:email', async (req, res) => {
  try {
    const email = req.params.email;
    // Email format assumed: "101@student.com" -> Extract "101"
    const rollNo = email.split('@')[0]; 

    // 1. Find Student Details
    const student = await Student.findOne({ rollNo });
    if (!student) return res.status(404).json({ msg: "Student not found" });

    // 2. Find All Attendance Records for this Student ID
    // Hum wo saare din dhund rahe hain jab attendance li gayi thi
    const allAttendance = await Attendance.find({ "records.studentId": student._id });

    // 3. Calculate Stats
    let totalClasses = allAttendance.length;
    let presentCount = 0;
    const history = [];

    allAttendance.forEach(day => {
      // Find the specific status for this student on this day
      const record = day.records.find(r => r.studentId.toString() === student._id.toString());
      
      if (record) {
        // --- LOGIC UPDATE FOR LATE STATUS ---
        // Agar 'Present' hai YA 'Late' hai, toh count badhao.
        if (record.status === 'Present' || record.status === 'Late') {
            presentCount++;
        }
        
        history.push({ date: day.date, status: record.status });
      } else {
        // Agar record nahi mila, toh Absent maan lo
        history.push({ date: day.date, status: 'Absent' });
      }
    });

    // Calculate Percentage
    const percentage = totalClasses === 0 ? 0 : ((presentCount / totalClasses) * 100).toFixed(1);

    res.json({
      studentName: student.name,
      percentage,
      totalClasses,
      presentCount,
      history
    });

  } catch (err) {
    console.error("Error fetching student attendance:", err);
    res.status(500).json(err);
  }
});

module.exports = router;