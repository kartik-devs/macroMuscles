import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { shareWorkout } from '../../api/social';
import { getWorkoutHistory } from '../../api/profile';
import { getCurrentUserId } from '../../api/auth';

export default function ShareWorkout({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState('friends');
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const id = await getCurrentUserId();
      setUserId(id);
      if (id) {
        await loadWorkouts(id);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkouts = async (id) => {
    try {
      const workoutData = await getWorkoutHistory(id);
      setWorkouts(Array.isArray(workoutData) ? workoutData : []);
    } catch (error) {
      console.error('Error loading workouts:', error);
      Alert.alert('Error', 'Failed to load workout history');
    }
  };

  const handleShare = async () => {
    if (!selectedWorkout) {
      Alert.alert('Error', 'Please select a workout to share');
      return;
    }

    if (!caption.trim()) {
      Alert.alert('Error', 'Please add a caption for your post');
      return;
    }

    try {
      setSharing(true);
      await shareWorkout(userId, selectedWorkout.id, caption.trim(), visibility);
      
      Alert.alert('Success', 'Workout shared successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
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
        style={[styles.workoutCard, isSelected && styles.selectedWorkout]}
        onPress={() => setSelectedWorkout(item)}
      >
        <View style={styles.workoutHeader}>
          <Text style={styles.workoutType}>{item.workout_type}</Text>
          <Text style={styles.workoutDate}>{formattedDate}</Text>
        </View>
        
        <View style={styles.workoutStats}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.statText}>{item.duration} min</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="flame-outline" size={16} color="#666" />
            <Text style={styles.statText}>{item.calories_burned} cal</Text>
          </View>
        </View>
        
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Ionicons name="checkmark-circle" size={20} color="#44bd32" />
            <Text style={styles.selectedText}>Selected</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderVisibilityOption = (option, label, icon) => (
    <TouchableOpacity
      style={[
        styles.visibilityOption,
        visibility === option && styles.selectedVisibility
      ]}
      onPress={() => setVisibility(option)}
    >
      <Ionicons 
        name={icon} 
        size={20} 
        color={visibility === option ? '#fff' : '#666'} 
      />
      <Text style={[
        styles.visibilityText,
        visibility === option && styles.selectedVisibilityText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E53935" />
        <Text style={styles.loadingText}>Loading workouts...</Text>
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
        <Text style={styles.headerTitle}>Share Workout</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Select a Workout</Text>
        
        <FlatList
          data={workouts}
          renderItem={renderWorkoutItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.workoutList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="fitness-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No workouts to share</Text>
              <Text style={styles.emptySubtext}>
                Complete some workouts first to share them
              </Text>
            </View>
          }
        />

        {selectedWorkout && (
          <>
            <Text style={styles.sectionTitle}>Caption</Text>
            <TextInput
              style={styles.captionInput}
              placeholder="What's on your mind about this workout?"
              placeholderTextColor="#999"
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={500}
            />
            <Text style={styles.characterCount}>
              {caption.length}/500
            </Text>

            <Text style={styles.sectionTitle}>Visibility</Text>
            <View style={styles.visibilityContainer}>
              {renderVisibilityOption('friends', 'Friends Only', 'people-outline')}
              {renderVisibilityOption('public', 'Public', 'globe-outline')}
              {renderVisibilityOption('private', 'Private', 'lock-closed-outline')}
            </View>

            <TouchableOpacity
              style={[
                styles.shareButton,
                (!selectedWorkout || !caption.trim() || sharing) && styles.shareButtonDisabled
              ]}
              onPress={handleShare}
              disabled={!selectedWorkout || !caption.trim() || sharing}
            >
              {sharing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="share-social" size={20} color="#fff" />
                  <Text style={styles.shareButtonText}>Share Workout</Text>
                </>
              )}
            </TouchableOpacity>
          </>
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
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 20,
  },
  workoutList: {
    paddingBottom: 20,
  },
  workoutCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedWorkout: {
    borderColor: '#E53935',
    backgroundColor: '#fff5f5',
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
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  selectedText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#44bd32',
    fontWeight: 'bold',
  },
  captionInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  visibilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  visibilityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 5,
  },
  selectedVisibility: {
    backgroundColor: '#E53935',
  },
  visibilityText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  selectedVisibilityText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: '#E53935',
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  shareButtonDisabled: {
    backgroundColor: '#ccc',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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