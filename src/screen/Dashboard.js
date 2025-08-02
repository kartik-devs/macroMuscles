import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  FlatList,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { dashboardStyles } from '../style/dashboardStyles';
import { Ionicons } from '@expo/vector-icons';
import { getUserProfile, getUserStatistics } from '../api/profile';
import { getWorkoutHistory } from '../api/workouts';
import { getCurrentUserId } from '../api/auth';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { getChallengeProgress } from '../api/challenges';

export default function Dashboard({ navigation }) {
  const [userName, setUserName] = useState('User');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    total_workouts: 0,
    total_calories_burned: 0,
    current_streak: 0
  });
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  
  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const id = await getCurrentUserId();
        setUserId(id);
        
        if (id) {
          // Load user profile
          const profile = await getUserProfile(id);
          setUserName(profile.display_name);
          
          // Load user statistics
          const stats = await getUserStatistics(id);
          setUserStats(stats);
          
          // Load recent workout history
          const workouts = await getWorkoutHistory(id);
          setRecentWorkouts(workouts.slice(0, 5)); // Show last 5 workouts
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  // Helper to get all completion dates for the current month
  const getCompletionDates = async (userId) => {
    let workoutDates = [];
    let challengeDates = [];
    if (!userId) return {};
    // Get all workouts
    const workouts = await getWorkoutHistory(userId);
    workoutDates = workouts.map(w => w.completed_at && w.completed_at.split('T')[0]);
    // Get all challenges (for each challenge type)
    const challengeTypes = ['Plank Challenge', 'Cycle Challenge'];
    for (let type of challengeTypes) {
      try {
        const progress = await getChallengeProgress(userId, type);
        challengeDates = challengeDates.concat(progress.map(p => p.completed_at && p.completed_at.split('T')[0]));
      } catch {}
    }
    // Merge and dedupe
    const allDates = Array.from(new Set([...workoutDates, ...challengeDates]));
    // Mark dates for calendar
    const marks = {};
    allDates.forEach(date => {
      marks[date] = {
        marked: true,
        dotColor: '#44bd32',
        customStyles: {
          container: { backgroundColor: '#44bd32', borderRadius: 16 },
          text: { color: 'white', fontWeight: 'bold' }
        }
      };
    });
    return marks;
  };

  // Reload dashboard data on focus
  useFocusEffect(
    React.useCallback(() => {
      const reload = async () => {
        setLoading(true);
        try {
          const id = await getCurrentUserId();
          setUserId(id);
          if (id) {
            const profile = await getUserProfile(id);
            setUserName(profile.display_name);
            const stats = await getUserStatistics(id);
            setUserStats(stats);
            const workouts = await getWorkoutHistory(id);
            setRecentWorkouts(workouts.slice(0, 5));
            const marks = await getCompletionDates(id);
            setMarkedDates(marks);
          }
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        } finally {
          setLoading(false);
        }
      };
      reload();
    }, [])
  );
  
  const popularWorkouts = [
    {
      id: '1',
      title: 'Chest and Back',
      calories: 500,
      duration: 50,
      image: require('../assets/dumbbell.jpg'),
    },
    {
      id: '2',
      title: 'Arms',
      calories: 600,
      duration: 40,
      image: require('../assets/kettle.jpg'),
    },
    {
      id: '3',
      title: 'Legs',
      calories: 900,
      duration: 60,
      image: require('../assets/shirtless.jpg'),
    },
    {
      id: '4',
      title: 'Shoulders',
      calories: 700,
      duration: 45,
      image: require('../assets/dumbbell.jpg'),
    },
  ];

  const popularChallenges = [
    {
      id: '1',
      title: 'Plank Challenge',
      icon: 'flame',
      color: '#e91e63',
    },
    {
      id: '2',
      title: 'Sprint Challenge',
      icon: 'walk-outline', // changed from 'run' to a valid Ionicons name
      color: '#1e272e',
    },
    {
      id: '3',
      title: 'Swimming Challenge',
      icon: 'water',
      color: '#0097e6',
    },
    {
      id: '4',
      title: 'Cycle Challenge',
      icon: 'bicycle',
      color: '#44bd32',
    },
  ];

  const handleWorkoutPress = async (workout) => {
    // Navigate to the main workout screen which will handle preferences check
    navigation.navigate('Workout', { screen: 'WorkoutMain' });
  };

  const renderWorkoutItem = ({ item }) => (
    <TouchableOpacity 
      style={dashboardStyles.workoutCard}
      onPress={() => handleWorkoutPress(item)}
    >
      <ImageBackground 
        source={item.image} 
        style={dashboardStyles.workoutImage}
        imageStyle={{ borderRadius: 12 }}
      >
        <View style={dashboardStyles.workoutOverlay}>
          <Text style={dashboardStyles.workoutTitle}>{item.title}</Text>
          
          <View style={dashboardStyles.workoutStats}>
            <View style={dashboardStyles.statItem}>
              <Ionicons name="flame-outline" size={16} color="white" />
              <Text style={dashboardStyles.statText}>{item.calories} Kcal</Text>
            </View>
            
            <View style={dashboardStyles.statItem}>
              <Ionicons name="time-outline" size={16} color="white" />
              <Text style={dashboardStyles.statText}>{item.duration} Min</Text>
            </View>
          </View>
          
          <View style={dashboardStyles.playButton}>
            <Ionicons name="play" size={20} color="white" />
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderChallengeItem = ({ item }) => (
    <TouchableOpacity 
      style={[dashboardStyles.challengeCard, { backgroundColor: item.color }]}
      onPress={() => {
      if (item.title === 'Plank Challenge') {
          navigation.navigate('PlankChallenge');
        } else if (item.title === 'Cycle Challenge') {
          navigation.navigate('CyclingChallenge');
        } else if (item.title === 'Sprint Challenge') {
          navigation.navigate('SprintChallenge');
        } else if (item.title === 'Swimming Challenge') {
          navigation.navigate('SwimChallenge');
        } else {  
          console.log(`Selected challenge: ${item.title}`);
        }
      }}
    >
      <Ionicons name={item.icon} size={32} color="white" />
      <Text style={dashboardStyles.challengeTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderRecentWorkout = ({ item }) => (
    <View style={dashboardStyles.recentWorkoutItem}>
      <View style={dashboardStyles.recentWorkoutInfo}>
        <Text style={dashboardStyles.recentWorkoutTitle}>{item.workout_type}</Text>
        <Text style={dashboardStyles.recentWorkoutDate}>
          {new Date(item.completed_at).toLocaleDateString()}
        </Text>
      </View>
      <View style={dashboardStyles.recentWorkoutStats}>
        <Text style={dashboardStyles.recentWorkoutCalories}>{item.calories_burned} cal</Text>
        <Text style={dashboardStyles.recentWorkoutDuration}>{item.duration} min</Text>
      </View>
    </View>
  );

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  return (
    <SafeAreaView style={dashboardStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={dashboardStyles.header}>
          <View>
            <Text style={dashboardStyles.welcomeText}>Hello, welcome back</Text>
            <Text style={dashboardStyles.userName}>{userName}</Text>
          </View>
        </View>

        {/* User Stats Section */}
        <View style={dashboardStyles.sectionContainer}>
          <Text style={dashboardStyles.sectionTitle}>Your Progress</Text>
          <View style={dashboardStyles.statsContainer}>
            <View style={dashboardStyles.statCard}>
              <Ionicons name="fitness-outline" size={24} color="#0097e6" />
              <Text style={dashboardStyles.statNumber}>{userStats.total_workouts}</Text>
              <Text style={dashboardStyles.statLabel}>Workouts</Text>
            </View>
            
            <View style={dashboardStyles.statCard}>
              <Ionicons name="flame-outline" size={24} color="#e91e63" />
              <Text style={dashboardStyles.statNumber}>{userStats.total_calories_burned}</Text>
              <Text style={dashboardStyles.statLabel}>Calories</Text>
            </View>
            
            <View style={dashboardStyles.statCard}>
              <Ionicons name="trending-up-outline" size={24} color="#44bd32" />
              <Text style={dashboardStyles.statNumber}>{userStats.current_streak}</Text>
              <Text style={dashboardStyles.statLabel}>Streak</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={dashboardStyles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={dashboardStyles.searchIcon} />
          <TextInput
            style={dashboardStyles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999"
          />
        </View>

        {/* Popular Workouts Section */}
        <View style={dashboardStyles.sectionContainer}>
          <Text style={dashboardStyles.sectionTitle}>Popular Workouts</Text>
          <FlatList
            data={popularWorkouts}
            renderItem={renderWorkoutItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={dashboardStyles.workoutList}
          />
        </View>

        {/* Popular Challenges Section */}
        <View style={dashboardStyles.sectionContainer}>
          <Text style={dashboardStyles.sectionTitle}>Popular Challenges</Text>
          <FlatList
            data={popularChallenges}
            renderItem={renderChallengeItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={dashboardStyles.challengeList}
          />
        </View>

        {/* Recent Workouts Section */}
        {recentWorkouts.length > 0 && (
          <View style={dashboardStyles.sectionContainer}>
            <Text style={dashboardStyles.sectionTitle}>Recent Workouts</Text>
            <FlatList
              data={recentWorkouts}
              renderItem={renderRecentWorkout}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Consistency Report Section */}
        <View style={dashboardStyles.sectionContainer}>
          <Text style={dashboardStyles.sectionTitle}>Consistency Report</Text>
          <View style={dashboardStyles.calendarContainer}>
            <View style={dashboardStyles.calendarHeader}>
              <TouchableOpacity>
                <Ionicons name="chevron-back" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={dashboardStyles.calendarTitle}>{currentMonth} {currentYear}</Text>
              <TouchableOpacity>
                <Ionicons name="chevron-forward" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            {/* Calendar Days Header removed, replaced by Calendar component */}
            <Calendar
              markingType={'custom'}
              markedDates={markedDates}
              theme={{
                todayTextColor: '#e91e63',
                arrowColor: '#0097e6',
                textSectionTitleColor: '#666',
                selectedDayBackgroundColor: '#44bd32',
                selectedDayTextColor: '#fff',
                dotColor: '#44bd32',
                'stylesheet.day.basic': {
                  base: { height: 36, width: 36, alignItems: 'center', justifyContent: 'center' },
                  text: { fontSize: 14 }
                }
              }}
              style={{ borderRadius: 12 }}
            />
          </View>
        </View>
        
        {/* Bottom spacing */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
} 