const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  records: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
      status: { type: String } // "Present" or "Absent"
    }
  ]
});

module.exports = mongoose.model('Attendance', AttendanceSchema);