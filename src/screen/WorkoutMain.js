import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentUserId } from '../api/auth';
import { getUserProfile } from '../api/profile';

export default function WorkoutMain({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [hasPreferences, setHasPreferences] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    checkUserPreferences();
  }, []);

  const checkUserPreferences = async () => {
    try {
      const userId = await getCurrentUserId();
      if (userId) {
        const profile = await getUserProfile(userId);
        setUserProfile(profile);
        setHasPreferences(!!profile.workout_split);
      }
    } catch (error) {
      console.error('Error checking preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToPreferences = () => {
    navigation.navigate('WorkoutPreferences');
  };

  const navigateToMonthlyPlan = () => {
    if (userProfile) {
      navigation.navigate('MonthlyWorkoutPlan', {
        workoutSplit: userProfile.workout_split,
        includeCardio: userProfile.include_cardio || false,
        cardioType: userProfile.cardio_type || 'mid',
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E53935" />
          <Text style={styles.loadingText}>Loading your workout plan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // If user has preferences, show monthly plan directly
  if (hasPreferences) {
    navigateToMonthlyPlan();
    return null; // Return null to prevent rendering while navigating
  }

  // Only show setup screen for first-time users
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Workout</Text>
          <Text style={styles.headerSubtitle}>
            Set up your workout preferences to get started
          </Text>
        </View>

        {/* First time user - show setup */}
        <View style={styles.contentContainer}>
          <View style={styles.infoCard}>
            <Ionicons name="fitness" size={48} color="#E53935" />
            <Text style={styles.infoTitle}>Welcome to Workouts!</Text>
            <Text style={styles.infoText}>
              Let's set up your personalized workout plan. We'll ask you about your preferred workout split and cardio preferences.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={navigateToPreferences}>
              <Text style={styles.primaryButtonText}>GET STARTED</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>What to Expect</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.featureText}>Monthly workout calendar</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="barbell-outline" size={20} color="#666" />
                <Text style={styles.featureText}>Personalized exercise plans</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="heart-outline" size={20} color="#666" />
                <Text style={styles.featureText}>Cardio integration</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="trophy-outline" size={20} color="#666" />
                <Text style={styles.featureText}>Progress tracking</Text>
              </View>
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
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
  contentContainer: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#E53935',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
}); 