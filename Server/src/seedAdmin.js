// src/seedAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const adminExists = await User.findOne({ 
      email: process.env.ADMIN_EMAIL 
    });

    if (!adminExists) {
      const admin = await User.create({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        dateOfBirth: process.env.ADMIN_DOB || '1990-09-29',
        gender: process.env.ADMIN_GENDER || 'male',
        role: 'admin',
        isActive: true,
      });
      console.log('✅ Admin user created successfully!');
      console.log(`   👤 Name: ${admin.name}`);
      console.log(`   📧 Email: ${admin.email}`);
      console.log(`   🎂 DOB: ${admin.dateOfBirth}`);
      console.log(`   ⚥ Gender: ${admin.gender}`);
    } else {
      console.log('✅ Admin user already exists');
      console.log(`   👤 Name: ${adminExists.name}`);
      console.log(`   📧 Email: ${adminExists.email}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();