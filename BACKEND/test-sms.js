import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

async function testTwilioSMS() {
  console.log('Testing Twilio SMS Configuration...\n');
  
  // Check environment variables
  console.log('Environment Variables:');
  console.log(`TWILIO_ACCOUNT_SID: ${process.env.TWILIO_ACCOUNT_SID ? '✓ Set' : '✗ Missing'}`);
  console.log(`TWILIO_AUTH_TOKEN: ${process.env.TWILIO_AUTH_TOKEN ? '✓ Set' : '✗ Missing'}`);
  console.log(`TWILIO_PHONE_NUMBER: ${process.env.TWILIO_PHONE_NUMBER || '✗ Missing'}\n`);
  
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    console.error('❌ Missing required Twilio environment variables');
    return;
  }
  
  try {
    // Initialize Twilio client
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    console.log('✓ Twilio client initialized successfully\n');
    
    // Test account info
    console.log('Fetching account information...');
    const account = await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    console.log(`Account Status: ${account.status}`);
    console.log(`Account Type: ${account.type}\n`);
    
    // Test phone number validation
    console.log('Validating phone number...');
    try {
      const phoneNumber = await client.lookups.v1.phoneNumbers(process.env.TWILIO_PHONE_NUMBER).fetch();
      console.log(`Phone Number: ${phoneNumber.phoneNumber}`);
      console.log(`Country Code: ${phoneNumber.countryCode}\n`);
    } catch (lookupError) {
      console.error(`⚠️ Phone number lookup failed: ${lookupError.message}\n`);
    }
    
    // Test sending SMS (you can uncomment and add your phone number for testing)
    /*
    const testPhoneNumber = '+91XXXXXXXXXX'; // Replace with your verified phone number
    console.log(`Sending test SMS to ${testPhoneNumber}...`);
    
    const message = await client.messages.create({
      body: 'Test SMS from your SIH backend service!',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: testPhoneNumber
    });
    
    console.log(`✅ SMS sent successfully! Message SID: ${message.sid}`);
    */
    
    console.log('🎉 Twilio configuration test completed successfully!');
    
  } catch (error) {
    console.error('❌ Twilio test failed:', {
      message: error.message,
      code: error.code,
      status: error.status,
      moreInfo: error.moreInfo
    });
  }
}

// Run the test
testTwilioSMS().catch(console.error);