import axios from 'axios';
import { API_URL } from './config';

// Save daily nutrition
export const saveDailyNutrition = async (nutritionData) => {
  try {
    const response = await axios.post(`${API_URL}/nutrition/daily`, nutritionData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get daily nutrition for a specific date
export const getDailyNutrition = async (userId, date) => {
  try {
    const response = await axios.get(`${API_URL}/nutrition/daily/${userId}/${date}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get weekly nutrition data
export const getWeeklyNutrition = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/nutrition/weekly/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Save user goal
export const saveUserGoal = async (goalData) => {
  try {
    const response = await axios.post(`${API_URL}/goals`, goalData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get user's current goal
export const getUserGoal = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/goals/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
}; 