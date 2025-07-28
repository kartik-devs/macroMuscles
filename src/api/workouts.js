import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

// Helper to get auth headers
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Save workout history
export const saveWorkoutHistory = async (workoutData) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_URL}/workout-history`, workoutData, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get workout history for a user
export const getWorkoutHistory = async (userId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/workout-history/${userId}`, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
}; 