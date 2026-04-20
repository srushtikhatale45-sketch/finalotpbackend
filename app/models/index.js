const { sequelize } = require('../config/database');
const User = require('./User');
const OTP = require('./OTP');

// Define associations
User.hasMany(OTP, { 
  foreignKey: 'phone_number', 
  sourceKey: 'mobile_number',
  constraints: false 
});
OTP.belongsTo(User, { 
  foreignKey: 'phone_number', 
  targetKey: 'mobile_number',
  constraints: false 
});

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ All models synced successfully');
    
    // Verify tables were created
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('📊 Tables in database:', tables);
    
    return true;
  } catch (error) {
    console.error('❌ Error syncing models:', error);
    return false;
  }
};

module.exports = { User, OTP, syncDatabase };