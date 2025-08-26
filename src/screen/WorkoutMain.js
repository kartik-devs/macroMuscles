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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentUserId } from '../api/auth';
import { getUserProfile } from '../api/profile';

export default function WorkoutMain({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [hasPreferences, setHasPreferences] = useState(false);
  const [introSeen, setIntroSeen] = useState(null); // null=loading, true/false after check
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    checkIntroAndPreferences();
  }, []);

  // Navigate based on intro and preferences without rendering blank screen
  useEffect(() => {
    if (loading || introSeen === null) return;
    if (introSeen && hasPreferences && userProfile) {
      navigation.replace('MonthlyWorkoutPlan', {
        workoutSplit: userProfile.workout_split,
        includeCardio: userProfile.include_cardio || false,
        cardioType: userProfile.cardio_type || 'mid',
      });
    } else if (introSeen && !hasPreferences) {
      navigation.replace('WorkoutPreferences');
    }
  }, [loading, introSeen, hasPreferences, userProfile]);

  const checkIntroAndPreferences = async () => {
    try {
      const seen = await AsyncStorage.getItem('workout_intro_seen');
      setIntroSeen(seen === 'true');
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

  const navigateToPlan = () => {
    if (userProfile) {
      navigation.replace('MonthlyWorkoutPlan', {
        workoutSplit: userProfile.workout_split,
        includeCardio: userProfile.include_cardio || false,
        cardioType: userProfile.cardio_type || 'mid',
      });
    }
  };

  const onIntroContinue = async () => {
    try {
      await AsyncStorage.setItem('workout_intro_seen', 'true');
      setIntroSeen(true);
      navigation.replace('WorkoutPreferences');
    } catch (e) {
      navigation.replace('WorkoutPreferences');
    }
  };

  if (loading || introSeen === null) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E53935" />
          <Text style={styles.loadingText}>Loading your workout plan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // If intro has been seen and user has preferences, effect will redirect
  if (introSeen && hasPreferences) return null;

  // Intro screen (shown only once ever)
  if (!introSeen) {
    return (
      <SafeAreaView style={styles.introContainer} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.introContent}>
          <Ionicons name="barbell" size={56} color="#fff" />
          <Text style={styles.introTitle}>Welcome to Workouts</Text>
          <Text style={styles.introSubtitle}>Personalized weekly plans, quick start, and simple tracking.</Text>
          <View style={styles.introFeatureRow}>
            <Ionicons name="flash" size={20} color="#fff" />
            <Text style={styles.introFeatureText}>Quick-start today's session</Text>
          </View>
          <View style={styles.introFeatureRow}>
            <Ionicons name="calendar" size={20} color="#fff" />
            <Text style={styles.introFeatureText}>Clean weekly view</Text>
          </View>
          <View style={styles.introFeatureRow}>
            <Ionicons name="heart" size={20} color="#fff" />
            <Text style={styles.introFeatureText}>Optional cardio integration</Text>
          </View>
          <TouchableOpacity style={styles.introPrimaryButton} onPress={onIntroContinue}>
            <Text style={styles.introPrimaryText}>Set Preferences</Text>
            <Ionicons name="arrow-forward" size={20} color="#000" />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // If intro seen but no preferences yet, effect will redirect
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
    backgroundColor: '#000',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#aaa',
    lineHeight: 22,
  },
  contentContainer: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#aaa',
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
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
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
    color: '#aaa',
    marginLeft: 12,
  },

  // Intro specific styles (pure black UI)
  introContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  introContent: {
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  introTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 12,
  },
  introSubtitle: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },
  introFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  introFeatureText: {
    color: '#ddd',
    fontSize: 14,
  },
  introPrimaryButton: {
    marginTop: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  introPrimaryText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
}); 