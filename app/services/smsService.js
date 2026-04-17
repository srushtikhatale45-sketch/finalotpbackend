const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const sendOTPviaSMS = async (phoneNumber, otpCode) => {
  try {
    // For development, just log the OTP
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║           📱 SMS OTP SENT                   ║');
    console.log('╠════════════════════════════════════════════╣');
    console.log(`║ Phone: ${phoneNumber.padEnd(38)}║`);
    console.log(`║ OTP:   ${otpCode.padEnd(38)}║`);
    console.log('╚════════════════════════════════════════════╝\n');
    
    // If you have actual SMS API, uncomment and configure below:
    // const username = process.env.SMS_USERNAME;
    // const password = process.env.SMS_PASSWORD;
    // const senderId = process.env.SMS_SENDER;
    // const message = `Your OTP is: ${otpCode}`;
    // const url = `https://your-sms-api.com/send?username=${username}&password=${password}&to=${phoneNumber}&message=${message}&sender=${senderId}`;
    // await axios.get(url);
    
    return true;
  } catch (error) {
    console.error('SMS sending failed:', error);
    return false;
  }
};

module.exports = { sendOTPviaSMS };