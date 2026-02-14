const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true }, // Frontend sends 'rollNo', so this must match
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  attendance: [{ date: String, status: String }]
});

module.exports = mongoose.model('Student', StudentSchema);