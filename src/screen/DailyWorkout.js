import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { saveWorkoutHistory } from '../api/workouts';
import { getCurrentUserId } from '../api/auth';
import { updateUserStatistics } from '../api/profile';

const { width } = Dimensions.get('window');

export default function DailyWorkout({ navigation, route }) {
  const { workout, date } = route.params;
  const [exercises, setExercises] = useState(
    workout.exercises.map(exercise => ({
      id: exercise.name,
      name: exercise.name,
      sets: [{ weight: 0, reps: exercise.reps, completed: false }],
      maxReps: exercise.reps,
      muscle: exercise.muscle || 'general',
      difficulty: exercise.difficulty || 'intermediate',
      rest: exercise.rest || '60s',
    }))
  );
  
  const [cardioExercises, setCardioExercises] = useState(
    workout.cardio ? workout.cardio.exercises.map(exercise => ({
      id: exercise.name,
      name: exercise.name,
      duration: exercise.duration,
      intensity: exercise.intensity,
      completed: false,
    })) : []
  );

  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState('warmup'); // warmup, strength, cardio, cooldown
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

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

  const toggleCardioCompletion = (cardioId) => {
    setCardioExercises(cardioExercises.map(cardio => {
      if (cardio.id === cardioId) {
        return { ...cardio, completed: !cardio.completed };
      }
      return cardio;
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

  const startWorkout = () => {
    // Reset all sets to not completed
    setExercises(exercises.map(exercise => ({
      ...exercise,
      sets: exercise.sets.map(set => ({ ...set, completed: false }))
    })));
    
    setCardioExercises(cardioExercises.map(cardio => ({
      ...cardio,
      completed: false
    })));
    
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

  // Calculate completion percentage
  const calculateProgress = () => {
    const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const completedSets = exercises.reduce(
      (acc, ex) => acc + ex.sets.filter(set => set.completed).length, 
      0
    );
    const totalCardio = cardioExercises.length;
    const completedCardio = cardioExercises.filter(cardio => cardio.completed).length;
    
    const total = totalSets + totalCardio;
    const completed = completedSets + completedCardio;
    
    return total > 0 ? (completed / total) * 100 : 0;
  };
  
  const progressPercentage = calculateProgress();

  const completeWorkout = async () => {
    try {
      // Calculate total duration (for demo purposes, let's assume 1 minute per completed set)
      const completedSets = exercises.reduce(
        (acc, ex) => acc + ex.sets.filter(set => set.completed).length, 
        0
      );
      const completedCardio = cardioExercises.filter(cardio => cardio.completed).length;
      const duration = (completedSets + completedCardio) * 1; // 1 minute per set/cardio
      
      // Calculate calories burned (rough estimate: 10 calories per completed set)
      const caloriesBurned = (completedSets + completedCardio) * 10;
      
      // Get current user ID
      const userId = await getCurrentUserId();
      
      if (userId) {
        // Save workout history to backend
        await saveWorkoutHistory({
          user_id: userId,
          workout_type: workout.type,
          duration: duration,
          calories_burned: caloriesBurned
        });

        // Update user statistics
        await updateUserStatistics({
          user_id: userId,
          workout_duration: duration,
          calories_burned: caloriesBurned
        });
      } else {
        Alert.alert('Not Logged In', 'Log in to save your workout history.');
      }
      
      // Reset workout state
      setWorkoutStarted(false);
      
      // Navigate back
      navigation.goBack();
    } catch (error) {
      console.error('Error completing workout:', error);
      Alert.alert('Error', 'Failed to save your workout history.');
    }
  };

  // Render an exercise card
  const renderExerciseCard = (exercise) => (
    <View key={exercise.id} style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseNameContainer}>
          <View style={[styles.muscleDot, { backgroundColor: getDifficultyColor(exercise.difficulty) }]} />
          <Text style={styles.exerciseName}>{exercise.name}</Text>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exercise.difficulty) }]}>
          <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
        </View>
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
        </Animated.View>
      ))}
      
      {/* Max Reps */}
      <View style={styles.maxRepsRow}>
        <Text style={styles.maxRepsText}>Max Reps: {exercise.maxReps}</Text>
        <Text style={styles.restText}>Rest: {exercise.rest}</Text>
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

  // Render cardio exercise
  const renderCardioExercise = (cardio) => (
    <View key={cardio.id} style={styles.cardioCard}>
      <View style={styles.cardioHeader}>
        <Text style={styles.cardioName}>{cardio.name}</Text>
        <View style={[styles.intensityBadge, { backgroundColor: getIntensityColor(cardio.intensity) }]}>
          <Text style={styles.intensityText}>{cardio.intensity}</Text>
        </View>
      </View>
      
      <View style={styles.cardioDetails}>
        <Text style={styles.cardioDuration}>{cardio.duration}</Text>
        <TouchableOpacity
          style={[
            styles.cardioCheckButton, 
            cardio.completed && styles.cardioCheckButtonCompleted
          ]}
          onPress={() => toggleCardioCompletion(cardio.id)}
        >
          {cardio.completed ? (
            <Ionicons name="checkmark" size={18} color="white" />
          ) : (
            <Text style={styles.cardioCheckButtonText}>COMPLETE</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#44bd32';
      case 'intermediate': return '#f39c12';
      case 'advanced': return '#E53935';
      default: return '#666';
    }
  };

  const getIntensityColor = (intensity) => {
    switch (intensity.toLowerCase()) {
      case 'warm-up': return '#44bd32';
      case 'moderate': return '#f39c12';
      case 'high': return '#E53935';
      default: return '#666';
    }
  };

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
        <Text style={styles.headerTitle}>{workout.type} Workout</Text>
        <View style={styles.headerSpacer} />
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
            source={require('../assets/dumbbell.jpg')} 
            style={styles.workoutImage} 
            resizeMode="cover"
          />
          <View style={styles.workoutInfoContainer}>
            <Text style={styles.workoutInfoTitle}>{workout.type} Workout</Text>
            <Text style={styles.workoutInfoText}>
              A complete {workout.type.toLowerCase()} workout targeting all major muscle groups.
              {'\n\n'}
              • {exercises.length} exercises
              {'\n'}
              • Estimated time: 45-60 min
              {'\n'}
              • Difficulty: Intermediate
              {workout.cardio && `\n• ${workout.cardio.duration} cardio`}
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
            {/* Strength Exercises */}
            <View style={styles.muscleSection}>
              <View style={styles.muscleTitleContainer}>
                <View style={[styles.muscleDot, { backgroundColor: '#E53935' }]} />
                <Text style={styles.muscleTitle}>STRENGTH EXERCISES</Text>
              </View>
              {exercises.map(renderExerciseCard)}
            </View>

            {/* Cardio Section */}
            {workout.cardio && (
              <View style={styles.muscleSection}>
                <View style={styles.muscleTitleContainer}>
                  <View style={[styles.muscleDot, { backgroundColor: '#44bd32' }]} />
                  <Text style={styles.muscleTitle}>CARDIO</Text>
                </View>
                {cardioExercises.map(renderCardioExercise)}
              </View>
            )}

            {/* Complete Workout Button */}
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={completeWorkout}
            >
              <Text style={styles.completeButtonText}>COMPLETE WORKOUT</Text>
            </TouchableOpacity>
            
            {/* Bottom spacing */}
            <View style={{ height: 80 }} />
          </View>
        </ScrollView>
      )}
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
  headerSpacer: {
    width: 40,
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
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize',
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
  maxRepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  maxRepsText: {
    fontSize: 12,
    color: '#888',
  },
  restText: {
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
  cardioCard: {
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
  cardioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardioName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  intensityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  intensityText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  cardioDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardioDuration: {
    fontSize: 14,
    color: '#bbb',
  },
  cardioCheckButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#44bd32',
    backgroundColor: 'transparent',
  },
  cardioCheckButtonText: {
    color: '#44bd32',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardioCheckButtonCompleted: {
    backgroundColor: '#44bd32',
    borderColor: '#44bd32',
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
}); 