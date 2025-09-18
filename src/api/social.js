import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

// Helper to get auth headers
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Search for users
export const searchUsers = async (query) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/users/search?q=${encodeURIComponent(query)}`, { headers });
    return response.data || [];
  } catch (error) {
    console.error('Error searching users:', error);
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Send friend request
export const sendFriendRequest = async (userId, friendId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_URL}/friends/request`, { user_id: userId, friend_id: friendId }, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get pending friend requests
export const getFriendRequests = async (userId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/friends/requests/${userId}`, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Accept or reject friend request
export const respondToFriendRequest = async (requestId, status) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.put(`${API_URL}/friends/request/${requestId}`, { status }, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get friends list
export const getFriends = async (userId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/friends/${userId}`, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Share a workout
export const shareWorkout = async (userId, workoutId, caption, visibility = 'friends', image = null) => {
  try {
    const headers = await getAuthHeaders();
    
    console.log('Sharing workout with image:', !!image);
    console.log('Image details:', image ? { uri: image.uri, type: image.type, fileName: image.fileName } : 'No image');
    
    // If there's an image, convert to base64 and send as JSON
    if (image) {
      try {
        // Convert image to base64
        const response = await fetch(image.uri);
        const blob = await response.blob();
        
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async () => {
            const base64 = reader.result;
            console.log('Image converted to base64, length:', base64.length);
            
            try {
              const response = await axios.post(`${API_URL}/social/share`, {
                user_id: userId,
                workout_id: workoutId,
                caption,
                visibility,
                image_base64: base64,
                image_type: image.type || 'image/jpeg'
              }, { headers });
              resolve(response.data);
            } catch (error) {
              console.error('Error sending base64 image:', error);
              reject(error.response ? error.response.data : { message: 'Network error' });
            }
          };
          reader.onerror = () => reject(new Error('Failed to convert image to base64'));
          reader.readAsDataURL(blob);
        });
      } catch (conversionError) {
        console.error('Error converting image to base64:', conversionError);
        throw new Error('Failed to process image');
      }
    } else {
      // Regular JSON request without image
      console.log('Sending JSON request without image');
      const response = await axios.post(`${API_URL}/social/share`, {
        user_id: userId,
        workout_id: workoutId,
        caption,
        visibility
      }, { headers });
      return response.data;
    }
  } catch (error) {
    console.error('Error in shareWorkout:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get social feed
export const getSocialFeed = async (userId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/social/feed/${userId}`, { 
      headers,
      timeout: 10000 // 10 second timeout
    });
    return response.data;
  } catch (error) {
    console.error('Social feed API error:', error);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - please check your connection');
    }
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Like a shared workout
export const likeWorkout = async (userId, sharedWorkoutId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_URL}/social/like`, {
      user_id: userId,
      shared_workout_id: sharedWorkoutId
    }, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Unlike a shared workout
export const unlikeWorkout = async (userId, sharedWorkoutId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.delete(`${API_URL}/social/like`, {
      headers,
      data: {
        user_id: userId,
        shared_workout_id: sharedWorkoutId
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Comment on a shared workout
export const commentOnWorkout = async (userId, sharedWorkoutId, comment) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_URL}/social/comment`, {
      user_id: userId,
      shared_workout_id: sharedWorkoutId,
      comment
    }, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get comments for a shared workout
export const getWorkoutComments = async (sharedWorkoutId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/social/comments/${sharedWorkoutId}`, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Like a comment
export const likeComment = async (userId, commentId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_URL}/social/comment/like`, {
      user_id: userId,
      comment_id: commentId
    }, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Unlike a comment
export const unlikeComment = async (userId, commentId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.delete(`${API_URL}/social/comment/like`, {
      headers,
      data: {
        user_id: userId,
        comment_id: commentId
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/users/profile/${userId}`, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get user workouts
export const getUserWorkouts = async (userId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/users/workouts/${userId}`, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Follow a user
export const followUser = async (userId, targetUserId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_URL}/social/follow`, {
      user_id: userId,
      target_user_id: targetUserId
    }, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Unfollow a user
export const unfollowUser = async (userId, targetUserId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.delete(`${API_URL}/social/follow`, {
      headers,
      data: {
        user_id: userId,
        target_user_id: targetUserId
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};