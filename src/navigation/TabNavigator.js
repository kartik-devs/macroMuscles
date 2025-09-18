import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Import theme
import { useTheme } from '../theme/ThemeContext';

// Screens
import Dashboard from '../screen/Dashboard';
import DietPage from '../screen/DietPage';
import ProfilePage from '../screen/ProfilePage';
import SocialFeed from '../screen/social/SocialFeed';
import Friends from '../screen/social/Friends';
import ShareWorkout from '../screen/social/ShareWorkout';
import Comments from '../screen/social/Comments';
import UserProfile from '../screen/social/UserProfile';
import WorkoutMain from '../screen/WorkoutMain';
import WorkoutPreferences from '../screen/WorkoutPreferences';
import MonthlyWorkoutPlan from '../screen/MonthlyWorkoutPlan';
import DailyWorkout from '../screen/DailyWorkout';
import Settings from '../screen/Settings';
import BodyMeasurementScreen from '../screen/BodyMeasurementScreen';


// Create stack navigator for workout screens
const WorkoutStack = createNativeStackNavigator();

function WorkoutStackScreen() {
  return (
    <WorkoutStack.Navigator screenOptions={{ headerShown: false }}>
      <WorkoutStack.Screen name="WorkoutMain" component={WorkoutMain} />
      <WorkoutStack.Screen name="WorkoutPreferences" component={WorkoutPreferences} />
      <WorkoutStack.Screen name="MonthlyWorkoutPlan" component={MonthlyWorkoutPlan} />
      <WorkoutStack.Screen name="DailyWorkout" component={DailyWorkout} />
    </WorkoutStack.Navigator>
  );
}

// Create stack navigator for social screens
const SocialStack = createNativeStackNavigator();

function SocialStackScreen() {
  return (
    <SocialStack.Navigator screenOptions={{ headerShown: false }}>
      <SocialStack.Screen name="SocialFeed" component={SocialFeed} />
      <SocialStack.Screen name="Friends" component={Friends} />
      <SocialStack.Screen name="ShareWorkout" component={ShareWorkout} />
      <SocialStack.Screen name="Comments" component={Comments} />
      <SocialStack.Screen name="UserProfile" component={UserProfile} />
      <SocialStack.Screen name="Settings" component={Settings} />
      <SocialStack.Screen name="BodyMeasurementsScreen" component={BodyMeasurementScreen} />
    </SocialStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Workout') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Diet') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          height: 58,
          paddingBottom: 6,
          paddingTop: 6,
          elevation: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Social" component={SocialStackScreen} 
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? "people" : "people-outline"} size={size} color={color} />
          )
        }}
      />
      <Tab.Screen name="Workout" component={WorkoutStackScreen} />
      <Tab.Screen name="Diet" component={DietPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
  // Removed floating middle button styles for a simpler tab bar
}); 