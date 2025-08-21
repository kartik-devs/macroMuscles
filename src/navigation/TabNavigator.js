import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Screens
import Dashboard from '../screen/Dashboard';
import DietPage from '../screen/DietPage';
import ProfilePage from '../screen/ProfilePage';
import SocialFeed from '../screen/social/SocialFeed';
import Friends from '../screen/social/Friends';
import ShareWorkout from '../screen/social/ShareWorkout';
import Comments from '../screen/social/Comments';
import WorkoutMain from '../screen/WorkoutMain';
import WorkoutPreferences from '../screen/WorkoutPreferences';
import MonthlyWorkoutPlan from '../screen/MonthlyWorkoutPlan';
import DailyWorkout from '../screen/DailyWorkout';
import Settings from '../screen/Settings';


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
      <SocialStack.Screen name="UserProfile" component={ProfilePage} />
      <SocialStack.Screen name="Settings" component={Settings} />
    </SocialStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { theme } = useTheme();
  
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
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          backgroundColor: theme.colors.tabBar,
          borderRadius: 25,
          borderTopWidth: 0,
          elevation: 15,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
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
      <Tab.Screen 
        name="Workout" 
        component={WorkoutStackScreen} 
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity 
              style={styles.workoutTabContainer}
              onPress={props.onPress}
              activeOpacity={0.8}
            >
              <View style={styles.workoutTab}>
                <Ionicons name="barbell" size={26} color="#fff" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
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
  workoutTabContainer: {
    position: 'absolute',
    bottom: 15,
    height: 70,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    left: '50%',
    transform: [{ translateX: -30 }],
  },
  workoutTab: {
    backgroundColor: '#FF6B35',
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 12,
    bottom: 10,
  },
}); 