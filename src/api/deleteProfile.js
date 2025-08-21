import { API_URL } from './config';

export const deleteUserProfile = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/profile/delete/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw error;
  }
};