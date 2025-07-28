import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Animated,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { saveWorkoutHistory } from '../../api/workouts';
import { getCurrentUserId } from '../../api/auth';
import { updateUserStatistics } from '../../api/profile';

const { width } = Dimensions.get('window');

export default function ArmsWorkout({ navigation }) {
  const [exercises, setExercises] = useState([
    {
      id: '1',
      name: 'Barbell Curl',
      sets: [{ weight: 25, reps: 12, completed: false }],
      maxReps: 15,
      muscle: 'biceps',
    },
    {
      id: '2',
      name: 'Hammer Curl',
      sets: [{ weight: 15, reps: 12, completed: false }],
      maxReps: 15,
      muscle: 'biceps',
    },
    {
      id: '3',
      name: 'Preacher Curl',
      sets: [{ weight: 20, reps: 10, completed: false }],
      maxReps: 12,
      muscle: 'biceps',
    },
    {
      id: '4',
      name: 'Tricep Pushdown',
      sets: [{ weight: 30, reps: 12, completed: false }],
      maxReps: 15,
      muscle: 'triceps',
    },
    {
      id: '5',
      name: 'Overhead Tricep Extension',
      sets: [{ weight: 20, reps: 12, completed: false }],
      maxReps: 15,
      muscle: 'triceps',
    },
    {
      id: '6',
      name: 'Dips',
      sets: [{ weight: 0, reps: 10, completed: false }],
      maxReps: 12,
      muscle: 'triceps',
    },
  ]);

  const [editMode, setEditMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseMaxReps, setNewExerciseMaxReps] = useState('');
  const [newExerciseMuscle, setNewExerciseMuscle] = useState('biceps');
  const [workoutStarted, setWorkoutStarted] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Filter exercises by muscle group
  const bicepsExercises = exercises.filter(ex => ex.muscle === 'biceps');
  const tricepsExercises = exercises.filter(ex => ex.muscle === 'triceps');

  const addSet = (exerciseId) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        const lastSet = exercise.sets[exercise.sets.length - 1];
        return {
          ...exercise,
          sets: [...exercise.sets, { 
            weight: lastSet.weight, 
            reps: lastSet.reps, 
            completed: false 
          }]
        };
      }
      
      return exercise;
    }));
  };

  const removeSet = (exerciseId, setIndex) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id === exerciseId && exercise.sets.length > 1) {
        return {
          ...exercise,
          sets: exercise.sets.filter((_, index) => index !== setIndex)
        };
      }
      return exercise;
    }));
  };

  const toggleSetCompletion = (exerciseId, setIndex) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.map((set, index) => {
            if (index === setIndex) {
              return { ...set, completed: !set.completed };
            }
            return set;
          })
        };
      }
      return exercise;
    }));
  };

  const updateSetWeight = (exerciseId, setIndex, weight) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.map((set, index) => {
            if (index === setIndex) {
              return { ...set, weight: parseInt(weight) || 0 };
            }
            return set;
          })
        };
      }
      return exercise;
    }));
  };

  const updateSetReps = (exerciseId, setIndex, reps) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          
          sets: exercise.sets.map((set, index) => {
            if (index === setIndex) {
              return { ...set, reps: parseInt(reps) || 0 };
            }
            return set;
          })
        };
      }
      return exercise;
    }));
  };

  const addNewExercise = () => {
    if (newExerciseName.trim() === '') return;
    
    const newExercise = {
      id: Date.now().toString(),
      name: newExerciseName,
      sets: [{ weight: 0, reps: 10, completed: false }],
      maxReps: parseInt(newExerciseMaxReps) || 12,
      muscle: newExerciseMuscle,
    };
    
    setExercises([...exercises, newExercise]);
    setNewExerciseName('');
    setNewExerciseMaxReps('');
    setModalVisible(false);
  };

  const removeExercise = (exerciseId) => {
    setExercises(exercises.filter(exercise => exercise.id !== exerciseId));
  };

  const startWorkout = () => {
    // Reset all sets to not completed
    setExercises(exercises.map(exercise => ({
      ...exercise,
      sets: exercise.sets.map(set => ({ ...set, completed: false }))
    })));
    
    // Exit edit mode if active
    if (editMode) setEditMode(false);
    
    // Animate and set workout started
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setWorkoutStarted(true);
    });
  };

  const completeWorkout = async () => {
    try {
      const completedSets = exercises.reduce(
        (acc, ex) => acc + ex.sets.filter(set => set.completed).length, 
        0
      );
      const duration = completedSets * 1; // 1 minute per set
      const caloriesBurned = completedSets * 10;
      const userId = await getCurrentUserId();
      if (userId) {
        await saveWorkoutHistory({
          user_id: userId,
          workout_type: 'Arms',
          duration: duration,
          calories_burned: caloriesBurned
        });
        await updateUserStatistics({
          user_id: userId,
          workout_duration: duration,
          calories_burned: caloriesBurned
        });
      } else {
        Alert.alert('Not Logged In', 'Log in to save your workout history.');
      }
      setWorkoutStarted(false);
      navigation.goBack();
    } catch (error) {
      console.error('Error completing workout:', error);
      Alert.alert('Error', 'Failed to save your workout history.');
    }
  };

  // Calculate completion percentage
  const calculateProgress = () => {
    const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const completedSets = exercises.reduce(
      (acc, ex) => acc + ex.sets.filter(set => set.completed).length, 
      0
    );
    
    return totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  };
  
  const progressPercentage = calculateProgress();

  // Render an exercise card
  const renderExerciseCard = (exercise) => (
    <View key={exercise.id} style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseNameContainer}>
          <View style={[styles.muscleDot, { backgroundColor: exercise.muscle === 'biceps' ? '#FF9500' : '#9C27B0' }]} />
          <Text style={styles.exerciseName}>{exercise.name}</Text>
        </View>
        {editMode && (
          <TouchableOpacity 
            style={styles.removeExerciseButton}
            onPress={() => removeExercise(exercise.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#E53935" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.setsHeader}>
        <Text style={styles.setsHeaderText}>SET</Text>
        <Text style={styles.setsHeaderText}>KG</Text>
        <Text style={styles.setsHeaderText}>REPS</Text>
        <Text style={styles.setsHeaderText}></Text>
      </View>
      
      {exercise.sets.map((set, setIndex) => (
        <Animated.View 
          key={setIndex} 
          style={[
            styles.setRow,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.setText}>{setIndex + 1}</Text>
          
          <TextInput
            style={[styles.weightInput, set.completed && styles.inputCompleted]}
            value={set.weight.toString()}
            onChangeText={(text) => updateSetWeight(exercise.id, setIndex, text)}
            keyboardType="numeric"
            editable={!set.completed}
          />
          
          <TextInput
            style={[styles.repsInput, set.completed && styles.inputCompleted]}
            value={set.reps.toString()}
            onChangeText={(text) => updateSetReps(exercise.id, setIndex, text)}
            keyboardType="numeric"
            editable={!set.completed}
          />
          
          <TouchableOpacity
            style={[
              styles.checkButton, 
              set.completed && styles.checkButtonCompleted
            ]}
            onPress={() => toggleSetCompletion(exercise.id, setIndex)}
          >
            {set.completed ? (
              <Ionicons name="checkmark" size={18} color="white" />
            ) : (
              <Text style={styles.checkButtonText}>DO</Text>
            )}
          </TouchableOpacity>
          
          {editMode && (
            <TouchableOpacity
              style={styles.removeSetButton}
              onPress={() => removeSet(exercise.id, setIndex)}
            >
              <Ionicons name="remove-circle-outline" size={20} color="#E53935" />
            </TouchableOpacity>
          )}
        </Animated.View>
      ))}
      
      {/* Max Reps */}
      <View style={styles.maxRepsRow}>
        <Text style={styles.maxRepsText}>Max Reps: {exercise.maxReps}</Text>
      </View>
      
      {/* Add Set Button */}
      <TouchableOpacity 
        style={styles.addSetButton}
        onPress={() => addSet(exercise.id)}
      >
        <Ionicons name="add-circle-outline" size={20} color="#555" />
        <Text style={styles.addSetText}>Add Set</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Arms Workout</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setEditMode(!editMode)}
        >
          <Text style={styles.editButtonText}>{editMode ? 'Done' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>
      
      {/* Progress Bar */}
      {workoutStarted && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progressPercentage)}% Complete</Text>
        </View>
      )}
      
      {!workoutStarted ? (
        <View style={styles.startSection}>
          <Image 
            source={require('../../assets/kettle.jpg')} 
            style={styles.workoutImage} 
            resizeMode="cover"
          />
          <View style={styles.workoutInfoContainer}>
            <Text style={styles.workoutInfoTitle}>Arms Workout</Text>
            <Text style={styles.workoutInfoText}>
              A focused workout targeting biceps and triceps for stronger, more defined arms.
              {'\n\n'}
              • 6 exercises
              {'\n'}
              • Estimated time: 30-45 min
              {'\n'}
              • Difficulty: Intermediate
            </Text>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={startWorkout}
            >
              <Text style={styles.startButtonText}>START WORKOUT</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <View style={styles.workoutContainer}>
            {/* Biceps Section */}
            <View style={styles.muscleSection}>
              <View style={styles.muscleTitleContainer}>
                <View style={[styles.muscleDot, { backgroundColor: '#FF9500' }]} />
                <Text style={styles.muscleTitle}>BICEPS</Text>
              </View>
              {bicepsExercises.map(renderExerciseCard)}
            </View>
            {/* Triceps Section */}
            <View style={styles.muscleSection}>
              <View style={styles.muscleTitleContainer}>
                <View style={[styles.muscleDot, { backgroundColor: '#9C27B0' }]} />
                <Text style={styles.muscleTitle}>TRICEPS</Text>
              </View>
              {tricepsExercises.map(renderExerciseCard)}
            </View>
            {/* Complete Workout Button */}
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={completeWorkout}
            >
              <Text style={styles.completeButtonText}>COMPLETE WORKOUT</Text>
            </TouchableOpacity>
            {/* Add Exercise Button */}
            {editMode && (
              <TouchableOpacity 
                style={styles.addExerciseButton}
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="add-circle" size={24} color="white" />
                <Text style={styles.addExerciseText}>Add Exercise</Text>
              </TouchableOpacity>
            )}
            {/* Bottom spacing */}
            <View style={{ height: 80 }} />
          </View>
        </ScrollView>
      )}
      
      {/* Add Exercise Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Exercise</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Exercise Name"
              placeholderTextColor="#999"
              value={newExerciseName}
              onChangeText={setNewExerciseName}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Max Reps"
              placeholderTextColor="#999"
              value={newExerciseMaxReps}
              onChangeText={setNewExerciseMaxReps}
              keyboardType="numeric"
            />
            
            <View style={styles.muscleTypeContainer}>
              <Text style={styles.muscleTypeLabel}>Muscle Group:</Text>
              <View style={styles.muscleTypeButtons}>
                <TouchableOpacity 
                  style={[
                    styles.muscleTypeButton, 
                    newExerciseMuscle === 'biceps' && styles.muscleTypeButtonActive
                  ]}
                  onPress={() => setNewExerciseMuscle('biceps')}
                >
                  <Text style={[
                    styles.muscleTypeButtonText,
                    newExerciseMuscle === 'biceps' && styles.muscleTypeButtonTextActive
                  ]}>Biceps</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.muscleTypeButton, 
                    newExerciseMuscle === 'triceps' && styles.muscleTypeButtonActive
                  ]}
                  onPress={() => setNewExerciseMuscle('triceps')}
                >
                  <Text style={[
                    styles.muscleTypeButtonText,
                    newExerciseMuscle === 'triceps' && styles.muscleTypeButtonTextActive
                  ]}>Triceps</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={addNewExercise}
              >
                <Text style={styles.saveButtonText}>Add</Text>
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
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E53935',
    borderRadius: 3,
  },
  progressText: {
    marginTop: 8,
    fontSize: 12,
    color: '#bbb',
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  startSection: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1e1e1e',
  },
  workoutImage: {
    width: '100%',
    height: 200,
  },
  workoutInfoContainer: {
    padding: 16,
  },
  workoutInfoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  workoutInfoText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#bbb',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#E53935',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  workoutContainer: {
    padding: 16,
  },
  muscleSection: {
    marginBottom: 24,
  },
  muscleTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  muscleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  muscleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  exerciseCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  removeExerciseButton: {
    padding: 4,
  },
  setsHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 8,
  },
  setsHeaderText: {
    flex: 1,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    fontWeight: '600',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  setText: {
    flex: 1,
    textAlign: 'center',
    color: '#bbb',
  },
  weightInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 8,
    textAlign: 'center',
    marginHorizontal: 4,
    color: 'white',
    backgroundColor: '#2a2a2a',
  },
  repsInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 8,
    textAlign: 'center',
    marginHorizontal: 4,
    color: 'white',
    backgroundColor: '#2a2a2a',
  },
  inputCompleted: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
  },
  checkButton: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: 'transparent',
  },
  checkButtonText: {
    color: '#E53935',
    fontWeight: 'bold',
    fontSize: 12,
  },
  checkButtonCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  removeSetButton: {
    padding: 4,
    marginLeft: 4,
  },
  maxRepsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 8,
  },
  maxRepsText: {
    fontSize: 12,
    color: '#888',
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  addSetText: {
    fontSize: 14,
    color: '#888',
    marginLeft: 4,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addExerciseButton: {
    flexDirection: 'row',
    backgroundColor: '#E53935',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addExerciseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
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
    color: 'white',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: 'white',
    backgroundColor: '#2a2a2a',
  },
  muscleTypeContainer: {
    marginBottom: 20,
  },
  muscleTypeLabel: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 8,
  },
  muscleTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  muscleTypeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
    marginHorizontal: 4,
  },
  muscleTypeButtonActive: {
    backgroundColor: '#E53935',
    borderColor: '#E53935',
  },
  muscleTypeButtonText: {
    color: '#bbb',
    fontWeight: '500',
  },
  muscleTypeButtonTextActive: {
    color: 'white',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#bbb',
  },
  saveButton: {
    backgroundColor: '#E53935',
    marginLeft: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});