

// Profile Picture APIs
export const uploadProfilePicture = async (userId, imageUrl) => {
  try {
    const response = await fetch(`${API_URL}/profile-picture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, image_url: imageUrl }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Upload profile picture error:', error);
    throw new Error('Failed to upload profile picture');
  }
};

export const getProfilePicture = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/profile-picture/${userId}`);
    if (!response.ok) throw new Error('API not available');
    return await response.json();
  } catch (error) {
    // Return null if API fails
    return null;
  }
};

// Friends APIs
export const sendFriendRequest = async (userId, friendId) => {
  try {
    const response = await fetch(`${API_URL}/friends/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, friend_id: friendId }),
    });
    return await response.json();
  } catch (error) {
    throw new Error('Failed to send friend request');
  }
};

export const acceptFriendRequest = async (userId, friendId) => {
  try {
    const response = await fetch(`${API_URL}/friends/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, friend_id: friendId }),
    });
    return await response.json();
  } catch (error) {
    throw new Error('Failed to accept friend request');
  }
};

export const getFriends = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/friends/${userId}`);
    if (!response.ok) throw new Error('API not available');
    return await response.json();
  } catch (error) {
    // Return mock data if API fails
    return [];
  }
};

export const getFriendRequests = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/friends/requests/${userId}`);
    if (!response.ok) throw new Error('API not available');
    return await response.json();
  } catch (error) {
    // Return mock data if API fails
    return [];
  }
};

// Settings APIs
export const updateUserSettings = async (userId, settings) => {
  try {
    const response = await fetch(`${API_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, ...settings }),
    });
    return await response.json();
  } catch (error) {
    throw new Error('Failed to update settings');
  }
};

export const getUserSettings = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/settings/${userId}`);
    if (!response.ok) throw new Error('API not available');
    return await response.json();
  } catch (error) {
    // Return mock data if API fails
    return {
      user_id: userId,
      notifications_enabled: true,
      privacy_mode: 'public',
      theme: 'light',
      units: 'metric',
      language: 'en'
    };
  }
};

// Gamification APIs
export const getUserLevel = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/level/${userId}`);
    if (!response.ok) throw new Error('API not available');
    return await response.json();
  } catch (error) {
    // Return mock data if API fails
    return {
      user_id: userId,
      level: 1,
      experience_points: 0
    };
  }
};

export const updateUserLevel = async (userId, experiencePoints) => {
  try {
    const response = await fetch(`${API_URL}/level/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, experience_points: experiencePoints }),
    });
    return await response.json();
  } catch (error) {
    throw new Error('Failed to update user level');
  }
};

export const getUserBadges = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/badges/${userId}`);
    if (!response.ok) throw new Error('API not available');
    return await response.json();
  } catch (error) {
    // Return mock data if API fails
    return [];
  }
};

export const awardBadge = async (userId, badgeId) => {
  try {
    const response = await fetch(`${API_URL}/badges/award`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, badge_id: badgeId }),
    });
    return await response.json();
  } catch (error) {
    throw new Error('Failed to award badge');
  }
};

// Workout Sharing APIs
export const shareWorkout = async (userId, workoutData) => {
  try {
    const response = await fetch(`${API_URL}/workouts/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, ...workoutData }),
    });
    return await response.json();
  } catch (error) {
    throw new Error('Failed to share workout');
  }
};

export const getSharedWorkouts = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/workouts/shared/${userId}`);
    return await response.json();
  } catch (error) {
    throw new Error('Failed to get shared workouts');
  }
};

export const likeWorkout = async (userId, workoutId) => {
  try {
    const response = await fetch(`${API_URL}/workouts/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, shared_workout_id: workoutId }),
    });
    return await response.json();
  } catch (error) {
    throw new Error('Failed to like workout');
  }
};