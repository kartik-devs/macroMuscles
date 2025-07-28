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