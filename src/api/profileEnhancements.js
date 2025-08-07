// Profile Enhancements API functions
import { API_URL } from './config';

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

// Get user's level and experience points
export const getUserLevel = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/profile/level/${userId}`);
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
    const response = await fetch(`${API_URL}/profile/badges/${userId}`);
    if (response.ok) {
      const data = await response.json();
      return data.badges || [];
    }
    // Return default badges if API not available
    return [
      { id: 1, name: 'First Workout', description: 'Complete your first workout', icon: '🏆' },
      { id: 2, name: 'Consistency', description: 'Work out 3 days in a row', icon: '🔥' },
      { id: 3, name: 'Strength', description: 'Lift 100kg total', icon: '💪' }
    ];
  } catch (error) {
    console.log('Error fetching user badges:', error);
    return [
      { id: 1, name: 'First Workout', description: 'Complete your first workout', icon: '🏆' },
      { id: 2, name: 'Consistency', description: 'Work out 3 days in a row', icon: '🔥' },
      { id: 3, name: 'Strength', description: 'Lift 100kg total', icon: '💪' }
    ];
  }
};