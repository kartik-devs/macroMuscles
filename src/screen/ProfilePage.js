import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

import { 
  getUserProfile, 
  saveUserProfile, 
  getPersonalBests,
  savePersonalBest, 
  getUserStatistics, 
  getAchievements
} from '../api/profile';

import { getCurrentUserId } from '../api/auth';
import { getProfilePicture, getUserLevel, getUserBadges } from '../api/profileEnhancements';
import ProfilePictureUpload from './ProfilePictureUpload';
import { useNavigation } from '@react-navigation/native';

export default function ProfilePage({ route }) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [isViewingFriend, setIsViewingFriend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    display_name: 'User',
    avatar_initial: 'U'
  });
  const [personalBests, setPersonalBests] = useState([]);
  const [userStats, setUserStats] = useState({
    total_workouts: 0,
    total_calories_burned: 0,
    total_workout_time: 0
  });
  const [achievements, setAchievements] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [profilePictureModalVisible, setProfilePictureModalVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [userLevel, setUserLevel] = useState({ level: 1, experience_points: 0 });
  const [bodyMeasurements, setBodyMeasurements] = useState({ weight: null, body_fat_percentage: null });
  const [weeklyProgress, setWeeklyProgress] = useState({ workout_progress: 0, current_streak: 0, weekly_workouts: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [weeklyCalendar, setWeeklyCalendar] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [editForm, setEditForm] = useState({
    display_name: '',
    height: '',
    weight: '',
    age: ''
  });

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const id = await getCurrentUserId();
        setUserId(id);
        
        if (id) {
          // Load user profile
          const profile = await getUserProfile(id);
          setUserProfile(profile);
          setEditForm({
            display_name: profile.display_name || '',
            height: profile.height ? profile.height.toString() : '',
            weight: profile.weight ? profile.weight.toString() : '',
            age: profile.age ? profile.age.toString() : ''
          });
          
          // Load personal bests
          const bests = await getPersonalBests(id);
          setPersonalBests(bests);
          
          // Load user statistics
          const stats = await getUserStatistics(id);
          setUserStats(stats);
          // Load achievements
          const ach = await getAchievements(id);
          setAchievements(ach);
          
          // Load body measurements (placeholder for now)
          setBodyMeasurements({ weight: null, body_fat_percentage: null });
          
          // Load weekly progress (placeholder for now)
          setWeeklyProgress({ workout_progress: 0, current_streak: 0, weekly_workouts: 0 });
          
          // Load recent activity (placeholder for now)
          setRecentActivity([]);
          
          // Load weekly calendar (placeholder for now)
          setWeeklyCalendar([]);
          
          // Load profile picture
          try {
            const profilePic = await getProfilePicture(id);
            setProfilePicture(profilePic);
          } catch (error) {
            console.log('Profile picture API not available');
          }
          
          // Load gamification data
          try {
            const levelData = await getUserLevel(id);
            setUserLevel(levelData);
            
            const badgesData = await getUserBadges(id);
            setUserBadges(badgesData.slice(0, 3)); // Show only first 3 badges
          } catch (error) {
            console.log('Gamification API not available');
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        Alert.alert('Error', 'Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    try {
      if (userId) {
        await saveUserProfile({
          user_id: userId,
          display_name: editForm.display_name,
          avatar_initial: editForm.display_name.charAt(0).toUpperCase(),
          height: editForm.height ? parseFloat(editForm.height) : null,
          weight: editForm.weight ? parseFloat(editForm.weight) : null,
          age: editForm.age ? parseInt(editForm.age) : null
        });
        
        // Update local state
        setUserProfile({
          display_name: editForm.display_name,
          avatar_initial: editForm.display_name.charAt(0).toUpperCase()
        });
        
        setEditModalVisible(false);
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile.');
    }
  };

  const handleAddPersonalBest = async (exerciseName, weight) => {
    try {
      if (userId) {
        await savePersonalBest({
          user_id: userId,
          exercise_name: exerciseName,
          weight: weight,
          date_achieved: new Date().toISOString().split('T')[0]
        });
        
        // Reload personal bests
        const bests = await getPersonalBests(userId);
        setPersonalBests(bests);
        
        Alert.alert('Success', 'Personal best updated!');
      }
    } catch (error) {
      console.error('Error saving personal best:', error);
      Alert.alert('Error', 'Failed to save personal best.');
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };


  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: colors.surface }]}>
          <TouchableOpacity 
            style={[styles.avatarContainer, { backgroundColor: colors.background }]}
            onPress={() => setProfilePictureModalVisible(true)}
          >
            {profilePicture && profilePicture.image_url && !profilePicture.image_url.startsWith('avatar_') ? (
              <Image source={{ uri: profilePicture.image_url }} style={styles.avatarImage} />
            ) : profilePicture && profilePicture.image_url && profilePicture.image_url.startsWith('avatar_') ? (
              <Text style={styles.avatarEmoji}>
                {profilePicture.image_url.split('_')[2] || '💪'}
              </Text>
            ) : (
              <Text style={[styles.avatarText, { color: colors.textInverse }]}>{userProfile.avatar_initial}</Text>
            )}
            <View style={[styles.cameraIcon, { backgroundColor: colors.primary }]}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          
          <Text style={[styles.userName, { color: colors.text }]}>{userProfile.display_name}</Text>
          
          {/* Level Badge */}
          <View style={styles.levelBadge}>
            <Ionicons name="star" size={16} color="#f39c12" />
            <Text style={styles.levelText}>Level {userLevel.level}</Text>
          </View>
          
          <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.surfaceSecondary }]} onPress={handleEditProfile}>
            <Text style={[styles.editButtonText, { color: colors.text }]}>edit</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={[styles.quickActions, { backgroundColor: colors.surface }]}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => Alert.alert('Friends', 'Friends feature coming soon!')}
          >
            <Ionicons name="people" size={24} color="#0097e6" />
            <Text style={[styles.quickActionText, { color: colors.textSecondary }]}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('AchievementsPage')}
          >
            <Ionicons name="trophy" size={24} color="#f39c12" />
            <Text style={[styles.quickActionText, { color: colors.textSecondary }]}>Achievements</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('SettingsPage')}
          >
            <Ionicons name="settings" size={24} color={colors.textTertiary} />
            <Text style={[styles.quickActionText, { color: colors.textSecondary }]}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => Alert.alert('Share Profile', `Check out my fitness journey! Level ${userLevel.level} with ${userStats.total_workouts} workouts completed!`)}
          >
            <Ionicons name="share-social" size={24} color="#44bd32" />
            <Text style={[styles.quickActionText, { color: colors.textSecondary }]}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Overview */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Progress</Text>
            <TouchableOpacity onPress={() => Alert.alert('Progress Details', `Weekly Goal: ${weeklyProgress.weekly_workouts}/${weeklyProgress.weekly_goal || 5} workouts\nCurrent Streak: ${weeklyProgress.current_streak} days`)}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>View Details</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.progressOverview}>
            <View style={styles.progressItem}>
              <View style={[styles.progressCircle, { backgroundColor: colors.primary }]}>
                <Text style={[styles.progressValue, { color: colors.textInverse }]}>{weeklyProgress.workout_progress}%</Text>
              </View>
              <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Workout Goal</Text>
            </View>
            <View style={styles.progressItem}>
              <View style={[styles.progressCircle, { backgroundColor: '#f39c12' }]}>
                <Text style={[styles.progressValue, { color: colors.textInverse }]}>{weeklyProgress.current_streak}</Text>
              </View>
              <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Day Streak</Text>
            </View>
            <View style={styles.progressItem}>
              <View style={[styles.progressCircle, { backgroundColor: '#44bd32' }]}>
                <Text style={[styles.progressValue, { color: colors.textInverse }]}>{weeklyProgress.weekly_workouts}</Text>
              </View>
              <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>This Week</Text>
            </View>
          </View>
        </View>

        {/* Body Measurements */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Body Measurements</Text>
            <TouchableOpacity onPress={() => navigation.navigate('BodyMeasurementsScreen')}>
              <Ionicons name="add" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.measurementGrid}>
            <View style={[styles.measurementCard, { backgroundColor: colors.surfaceSecondary }]}>
              <Text style={[styles.measurementValue, { color: colors.text }]}>{bodyMeasurements.weight || '--'}</Text>
              <Text style={[styles.measurementUnit, { color: colors.textSecondary }]}>kg</Text>
              <Text style={[styles.measurementLabel, { color: colors.text }]}>Weight</Text>
              <Text style={[styles.measurementChange, { color: colors.success }]}>{bodyMeasurements.weight ? 'Track progress' : 'Add measurement'}</Text>
            </View>
            <View style={[styles.measurementCard, { backgroundColor: colors.surfaceSecondary }]}>
              <Text style={[styles.measurementValue, { color: colors.text }]}>{bodyMeasurements.body_fat_percentage || '--'}</Text>
              <Text style={[styles.measurementUnit, { color: colors.textSecondary }]}>%</Text>
              <Text style={[styles.measurementLabel, { color: colors.text }]}>Body Fat</Text>
              <Text style={[styles.measurementChange, { color: colors.success }]}>{bodyMeasurements.body_fat_percentage ? 'Track progress' : 'Add measurement'}</Text>
            </View>
          </View>
        </View>

        {/* User Statistics Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>All-Time Stats</Text>
            <TouchableOpacity onPress={() => Alert.alert('Analytics', `Total Stats:\n• ${userStats.total_workouts} workouts\n• ${userStats.total_calories_burned} calories burned\n• ${formatTime(userStats.total_workout_time)} total time\n• Level ${userLevel.level} (${userLevel.experience_points} XP)`)}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>Analytics</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{userStats.total_workouts}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Workouts</Text>
              <View style={styles.statTrend}>
                <Ionicons name="trending-up" size={12} color={colors.success} />
                <Text style={[styles.statTrendText, { color: colors.success }]}>+12%</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{userStats.total_calories_burned}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Calories</Text>
              <View style={styles.statTrend}>
                <Ionicons name="trending-up" size={12} color={colors.success} />
                <Text style={[styles.statTrendText, { color: colors.success }]}>+8%</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{formatTime(userStats.total_workout_time)}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Time</Text>
              <View style={styles.statTrend}>
                <Ionicons name="trending-up" size={12} color={colors.success} />
                <Text style={[styles.statTrendText, { color: colors.success }]}>+15%</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{userLevel.experience_points}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>XP</Text>
              <View style={styles.statTrend}>
                <Ionicons name="star" size={12} color="#f39c12" />
                <Text style={[styles.statTrendText, { color: colors.warning }]}>Lvl {userLevel.level}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Recent Activity */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
            <TouchableOpacity onPress={() => Alert.alert('Recent Activity', `You have ${recentActivity.length} recent activities. Check your workout history for more details!`)}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityList}>
            {recentActivity.length === 0 ? (
              <Text style={[styles.noDataText, { color: colors.textSecondary }]}>No recent activity. Start working out to see your progress!</Text>
            ) : (
              recentActivity.slice(0, 3).map((activity, index) => (
                <View key={index} style={[styles.activityItem, { borderBottomColor: colors.borderLight }]}>
                  <View style={[styles.activityIcon, { 
                    backgroundColor: activity.type === 'workout' ? colors.primary : 
                                   activity.type === 'achievement' ? colors.warning : colors.success 
                  }]}>
                    <Ionicons name={activity.icon || 'fitness'} size={16} color="#fff" />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={[styles.activityTitle, { color: colors.text }]}>{activity.title}</Text>
                    <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
                      {new Date(activity.time).toLocaleDateString()}
                      {activity.duration && ` • ${activity.duration} min`}
                    </Text>
                  </View>
                  {activity.calories && (
                    <Text style={[styles.activityCalories, { color: colors.primary }]}>{activity.calories} cal</Text>
                  )}
                  {activity.weight && (
                    <Text style={[styles.activityCalories, { color: colors.primary }]}>{activity.weight} kg</Text>
                  )}
                </View>
              ))
            )}
          </View>
        </View>

        {/* Recent Badges */}
        {userBadges.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Badges</Text>
              <TouchableOpacity onPress={() => Alert.alert('Badges', `You have earned ${userBadges.length} badges! Keep working out to unlock more.`)}>
                <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {userBadges.map((badge, index) => (
                <View key={index} style={styles.badgeItem}>
                  <View style={[styles.badgeIcon, { backgroundColor: badge.color || colors.primary }]}>
                    <Ionicons name={badge.icon || 'trophy'} size={20} color="#fff" />
                  </View>
                  <Text style={[styles.badgeName, { color: colors.textSecondary }]}>{badge.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Workout Calendar Preview */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>This Week</Text>
            <TouchableOpacity onPress={() => Alert.alert('Calendar', 'Full calendar view coming soon!')}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>Full Calendar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.weekCalendar}>
            {weeklyCalendar.length > 0 ? weeklyCalendar.map((day, index) => (
              <View key={index} style={styles.dayItem}>
                <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>{day.day}</Text>
                <View style={[
                  styles.dayCircle, 
                  { backgroundColor: colors.surfaceSecondary },
                  day.hasWorkout && styles.completedDay,
                  day.isToday && styles.todayDay
                ]}>
                  {day.hasWorkout && <Ionicons name="checkmark" size={12} color="#fff" />}
                  {day.isToday && !day.hasWorkout && <Text style={[styles.todayText, { color: colors.text }]}>•</Text>}
                  {day.workoutCount > 1 && <Text style={[styles.workoutCount, { color: colors.textInverse }]}>{day.workoutCount}</Text>}
                </View>
              </View>
            )) : (
              ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <View key={index} style={styles.dayItem}>
                  <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>{day}</Text>
                  <View style={[styles.dayCircle, { backgroundColor: colors.surfaceSecondary }]}>
                    <Text style={[styles.todayText, { color: colors.text }]}>•</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
        
        {/* Achievements Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Achievements</Text>
            <Ionicons name="trophy-outline" size={24} color="gold" />
          </View>
          {achievements.length === 0 ? (
            <Text style={[styles.noDataText, { color: colors.textSecondary }]}>No achievements yet. Keep working out to earn medals!</Text>
          ) : (
            achievements.map((medal, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginLeft: 15 }}>
                <Ionicons name="medal-outline" size={24} color={medal.level === 'gold' ? 'gold' : medal.level === 'silver' ? '#C0C0C0' : '#cd7f32'} style={{ marginRight: 10 }} />
                <Text style={[styles.achievementText, { color: colors.text, fontWeight: 'bold', marginRight: 8 }]}>{medal.description}</Text>
                <Text style={[styles.achievementLevel, { color: colors.textSecondary }]}>({medal.level} medal)</Text>
              </View>
            ))
          )}
        </View>
        
        {/* Personal Best Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Best</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text} />
          </View>
          
          {personalBests.length === 0 ? (
            <Text style={[styles.noDataText, { color: colors.textSecondary }]}>No personal bests yet. Complete workouts to see your records!</Text>
          ) : (
            personalBests.slice(0, 3).map((best, index) => (
              <View key={index} style={[styles.exerciseRow, { borderBottomColor: colors.borderLight }]}>
                <View style={[styles.weightBadge, { backgroundColor: colors.background }]}>
                  <Text style={[styles.weightValue, { color: colors.textInverse }]}>{best.weight}</Text>
                  <Text style={[styles.weightUnit, { color: colors.textInverse }]}>Kg</Text>
                </View>
                
                <Text style={[styles.exerciseName, { color: colors.text }]}>{best.exercise_name}</Text>
                
                <View style={styles.actionButtons}>
                  <Text style={[styles.divider, { color: colors.border }]}>|</Text>
                  <TouchableOpacity onPress={() => {
                    Alert.prompt(
                      'Update Personal Best',
                      `Enter new weight for ${best.exercise_name}:`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Update', 
                          onPress: (weight) => {
                            if (weight && !isNaN(weight)) {
                              handleAddPersonalBest(best.exercise_name, parseFloat(weight));
                            }
                          }
                        }
                      ],
                      'plain-text',
                      best.weight.toString()
                    );
                  }}>
                    <Ionicons name="add" size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          
          <TouchableOpacity 
            style={styles.viewMoreButton}
            onPress={() => Alert.alert('Personal Bests', `You have ${personalBests.length} personal records. Keep pushing your limits!`)}
          >
            <Text style={[styles.viewMoreText, { color: colors.textSecondary }]}>View More</Text>
          </TouchableOpacity>
        </View>
        
        {/* Bottom spacing */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profile</Text>
            
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.input, borderColor: colors.inputBorder, color: colors.text }]}
              placeholder="Display Name"
              placeholderTextColor={colors.inputPlaceholder}
              value={editForm.display_name}
              onChangeText={(text) => setEditForm({...editForm, display_name: text})}
            />
            
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.input, borderColor: colors.inputBorder, color: colors.text }]}
              placeholder="Height (cm)"
              placeholderTextColor={colors.inputPlaceholder}
              value={editForm.height}
              onChangeText={(text) => setEditForm({...editForm, height: text})}
              keyboardType="numeric"
            />
            
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.input, borderColor: colors.inputBorder, color: colors.text }]}
              placeholder="Weight (kg)"
              placeholderTextColor={colors.inputPlaceholder}
              value={editForm.weight}
              onChangeText={(text) => setEditForm({...editForm, weight: text})}
              keyboardType="numeric"
            />
            
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.input, borderColor: colors.inputBorder, color: colors.text }]}
              placeholder="Age"
              placeholderTextColor={colors.inputPlaceholder}
              value={editForm.age}
              onChangeText={(text) => setEditForm({...editForm, age: text})}
              keyboardType="numeric"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.buttonSecondary }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveProfile}
              >
                <Text style={[styles.saveButtonText, { color: colors.textInverse }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Profile Picture Upload Modal */}
      <ProfilePictureUpload
        visible={profilePictureModalVisible}
        onClose={() => setProfilePictureModalVisible(false)}
        userId={userId}
        onSuccess={(imageUrl) => {
          setProfilePicture({ image_url: imageUrl });
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  profileHeader: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    alignItems: 'center',
    position: 'relative',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0097e6',
    borderRadius: 12,
    padding: 4,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginBottom: 10,
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f39c12',
    marginLeft: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  progressOverview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0097e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  measurementGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  measurementCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '48%',
  },
  measurementValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  measurementUnit: {
    fontSize: 14,
    color: '#666',
    marginTop: -5,
  },
  measurementLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
    color: '#333',
  },
  measurementChange: {
    fontSize: 11,
    color: '#44bd32',
    marginTop: 2,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statTrendText: {
    fontSize: 10,
    color: '#44bd32',
    marginLeft: 2,
  },
  activityList: {
    paddingHorizontal: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activityCalories: {
    fontSize: 12,
    color: '#0097e6',
    fontWeight: '600',
  },
  weekCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
  },
  dayItem: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedDay: {
    backgroundColor: '#44bd32',
  },
  todayDay: {
    backgroundColor: '#0097e6',
  },
  todayText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  workoutCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeItem: {
    alignItems: 'center',
    marginRight: 15,
    width: 80,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  badgeName: {
    fontSize: 10,
    textAlign: 'center',
    color: '#666',
  },
  viewAllText: {
    fontSize: 14,
    color: '#0097e6',
  },
  editButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  editButtonText: {
    fontSize: 14,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0097e6',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  weightBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  weightValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  weightUnit: {
    color: '#fff',
    fontSize: 12,
  },
  exerciseName: {
    flex: 1,
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    fontSize: 24,
    color: '#ddd',
    marginRight: 10,
  },
  viewMoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 14,
    color: '#555',
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#0097e6',
    marginLeft: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '500',
  },
}); 