import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { shareWorkout } from '../../api/social';
import { getWorkoutHistory } from '../../api/profile';
import { getCurrentUserId } from '../../api/auth';

export default function ShareWorkout({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState('friends'); // 'public', 'friends', 'private'
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const id = await getCurrentUserId();
      setUserId(id);
      if (id) {
        loadWorkouts(id);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadWorkouts = async (id) => {
    try {
      const workoutHistory = await getWorkoutHistory(id);
      // Sort by most recent first
      const sortedWorkouts = workoutHistory.sort((a, b) => 
        new Date(b.completed_at) - new Date(a.completed_at)
      );
      setWorkouts(sortedWorkouts);
    } catch (error) {
      console.error('Error loading workouts:', error);
      Alert.alert('Error', 'Failed to load workout history');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!selectedWorkout) {
      Alert.alert('Error', 'Please select a workout to share');
      return;
    }

    try {
      setSharing(true);
      await shareWorkout(userId, selectedWorkout.id, caption, visibility);
      Alert.alert(
        'Success',
        'Workout shared successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error sharing workout:', error);
      Alert.alert('Error', error.message || 'Failed to share workout');
    } finally {
      setSharing(false);
    }
  };

  const renderWorkoutItem = ({ item }) => {
    const isSelected = selectedWorkout && selectedWorkout.id === item.id;
    const formattedDate = new Date(item.completed_at).toLocaleDateString();
    
    return (
      <TouchableOpacity 
        style={[
          styles.workoutCard,
          isSelected && styles.selectedWorkout
        ]}
        onPress={() => setSelectedWorkout(item)}
      >
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutType}>{item.workout_type}</Text>
          <Text style={styles.workoutDate}>{formattedDate}</Text>
          
          <View style={styles.workoutStats}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.statText}>{item.duration} min</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="flame-outline" size={16} color="#666" />
              <Text style={styles.statText}>{item.calories_burned || 0} cal</Text>
            </View>
          </View>
        </View>
        
        {isSelected && (
          <View style={styles.checkmark}>
            <Ionicons name="checkmark-circle" size={24} color="#0097e6" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0097e6" />
        <Text style={styles.loadingText}>Loading workouts...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share Workout</Text>
        <TouchableOpacity 
          style={[
            styles.shareButton,
            (!selectedWorkout || sharing) && styles.disabledButton
          ]}
          onPress={handleShare}
          disabled={!selectedWorkout || sharing}
        >
          {sharing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.shareButtonText}>Share</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.captionContainer}>
        <TextInput
          style={styles.captionInput}
          placeholder="Write a caption..."
          value={caption}
          onChangeText={setCaption}
          multiline
          maxLength={255}
        />
      </View>
      
      <View style={styles.visibilityContainer}>
        <Text style={styles.visibilityLabel}>Who can see this?</Text>
        
        <View style={styles.visibilityOptions}>
          <TouchableOpacity 
            style={[
              styles.visibilityOption,
              visibility === 'public' && styles.selectedVisibility
            ]}
            onPress={() => setVisibility('public')}
          >
            <Ionicons 
              name="globe-outline" 
              size={20} 
              color={visibility === 'public' ? "#0097e6" : "#666"} 
            />
            <Text style={[
              styles.visibilityText,
              visibility === 'public' && styles.selectedVisibilityText
            ]}>Public</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.visibilityOption,
              visibility === 'friends' && styles.selectedVisibility
            ]}
            onPress={() => setVisibility('friends')}
          >
            <Ionicons 
              name="people-outline" 
              size={20} 
              color={visibility === 'friends' ? "#0097e6" : "#666"} 
            />
            <Text style={[
              styles.visibilityText,
              visibility === 'friends' && styles.selectedVisibilityText
            ]}>Friends</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.visibilityOption,
              visibility === 'private' && styles.selectedVisibility
            ]}
            onPress={() => setVisibility('private')}
          >
            <Ionicons 
              name="lock-closed-outline" 
              size={20} 
              color={visibility === 'private' ? "#0097e6" : "#666"} 
            />
            <Text style={[
              styles.visibilityText,
              visibility === 'private' && styles.selectedVisibilityText
            ]}>Only Me</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Select a workout to share</Text>
      
      {workouts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="barbell-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No workouts to share</Text>
          <Text style={styles.emptySubtext}>
            Complete a workout first to share it with others
          </Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          renderItem={renderWorkoutItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.workoutList}
        />
      )}
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
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  shareButton: {
    backgroundColor: '#0097e6',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  captionContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  captionInput: {
    height: 80,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  visibilityContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  visibilityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  visibilityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  visibilityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 5,
  },
  selectedVisibility: {
    backgroundColor: 'rgba(0, 151, 230, 0.1)',
  },
  visibilityText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  selectedVisibilityText: {
    color: '#0097e6',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    margin: 15,
  },
  workoutList: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  workoutCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedWorkout: {
    borderWidth: 2,
    borderColor: '#0097e6',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  workoutDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    marginBottom: 5,
  },
  workoutStats: {
    flexDirection: 'row',
    marginTop: 5,
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
  checkmark: {
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
});