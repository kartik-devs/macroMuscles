import React, { useState, useEffect, useMemo } from 'react';
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
import { getWorkoutHistory } from '../api/workouts';

export default function WorkoutMain({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [introSeen, setIntroSeen] = useState(null); // null=loading, true/false after check
  const [userProfile, setUserProfile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = async () => {
    try {
      const seen = await AsyncStorage.getItem('workout_intro_seen');
      setIntroSeen(seen === 'true');
      const id = await getCurrentUserId();
      setUserId(id);
      if (id) {
        const profile = await getUserProfile(id);
        setUserProfile(profile);
        try {
          const recent = await getWorkoutHistory(id);
          setHistory(recent || []);
        } catch {}
      }
    } catch (error) {
      console.error('Error loading workout page:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPreferences = !!(userProfile && userProfile.workout_split);

  const todayPlan = useMemo(() => {
    if (!hasPreferences) return null;
    const split = userProfile.workout_split;
    const weekday = new Date().getDay(); // 0=Sun ... 6=Sat
    if (split === 'push_pull_legs') {
      const mapping = ['Rest', 'Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs'];
      return mapping[weekday] || 'Rest';
    }
    if (split === 'upper_lower') {
      const mapping = ['Rest', 'Upper', 'Lower', 'Upper', 'Lower', 'Upper', 'Lower'];
      return mapping[weekday] || 'Rest';
    }
    if (split === 'full_body') {
      return weekday === 0 ? 'Rest' : 'Full Body';
    }
    if (split === 'bro_split') {
      const mapping = ['Rest', 'Chest/Triceps', 'Back/Biceps', 'Shoulders', 'Legs', 'Arms', 'Core'];
      return mapping[weekday] || 'Rest';
    }
    return 'Custom';
  }, [userProfile, hasPreferences]);

  const navigateToPreferences = () => {
    navigation.navigate('WorkoutPreferences');
  };

  const openPlan = () => {
    if (!userProfile) return;
    navigation.navigate('MonthlyWorkoutPlan', {
      workoutSplit: userProfile.workout_split,
      includeCardio: userProfile.include_cardio || false,
      cardioType: userProfile.cardio_type || 'mid',
    });
  };

  const quickStart = () => {
    if (!hasPreferences) return navigateToPreferences();
    openPlan();
  };

  const onIntroContinue = async () => {
    try {
      await AsyncStorage.setItem('workout_intro_seen', 'true');
      setIntroSeen(true);
      if (!hasPreferences) return navigateToPreferences();
    } catch {}
  };

  if (loading || introSeen === null) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E53935" />
          <Text style={styles.loadingText}>Loading your workout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // First-time intro
  if (!introSeen) {
    return (
      <SafeAreaView style={styles.introContainer} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.introContent}>
          <Ionicons name="barbell" size={56} color="#fff" />
          <Text style={styles.introTitle}>Welcome to Workouts</Text>
          <Text style={styles.introSubtitle}>Personalized plans, quick start, and progress tracking.</Text>
          <View style={styles.introFeatureRow}>
            <Ionicons name="flash" size={20} color="#fff" />
            <Text style={styles.introFeatureText}>Quick-start today's session</Text>
          </View>
          <View style={styles.introFeatureRow}>
            <Ionicons name="calendar" size={20} color="#fff" />
            <Text style={styles.introFeatureText}>See your monthly plan</Text>
          </View>
          <TouchableOpacity style={styles.introPrimaryButton} onPress={onIntroContinue}>
            <Text style={styles.introPrimaryText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#000" />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Main redesigned page
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.headerTitle}>Workouts</Text>
              <Text style={styles.headerSubtitle}>
                {hasPreferences ? `Split: ${userProfile.workout_split.replaceAll('_', ' ')}` : 'Set your preferences to get a plan'}
              </Text>
            </View>
            <TouchableOpacity onPress={navigateToPreferences} style={{ backgroundColor: '#111', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="options-outline" size={16} color="#fff" />
              <Text style={{ color: '#fff', marginLeft: 8, fontWeight: '600' }}>Preferences</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today card */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Today</Text>
          {hasPreferences ? (
            <View style={styles.infoCard}>
              <Ionicons name="flash" size={28} color="#fff" />
              <Text style={styles.infoTitle}>{todayPlan}</Text>
              <Text style={styles.infoText}>
                Tap Quick Start to jump in, or open your monthly plan.
              </Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity style={styles.primaryButton} onPress={quickStart}>
                  <Text style={styles.primaryButtonText}>Quick Start</Text>
                  <Ionicons name="play" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.primaryButton, { backgroundColor: '#333' }]} onPress={openPlan}>
                  <Text style={[styles.primaryButtonText, { color: '#fff' }]}>View Plan</Text>
                  <Ionicons name="calendar" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.infoCard}>
              <Ionicons name="settings" size={28} color="#fff" />
              <Text style={styles.infoTitle}>Set your preferences</Text>
              <Text style={styles.infoText}>Choose a split and cardio options to generate your plan.</Text>
              <TouchableOpacity style={styles.primaryButton} onPress={navigateToPreferences}>
                <Text style={styles.primaryButtonText}>Open Preferences</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Recent workouts */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          {history && history.length > 0 ? (
            <View style={{ gap: 12 }}>
              {history.slice(0, 5).map((item) => (
                <View key={item._id || String(item.id)} style={{ backgroundColor: '#111', borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{ color: '#fff', fontWeight: '600' }}>{item.workout_type || 'Workout'}</Text>
                    <Text style={{ color: '#aaa', marginTop: 2 }}>{(item.duration || 0)} min · {(item.calories_burned || 0)} kcal</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#888" />
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ color: '#888' }}>No workouts yet. Start your first session today!</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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