import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';
import { resetToLogin } from '../navigation/navigationRef';

// Helper to get token
export const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  console.log('Loaded token:', token);
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  return token;
};

// Initialize axios auth header from stored token (call at app start)
export const initAuth = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    // Install a single interceptor (idempotent guard)
    if (!axios.__installedAuthInterceptor) {
      axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          const status = error?.response?.status;
          const message = error?.response?.data?.message || '';
          if (status === 401 || status === 403 || message.includes('Invalid Token')) {
            try {
              await AsyncStorage.multiRemove(['token', 'userData']);
              delete axios.defaults.headers.common['Authorization'];
            } catch {}
            resetToLogin();
          }
          return Promise.reject(error);
        }
      );
      axios.__installedAuthInterceptor = true;
    }
  } catch {}
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data && response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      console.log('Saved token:', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    // Store user data in AsyncStorage
    if (response.data && response.data.user) {
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get current user ID
export const getCurrentUserId = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      // MongoDB uses _id, not id
      return user._id || user.id;
    }
    return null;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem('userData');
    await AsyncStorage.removeItem('token');
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
}; 

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
}; 

