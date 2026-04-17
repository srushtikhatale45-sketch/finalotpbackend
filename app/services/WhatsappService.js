const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const sendOTPviaWhatsApp = async (phoneNumber, otpCode) => {
  try {
    const apiKey = process.env.PINBOT_API_KEY;
    const phoneNumberId = process.env.PHONE_NUMBER_ID;
    
    if (!apiKey || apiKey === 'your_pinbot_api_key_here') {
      console.log('⚠️ PinBot API not configured. Using fallback mode.');
      return sendSimulatedWhatsApp(phoneNumber, otpCode);
    }

    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const formattedNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
    const toNumber = parseInt(formattedNumber);
    const apiUrl = `https://partnersv1.pinbot.ai/v3/${phoneNumberId}/messages`;

    const requestBody = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: toNumber,
      type: "text",
      text: {
        body: `Your OTP verification code is: ${otpCode}\nValid for 5 minutes.\nDo not share this code with anyone.`
      }
    };

    console.log('\n📤 Sending OTP via WhatsApp...');
    console.log(`Phone: ${toNumber}`);
    console.log(`OTP: ${otpCode}`);

    const response = await axios.post(apiUrl, requestBody, {
      headers: { 'Content-Type': 'application/json', 'apikey': apiKey },
      timeout: 30000
    });

    console.log('✅ WhatsApp OTP sent successfully');
    return { success: true, channel: 'whatsapp' };
  } catch (error) {
    console.error('❌ WhatsApp failed:', error.message);
    return sendSimulatedWhatsApp(phoneNumber, otpCode);
  }
};

const sendSimulatedWhatsApp = (phoneNumber, otpCode) => {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║         📱 SIMULATED WHATSAPP MESSAGE              ║');
  console.log('╠════════════════════════════════════════════════════╣');
  console.log(`║ Phone: ${phoneNumber.padEnd(44)}║`);
  console.log(`║ OTP:   ${otpCode.padEnd(44)}║`);
  console.log('╚════════════════════════════════════════════════════╝\n');
  return { success: true, channel: 'whatsapp', simulated: true };
};

module.exports = { sendOTPviaWhatsApp, sendSimulatedWhatsApp };