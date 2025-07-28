import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

// Helper to get auth headers
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Save challenge progress
export async function saveChallengeProgress(data) {
  try {
    const headers = await getAuthHeaders();
    const res = await axios.post(`${API_URL}/challenge-progress`, data, { headers });
    return res.data;
  } catch (err) {
    console.log('saveChallengeProgress error:', err);
    throw err.response ? err.response.data : { message: 'Network error' };
  }
}

// Get challenge progress
export async function getChallengeProgress(userId, challengeName) {
  try {
    const headers = await getAuthHeaders();
    const name = encodeURIComponent(challengeName);
    const res  = await axios.get(`${API_URL}/challenge-progress/${userId}/${name}`, { headers });
    return res.data;
  } catch (err) {
    console.log('getChallengeProgress error:', err);
    throw err.response ? err.response.data : { message: 'Network error' };
  }
}