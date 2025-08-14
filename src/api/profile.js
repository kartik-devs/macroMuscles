import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';
  
// Helper to get auth headers
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Save user profile
export const saveUserProfile = async (profileData) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_URL}/profile`, profileData, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/profile/${userId}`, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get workout history
export const getWorkoutHistory = async (userId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/workout-history/${userId}`, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Save personal best
export const savePersonalBest = async (personalBestData) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_URL}/personal-bests`, personalBestData, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get personal bests for a user
export const getPersonalBests = async (userId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/personal-bests/${userId}`, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get user achievements/medals
export const getAchievements = async (userId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/achievements/${userId}`, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get all achievements with progress
export const getAllAchievements = async (userId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/achievements/all/${userId}`, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Track achievement progress
export const trackAchievement = async (userId, achievementType, data) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_URL}/achievements/track`, {
      user_id: userId,
      achievement_type: achievementType,
      ...data
    }, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Track diet
export const trackDiet = async (userId, dietType) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_URL}/diet/track`, {
      user_id: userId,
      diet_type: dietType
    }, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get user statistics
export const getUserStatistics = async (userId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/statistics/${userId}`, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Update user statistics
export const updateUserStatistics = async (statisticsData) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_URL}/statistics/update`, statisticsData, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Save body measurements
export const saveBodyMeasurements = async (measurementData) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_URL}/body-measurements`, measurementData, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get body measurements
export const getBodyMeasurements = async (userId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/body-measurements/${userId}`, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get weekly progress
export const getWeeklyProgress = async (userId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/progress/weekly/${userId}`, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get recent activity
export const getRecentActivity = async (userId, limit = 10) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/activity/recent/${userId}?limit=${limit}`, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get weekly calendar data
export const getWeeklyCalendar = async (userId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/calendar/weekly/${userId}`, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
}; 