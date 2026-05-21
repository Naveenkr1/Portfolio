require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Admin } = require('./models');

async function setPassword(password) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await Admin.findOneAndUpdate(
      { username: 'admin' },
      { password: hashedPassword },
      { upsert: true, new: true }
    );

    console.log('Admin password updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to set password:', err);
    process.exit(1);
  }
}

const newPassword = process.argv[2];
if (!newPassword) {
  console.error('Please provide a password: node set-password.js "yourpassword"');
  process.exit(1);
}
setPassword(newPassword);
