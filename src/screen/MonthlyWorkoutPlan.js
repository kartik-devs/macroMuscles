import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getRecommendedExercises } from './diets/data/exerciseData';

export default function MonthlyWorkoutPlan({ navigation, route }) {
  const { workoutSplit, includeCardio, cardioType } = route.params;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthlyPlan, setMonthlyPlan] = useState([]);

  useEffect(() => {
    generateMonthlyPlan();
  }, [workoutSplit, includeCardio, cardioType]);

  const generateMonthlyPlan = () => {
    const plan = [];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const workoutSchedules = {
      push_pull_legs: [
        { day: 'Monday', type: 'Push', color: '#E53935', icon: 'body' },
        { day: 'Tuesday', type: 'Pull', color: '#44bd32', icon: 'fitness' },
        { day: 'Wednesday', type: 'Legs', color: '#0097e6', icon: 'body-outline' },
        { day: 'Thursday', type: 'Push', color: '#E53935', icon: 'body' },
        { day: 'Friday', type: 'Pull', color: '#44bd32', icon: 'fitness' },
        { day: 'Saturday', type: 'Legs', color: '#0097e6', icon: 'body-outline' },
        { day: 'Sunday', type: 'Rest', color: '#666', icon: 'bed' },
      ],
      upper_lower: [
        { day: 'Monday', type: 'Upper', color: '#E53935', icon: 'body' },
        { day: 'Tuesday', type: 'Lower', color: '#44bd32', icon: 'fitness' },
        { day: 'Wednesday', type: 'Rest', color: '#666', icon: 'bed' },
        { day: 'Thursday', type: 'Upper', color: '#E53935', icon: 'body' },
        { day: 'Friday', type: 'Lower', color: '#44bd32', icon: 'fitness' },
        { day: 'Saturday', type: 'Rest', color: '#666', icon: 'bed' },
        { day: 'Sunday', type: 'Rest', color: '#666', icon: 'bed' },
      ],
      full_body: [
        { day: 'Monday', type: 'Full Body', color: '#E53935', icon: 'body' },
        { day: 'Tuesday', type: 'Rest', color: '#666', icon: 'bed' },
        { day: 'Wednesday', type: 'Full Body', color: '#44bd32', icon: 'fitness' },
        { day: 'Thursday', type: 'Rest', color: '#666', icon: 'bed' },
        { day: 'Friday', type: 'Full Body', color: '#0097e6', icon: 'body-outline' },
        { day: 'Saturday', type: 'Rest', color: '#666', icon: 'bed' },
        { day: 'Sunday', type: 'Rest', color: '#666', icon: 'bed' },
      ],
      bro_split: [
        { day: 'Monday', type: 'Chest', color: '#E53935', icon: 'body' },
        { day: 'Tuesday', type: 'Back', color: '#44bd32', icon: 'fitness' },
        { day: 'Wednesday', type: 'Shoulders', color: '#0097e6', icon: 'body-outline' },
        { day: 'Thursday', type: 'Arms', color: '#8e44ad', icon: 'barbell' },
        { day: 'Friday', type: 'Legs', color: '#f39c12', icon: 'fitness' },
        { day: 'Saturday', type: 'Rest', color: '#666', icon: 'bed' },
        { day: 'Sunday', type: 'Rest', color: '#666', icon: 'bed' },
      ],
    };

    const schedule = workoutSchedules[workoutSplit];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayOfWeek = dayNames[date.getDay()];
      const scheduleItem = schedule.find(item => item.day === dayOfWeek);
      
      plan.push({
        date: date,
        day: day,
        type: scheduleItem?.type || 'Rest',
        color: scheduleItem?.color || '#666',
        icon: scheduleItem?.icon || 'bed',
        isToday: date.toDateString() === new Date().toDateString(),
        isSelected: date.toDateString() === selectedDate.toDateString(),
      });
    }

    setMonthlyPlan(plan);
  };

  const getCurrentWorkout = () => {
    const today = monthlyPlan.find(day => day.isToday);
    if (!today || today.type === 'Rest') return null;

    const exercises = getRecommendedExercises(workoutSplit, 'maintenance');
    const workoutDay = exercises.find(day => 
      day.day.toLowerCase().includes(today.type.toLowerCase())
    );

    return {
      type: today.type,
      color: today.color,
      icon: today.icon,
      exercises: workoutDay?.exercises || [],
      cardio: includeCardio ? {
        type: cardioType,
        duration: cardioType === 'light' ? '10-15 min' : 
                  cardioType === 'moderate' ? '20-30 min' : '30-45 min',
        exercises: [
          { name: 'Treadmill', duration: '10 min', intensity: 'Warm-up' },
          { name: 'Cycling', duration: '15 min', intensity: 'Moderate' },
          { name: 'Rowing', duration: '10 min', intensity: 'High' },
        ]
      } : null
    };
  };

  const currentWorkout = getCurrentWorkout();

  const renderCalendarDay = (day) => (
    <TouchableOpacity
      key={day.day}
      style={[
        styles.calendarDay,
        day.isToday && styles.today,
        day.isSelected && styles.selectedDay,
        { borderColor: day.color }
      ]}
      onPress={() => setSelectedDate(day.date)}
    >
      <Text style={[
        styles.dayNumber,
        day.isToday && styles.todayText,
        day.isSelected && styles.selectedDayText
      ]}>
        {day.day}
      </Text>
             <Ionicons 
         name={day.icon} 
         size={14} 
         color={day.isToday || day.isSelected ? '#fff' : day.color} 
       />
             <Text 
         style={[
           styles.dayType,
           day.isToday && styles.todayText,
           day.isSelected && styles.selectedDayText
         ]}
         numberOfLines={1}
         ellipsizeMode="tail"
       >
         {day.type}
       </Text>
    </TouchableOpacity>
  );

  const renderExerciseCard = (exercise) => (
    <View key={exercise.name} style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exercise.difficulty) }]}>
          <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
        </View>
      </View>
      <View style={styles.exerciseDetails}>
        <Text style={styles.exerciseDetail}>{exercise.sets} sets</Text>
        <Text style={styles.exerciseDetail}>{exercise.reps}</Text>
        <Text style={styles.exerciseDetail}>{exercise.rest} rest</Text>
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

  const startWorkout = () => {
    if (!currentWorkout) {
      Alert.alert('Rest Day', 'Today is a rest day. Take it easy!');
      return;
    }

    navigation.navigate('DailyWorkout', {
      workout: currentWorkout,
      date: currentDate,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Monthly Workout Plan</Text>
          <Text style={styles.headerSubtitle}>
            Your personalized {workoutSplit.replace('_', ' ')} split for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
        </View>

        {/* Today's Workout Card */}
        <View style={styles.todayCard}>
          <View style={styles.todayHeader}>
            <Text style={styles.todayTitle}>Today's Workout</Text>
            <Text style={styles.todayDate}>
              {currentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          
          {currentWorkout ? (
            <View style={styles.workoutInfo}>
              <View style={styles.workoutTypeContainer}>
                <View style={[styles.workoutTypeDot, { backgroundColor: currentWorkout.color }]} />
                <Text style={styles.workoutType}>{currentWorkout.type}</Text>
              </View>
              
              <View style={styles.workoutStats}>
                <View style={styles.statItem}>
                  <Ionicons name="barbell" size={16} color="#666" />
                  <Text style={styles.statText}>{currentWorkout.exercises.length} exercises</Text>
                </View>
                {currentWorkout.cardio && (
                  <View style={styles.statItem}>
                    <Ionicons name="heart" size={16} color="#666" />
                    <Text style={styles.statText}>{currentWorkout.cardio.duration}</Text>
                  </View>
                )}
              </View>
              
              <TouchableOpacity style={styles.startWorkoutButton} onPress={startWorkout}>
                <Text style={styles.startWorkoutText}>START WORKOUT</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.restDayContainer}>
              <Ionicons name="bed" size={48} color="#666" />
              <Text style={styles.restDayTitle}>Rest Day</Text>
              <Text style={styles.restDayText}>Take it easy and recover today!</Text>
            </View>
          )}
        </View>

        {/* Calendar Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Monthly Calendar</Text>
          <Text style={styles.sectionSubtitle}>Tap on any day to view details</Text>
          
          <View style={styles.calendarContainer}>
            {monthlyPlan.map((day, index) => (
              <View key={index} style={styles.calendarDayWrapper}>
                {renderCalendarDay(day)}
              </View>
            ))}
          </View>
          
          {/* Calendar Legend */}
          <View style={styles.calendarLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#E53935' }]} />
              <Text style={styles.legendText}>Push/Chest</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#44bd32' }]} />
              <Text style={styles.legendText}>Pull/Back</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#0097e6' }]} />
              <Text style={styles.legendText}>Legs/Shoulders</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#666' }]} />
              <Text style={styles.legendText}>Rest</Text>
            </View>
          </View>
        </View>

        {/* Workout Split Info */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Workout Split</Text>
          
          <View style={styles.splitInfo}>
            <View style={styles.splitItem}>
              <Ionicons name="calendar" size={20} color="#E53935" />
              <Text style={styles.splitText}>{workoutSplit.replace('_', ' ').toUpperCase()}</Text>
            </View>
            {includeCardio && (
              <View style={styles.splitItem}>
                <Ionicons name="heart" size={20} color="#44bd32" />
                <Text style={styles.splitText}>{cardioType.toUpperCase()} CARDIO</Text>
              </View>
            )}
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  todayCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  todayHeader: {
    marginBottom: 16,
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  todayDate: {
    fontSize: 14,
    color: '#666',
  },
  workoutInfo: {
    alignItems: 'center',
  },
  workoutTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutTypeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  workoutType: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  workoutStats: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  startWorkoutButton: {
    backgroundColor: '#E53935',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startWorkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  restDayContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  restDayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 12,
    marginBottom: 4,
  },
  restDayText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  calendarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  calendarDayWrapper: {
    width: '14%',
    aspectRatio: 1,
    marginBottom: 12,
    marginHorizontal: 1,
  },
  calendarDay: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  today: {
    backgroundColor: '#E53935',
    borderColor: '#E53935',
  },
  selectedDay: {
    backgroundColor: '#0097e6',
    borderColor: '#0097e6',
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  todayText: {
    color: '#fff',
  },
  selectedDayText: {
    color: '#fff',
  },
  dayType: {
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '500',
  },
  splitInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  splitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  splitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  exerciseCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseDetail: {
    fontSize: 12,
    color: '#666',
  },
  calendarLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '48%',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
}); 