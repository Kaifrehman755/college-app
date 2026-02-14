const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' }
});

// --- THE FIX: REMOVED 'next' ---
// With 'async', we just 'return' to finish, or 'throw' to error.
UserSchema.pre('save', async function() {
  // If password is not changed, do nothing and return
  if (!this.isModified('password')) return;

  // Otherwise, hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);