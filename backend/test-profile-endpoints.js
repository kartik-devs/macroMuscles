const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

// Test profile endpoints
async function testProfileEndpoints() {
  try {
    console.log('Testing profile endpoints...');
    
    // Test health endpoint
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check:', health.data);
    
    // Test user registration
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    try {
      const register = await axios.post(`${API_URL}/register`, registerData);
      console.log('✅ User registration:', register.data);
    } catch (error) {
      if (error.response?.data?.message === 'Email already in use') {
        console.log('✅ User already exists, continuing...');
      } else {
        throw error;
      }
    }
    
    // Test login
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const login = await axios.post(`${API_URL}/login`, loginData);
    console.log('✅ User login successful');
    
    const token = login.data.token;
    const userId = login.data.user._id;
    const headers = { Authorization: `Bearer ${token}` };
    
    // Test profile endpoints
    const profile = await axios.get(`${API_URL}/profile/${userId}`, { headers });
    console.log('✅ Get profile:', profile.data);
    
    // Test statistics
    const stats = await axios.get(`${API_URL}/statistics/${userId}`);
    console.log('✅ Get statistics:', stats.data);
    
    // Test achievements
    const achievements = await axios.get(`${API_URL}/achievements/${userId}`);
    console.log('✅ Get achievements:', achievements.data);
    
    // Test personal bests
    const personalBests = await axios.get(`${API_URL}/personal-bests/${userId}`);
    console.log('✅ Get personal bests:', personalBests.data);
    
    // Test new endpoints
    const bodyMeasurements = await axios.get(`${API_URL}/body-measurements/${userId}`, { headers });
    console.log('✅ Get body measurements:', bodyMeasurements.data);
    
    const weeklyProgress = await axios.get(`${API_URL}/progress/weekly/${userId}`, { headers });
    console.log('✅ Get weekly progress:', weeklyProgress.data);
    
    const recentActivity = await axios.get(`${API_URL}/activity/recent/${userId}`, { headers });
    console.log('✅ Get recent activity:', recentActivity.data);
    
    const weeklyCalendar = await axios.get(`${API_URL}/calendar/weekly/${userId}`, { headers });
    console.log('✅ Get weekly calendar:', weeklyCalendar.data);
    
    const userLevel = await axios.get(`${API_URL}/profile/level/${userId}`, { headers });
    console.log('✅ Get user level:', userLevel.data);
    
    const userBadges = await axios.get(`${API_URL}/profile/badges/${userId}`, { headers });
    console.log('✅ Get user badges:', userBadges.data);
    
    console.log('\n🎉 All profile endpoints are working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing endpoints:', error.response?.data || error.message);
  }
}

// Run the test
testProfileEndpoints();