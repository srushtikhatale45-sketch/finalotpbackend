const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

// Go up two levels to find the root .env file
// From: backend/app/config/database.js
// To:   backend/.env
const envPath = path.join(__dirname, '../../.env');
console.log('📁 Looking for .env at:', envPath);

dotenv.config({ path: envPath });

console.log('🔑 DATABASE_URL exists:', !!process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env file');
  console.error('Please create .env file at:', envPath);
  process.exit(1);
}

// Initialize Sequelize with Neon PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully via Neon');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to database:', error.message);
    return false;
  }
};

module.exports = { sequelize, connectDB };