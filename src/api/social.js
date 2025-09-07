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
    
    // If there's an image, use FormData for multipart upload
    if (image) {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('workout_id', workoutId);
      formData.append('caption', caption);
      formData.append('visibility', visibility);
      formData.append('image', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || 'workout_image.jpg'
      });
      
      const response = await axios.post(`${API_URL}/social/share`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } else {
      // Regular JSON request without image
      const response = await axios.post(`${API_URL}/social/share`, {
        user_id: userId,
        workout_id: workoutId,
        caption,
        visibility
      }, { headers });
      return response.data;
    }
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get social feed
export const getSocialFeed = async (userId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/social/feed/${userId}`, { headers });
    return response.data;
  } catch (error) {
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