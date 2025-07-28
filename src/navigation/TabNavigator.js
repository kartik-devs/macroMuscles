import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Screens
import Dashboard from '../screen/Dashboard';
import DietPage from '../screen/DietPage';
import ProfilePage from '../screen/ProfilePage';
import SocialFeed from '../screen/social/SocialFeed';
import Friends from '../screen/social/Friends';
import ShareWorkout from '../screen/social/ShareWorkout';
import Comments from '../screen/social/Comments';


// Placeholder screens
const History = () => (
  <View style={styles.container}>
    <Text style={styles.text}>History Screen</Text>
  </View>
);

const Workout = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Workout Screen</Text>
  </View>
);

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
    </SocialStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
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
        tabBarActiveTintColor: '#E53935',
        tabBarInactiveTintColor: '#777',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 60,
          paddingBottom: 5,
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
        component={Workout} 
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
    bottom: 0,
    height: 60,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutTab: {
    backgroundColor: '#E53935',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
    bottom: 5,
  },
}); 