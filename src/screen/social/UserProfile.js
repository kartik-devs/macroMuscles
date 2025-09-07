import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentUserId } from '../../api/auth';
import { getUserProfile, getUserWorkouts, followUser, unfollowUser } from '../../api/social';

export default function UserProfile({ route, navigation }) {
  const { userId: profileUserId } = route.params;
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('workouts');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentId = await getCurrentUserId();
      setCurrentUserId(currentId);
      
      // Load profile data
      await loadProfileData(profileUserId);
      await loadUserWorkouts(profileUserId);
      await loadUserAchievements(profileUserId);
      
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadProfileData = async (userId) => {
    try {
      const profileData = await getUserProfile(userId);
      setUserProfile(profileData);
    } catch (error) {
      console.error('Error loading profile data:', error);
      // Fallback to mock data if API fails
      setUserProfile({
        id: userId,
        name: 'User',
        email: 'user@example.com',
        bio: 'Fitness enthusiast 💪',
        joinDate: new Date().toISOString(),
        followersCount: 0,
        followingCount: 0,
        workoutsCount: 0,
        profileImage: null
      });
    }
  };

  const loadUserWorkouts = async (userId) => {
    try {
      const workoutsData = await getUserWorkouts(userId);
      setWorkouts(workoutsData);
    } catch (error) {
      console.error('Error loading user workouts:', error);
      setWorkouts([]);
    }
  };

  const loadUserAchievements = async (userId) => {
    // Mock data - replace with actual API call
    setAchievements([
      {
        id: 1,
        title: 'First Workout',
        description: 'Completed your first workout',
        icon: 'trophy',
        date: '2024-01-15'
      },
      {
        id: 2,
        title: 'Week Warrior',
        description: 'Worked out 7 days in a row',
        icon: 'flame',
        date: '2024-01-22'
      }
    ]);
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(currentUserId, profileUserId);
        setIsFollowing(false);
        setUserProfile(prev => ({
          ...prev,
          followersCount: prev.followersCount - 1
        }));
        Alert.alert('Success', 'Unfollowed user');
      } else {
        await followUser(currentUserId, profileUserId);
        setIsFollowing(true);
        setUserProfile(prev => ({
          ...prev,
          followersCount: prev.followersCount + 1
        }));
        Alert.alert('Success', 'Following user');
      }
    } catch (error) {
      console.error('Error following user:', error);
      Alert.alert('Error', 'Failed to follow user');
    }
  };

  const renderWorkoutItem = ({ item }) => (
    <View style={styles.workoutItem}>
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutType}>{item.workout_type || item.type}</Text>
        <Text style={styles.workoutDate}>
          {new Date(item.completed_at || item.date).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.workoutStats}>
        <View style={styles.statItem}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.statText}>{item.duration || 0} min</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="flame-outline" size={16} color="#666" />
          <Text style={styles.statText}>{item.calories_burned || item.calories || 0} cal</Text>
        </View>
      </View>
    </View>
  );

  const renderAchievementItem = ({ item }) => (
    <View style={styles.achievementItem}>
      <View style={styles.achievementIcon}>
        <Ionicons name={item.icon} size={24} color="#E53935" />
      </View>
      <View style={styles.achievementContent}>
        <Text style={styles.achievementTitle}>{item.title}</Text>
        <Text style={styles.achievementDescription}>{item.description}</Text>
        <Text style={styles.achievementDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E53935" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userProfile?.name?.charAt(0) || 'U'}</Text>
            </View>
            {profileUserId !== currentUserId && (
              <TouchableOpacity 
                style={[styles.followButton, isFollowing && styles.followingButton]}
                onPress={handleFollow}
              >
                <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.userName}>{userProfile?.name}</Text>
          <Text style={styles.userBio}>{userProfile?.bio}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProfile?.workoutsCount || 0}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProfile?.followersCount || 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProfile?.followingCount || 0}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'workouts' && styles.activeTab]}
            onPress={() => setActiveTab('workouts')}
          >
            <Text style={[styles.tabText, activeTab === 'workouts' && styles.activeTabText]}>
              Workouts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
            onPress={() => setActiveTab('achievements')}
          >
            <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
              Achievements
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'workouts' && (
          <FlatList
            data={workouts}
            renderItem={renderWorkoutItem}
            keyExtractor={item => (item.id || item._id || Math.random()).toString()}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="fitness-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>No workouts yet</Text>
              </View>
            }
          />
        )}

        {activeTab === 'achievements' && (
          <FlatList
            data={achievements}
            renderItem={renderAchievementItem}
            keyExtractor={item => (item.id || item._id || Math.random()).toString()}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="trophy-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>No achievements yet</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  followButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followingButton: {
    backgroundColor: '#f0f2f5',
    borderWidth: 1,
    borderColor: '#E53935',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  followingButtonText: {
    color: '#E53935',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userBio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#E53935',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#E53935',
    fontWeight: 'bold',
  },
  workoutItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  workoutType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  workoutDate: {
    fontSize: 14,
    color: '#666',
  },
  workoutStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  achievementItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});
