// src/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Remove useNewUrlParser and useUnifiedTopology
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.db.databaseName}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('\n💡 Please check:');
    console.error('   1. Your MongoDB password is correct');
    console.error('   2. Your IP is whitelisted in Network Access');
    console.error('   3. Your connection string is correct');
    process.exit(1);
  }
};

module.exports = connectDB;