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

import { 
  getUserProfile, 
  saveUserProfile, 
  getPersonalBests,
  savePersonalBest, 
  getUserStatistics, 
  getAchievements
} from '../api/profile';

import { getCurrentUserId } from '../api/auth';

export default function ProfilePage() {
  const [userId, setUserId] = useState(null);
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
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#f8f9fa" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#f8f9fa" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{userProfile.avatar_initial}</Text>
          </View>
          
          <Text style={styles.userName}>{userProfile.display_name}</Text>
          
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>edit</Text>
          </TouchableOpacity>
        </View>

        {/* User Statistics Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Statistics</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.total_workouts}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.total_calories_burned}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatTime(userStats.total_workout_time)}</Text>
              <Text style={styles.statLabel}>Time</Text>
            </View>
          </View>
        </View>
        
        {/* Achievements Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <Ionicons name="trophy-outline" size={24} color="gold" />
          </View>
          {achievements.length === 0 ? (
            <Text style={styles.noDataText}>No achievements yet. Keep working out to earn medals!</Text>
          ) : (
            achievements.map((medal, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginLeft: 15 }}>
                <Ionicons name="medal-outline" size={24} color={medal.level === 'gold' ? 'gold' : medal.level === 'silver' ? '#C0C0C0' : '#cd7f32'} style={{ marginRight: 10 }} />
                <Text style={{ fontWeight: 'bold', marginRight: 8 }}>{medal.description}</Text>
                <Text style={{ color: '#888' }}>({medal.level} medal)</Text>
              </View>
            ))
          )}
        </View>
        
        {/* Personal Best Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Best</Text>
            <Ionicons name="chevron-forward" size={24} color="black" />
          </View>
          
          {personalBests.length === 0 ? (
            <Text style={styles.noDataText}>No personal bests yet. Complete workouts to see your records!</Text>
          ) : (
            personalBests.slice(0, 3).map((best, index) => (
              <View key={index} style={styles.exerciseRow}>
                <View style={styles.weightBadge}>
                  <Text style={styles.weightValue}>{best.weight}</Text>
                  <Text style={styles.weightUnit}>Kg</Text>
                </View>
                
                <Text style={styles.exerciseName}>{best.exercise_name}</Text>
                
                <View style={styles.actionButtons}>
                  <Text style={styles.divider}>|</Text>
                  <TouchableOpacity onPress={() => Alert.alert('Update', 'Enter new weight for this exercise', [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Update', 
                      onPress: () => {
                        // In a real app, you'd show a modal to input new weight
                        Alert.alert('Feature', 'This feature will be implemented soon!');
                      }
                    }
                  ])}>
                    <Ionicons name="add" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          
          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}>View More</Text>
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Display Name"
              value={editForm.display_name}
              onChangeText={(text) => setEditForm({...editForm, display_name: text})}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Height (cm)"
              value={editForm.height}
              onChangeText={(text) => setEditForm({...editForm, height: text})}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Weight (kg)"
              value={editForm.weight}
              onChangeText={(text) => setEditForm({...editForm, weight: text})}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Age"
              value={editForm.age}
              onChangeText={(text) => setEditForm({...editForm, age: text})}
              keyboardType="numeric"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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