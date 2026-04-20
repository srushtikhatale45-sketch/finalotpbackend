const { sequelize, connectDB } = require('./config/database');
const User = require('./models/User');
const OTP = require('./models/OTP');

async function testDatabase() {
  console.log('🔍 Testing Database Connection...\n');
  
  try {
    // Connect to database
    await connectDB();
    
    // Sync all models
    await sequelize.sync({ force: true });
    console.log('✅ Tables created successfully!\n');
    
    // List all tables
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('📊 Tables in database:');
    tables.forEach(table => console.log(`   - ${table}`));
    
    // Test creating a user
    console.log('\n📝 Testing user creation...');
    const user = await User.create({
      name: 'Test User',
      mobileNumber: '9876543210',
      isVerified: true,
      preferredChannel: 'sms'
    });
    console.log('✅ User created:', user.toJSON());
    
    // Test creating an OTP
    console.log('\n📝 Testing OTP creation...');
    const otp = await OTP.create({
      phoneNumber: '9876543210',
      otpCode: '123456',
      channel: 'sms',
      expiresAt: new Date(Date.now() + 5 * 60000),
      attempts: 0
    });
    console.log('✅ OTP created:', otp.toJSON());
    
    console.log('\n🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await sequelize.close();
  }
}

testDatabase();