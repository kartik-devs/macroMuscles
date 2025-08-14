// Profile Enhancements API functions
import { API_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper to get auth headers
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get user's profile picture
export const getProfilePicture = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/profile/picture/${userId}`);
    if (response.ok) {
      const data = await response.json();
      return data.profile_picture; 
    }
    return null;
  } catch (error) {
    console.log('Error fetching profile picture:', error);
    return null;
  }
};

// Save user's profile picture
export const saveProfilePicture = async (userId, imageUrl) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/profile/picture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({
        user_id: userId,
        image_url: imageUrl
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    throw new Error('Failed to save profile picture');
  } catch (error) {
    console.log('Error saving profile picture:', error);
    throw error;
  }
};

// Get user's level and experience points
export const getUserLevel = async (userId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/profile/level/${userId}`, { headers });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    // Return default level if API not available
    return { level: 1, experience_points: 0 };
  } catch (error) {
    console.log('Error fetching user level:', error);
    return { level: 1, experience_points: 0 };
  }
};

// Get user's badges
export const getUserBadges = async (userId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/profile/badges/${userId}`, { headers });
    if (response.ok) {
      const data = await response.json();
      return data.badges || [];
    }
    // Return default badges if API not available
    return [
      { id: 1, name: 'First Workout', description: 'Complete your first workout', icon: 'fitness', color: '#44bd32' },
      { id: 2, name: 'Consistency', description: 'Work out 3 days in a row', icon: 'flame', color: '#e67e22' },
      { id: 3, name: 'Strength', description: 'Lift 100kg total', icon: 'barbell', color: '#34495e' }
    ];
  } catch (error) {
    console.log('Error fetching user badges:', error);
    return [
      { id: 1, name: 'First Workout', description: 'Complete your first workout', icon: 'fitness', color: '#44bd32' },
      { id: 2, name: 'Consistency', description: 'Work out 3 days in a row', icon: 'flame', color: '#e67e22' },
      { id: 3, name: 'Strength', description: 'Lift 100kg total', icon: 'barbell', color: '#34495e' }
    ];
  }
};

// Available avatar emojis for profile pictures
export const getAvatarEmojis = () => {
  return [
    '💪', '🏋️', '🤸', '🏃', '🚴', '🏊', '⚡', '🔥', '💯', '🎯',
    '🏆', '🥇', '⭐', '🌟', '💎', '👑', '🦾', '🚀', '⚽', '🏀'
  ];
};