// Test script to verify API connectivity
const axios = require('axios');

const testUrls = [
  'http://localhost:3000/api',
  'http://192.168.1.4:3000/api',
  'http://10.0.2.2:3000/api'
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
  console.log('🔍 Testing API connectivity...\n');
  
  for (const url of testUrls) {
    await testConnection(url);
  }
  
  console.log('\n📱 For iOS Simulator: Use localhost:3000');
  console.log('📱 For Physical iOS: Must be on same WiFi network');
  console.log('🤖 For Android: Use 10.0.2.2:3000 (emulator) or 192.168.1.4:3000 (physical)');
}

runTests(); 