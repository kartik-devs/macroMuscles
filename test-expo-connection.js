// Test script for Expo iOS connectivity
const axios = require('axios');

const testUrls = [
  'http://localhost:3000/api',
  'http://192.168.1.4:3000/api',
  // Add your ngrok URL here if using it
  // 'https://your-ngrok-url.ngrok.io/api'
];

async function testConnection(url) {
  try {
    console.log(`Testing: ${url}`);
    const response = await axios.get(url + '/test');
    console.log(`✅ ${url} - Status: ${response.status}`);
  } catch (error) {
    console.log(`❌ ${url} - Error: ${error.message}`);
  }
}

async function runTests() {
  console.log('🔍 Testing Expo iOS connectivity...\n');
  
  for (const url of testUrls) {
    await testConnection(url);
  }
  
  console.log('\n📱 Expo iOS Simulator: Use localhost:3000');
  console.log('📱 Expo Physical iOS: Use tunnel or ngrok');
  console.log('🤖 Expo Android: Use 10.0.2.2:3000 (emulator)');
}

runTests(); 