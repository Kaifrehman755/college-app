const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Department hata diya kyunki frontend se nahi bhej rahe
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }] 
});

module.exports = mongoose.model('Class', classSchema);