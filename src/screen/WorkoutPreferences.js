import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentUserId } from '../api/auth';
import { saveUserProfile, getUserProfile } from '../api/profile';

export default function WorkoutPreferences({ navigation }) {
  const [selectedSplit, setSelectedSplit] = useState('');
  const [includeCardio, setIncludeCardio] = useState(false);
  const [cardioType, setCardioType] = useState('moderate');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const id = await getCurrentUserId();
        setUserId(id);
        
        if (id) {
          const userProfile = await getUserProfile(id);
          if (userProfile.workout_split) {
            setSelectedSplit(userProfile.workout_split);
          }
          if (userProfile.include_cardio !== undefined) {
            setIncludeCardio(userProfile.include_cardio);
          }
          if (userProfile.cardio_type) {
            setCardioType(userProfile.cardio_type);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, []);

  const workoutSplits = [
    { 
      id: 'push_pull_legs', 
      name: 'Push/Pull/Legs', 
      icon: 'body', 
      color: '#E53935',
      description: '3-day split focusing on pushing, pulling, and leg movements',
      frequency: '3-6 days/week'
    },
    { 
      id: 'upper_lower', 
      name: 'Upper/Lower', 
      icon: 'fitness', 
      color: '#44bd32',
      description: '4-day split alternating upper and lower body',
      frequency: '4 days/week'
    },
    { 
      id: 'full_body', 
      name: 'Full Body', 
      icon: 'body-outline', 
      color: '#0097e6',
      description: 'Complete body workout in each session',
      frequency: '3-4 days/week'
    },
    { 
      id: 'bro_split', 
      name: 'Bro Split', 
      icon: 'barbell', 
      color: '#8e44ad',
      description: '5-day split targeting one muscle group per day',
      frequency: '5 days/week'
    },
  ];

  const cardioTypes = [
    { id: 'light', name: 'Light', description: '10-15 min warm-up', color: '#44bd32' },
    { id: 'moderate', name: 'Moderate', description: '20-30 min cardio', color: '#f39c12' },
    { id: 'intense', name: 'Intense', description: '30-45 min HIIT', color: '#E53935' },
  ];

  const handleContinue = async () => {
    if (!selectedSplit) {
      Alert.alert('Missing Information', 'Please select a workout split.');
      return;
    }

    try {
      if (userId) {
        await saveUserProfile({
          user_id: userId,
          workout_split: selectedSplit,
          include_cardio: includeCardio,
          cardio_type: cardioType,
        });
      }
      
      // Navigate to the monthly workout plan
      navigation.navigate('MonthlyWorkoutPlan', {
        workoutSplit: selectedSplit,
        includeCardio: includeCardio,
        cardioType: cardioType,
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Error', 'Failed to save preferences.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Workout Preferences</Text>
          <Text style={styles.headerSubtitle}>
            {selectedSplit ? 'Update your workout preferences' : 'Tell us about your workout preferences to create a personalized monthly plan'}
          </Text>
        </View>

        {/* Workout Split Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Workout Split</Text>
          <Text style={styles.sectionSubtitle}>How would you like to organize your workouts?</Text>
          
          <View style={styles.optionsContainer}>
            {workoutSplits.map((split) => (
              <TouchableOpacity
                key={split.id}
                style={[
                  styles.optionCard,
                  selectedSplit === split.id && styles.selectedOptionCard,
                  { borderColor: split.color }
                ]}
                onPress={() => setSelectedSplit(split.id)}
                activeOpacity={0.8}
              >
                <View style={styles.optionHeader}>
                  <Ionicons 
                    name={split.icon} 
                    size={24} 
                    color={selectedSplit === split.id ? '#fff' : split.color} 
                  />
                  <Text style={[
                    styles.optionName,
                    selectedSplit === split.id && styles.selectedOptionText
                  ]}>
                    {split.name}
                  </Text>
                </View>
                <Text style={[
                  styles.optionDescription,
                  selectedSplit === split.id && styles.selectedOptionText
                ]}>
                  {split.description}
                </Text>
                <Text style={[
                  styles.optionFrequency,
                  selectedSplit === split.id && styles.selectedOptionText
                ]}>
                  {split.frequency}
                </Text>
                {selectedSplit === split.id && (
                  <View style={[styles.checkmark, { backgroundColor: split.color }]}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cardio Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.cardioHeader}>
            <Text style={styles.sectionTitle}>Include Cardio</Text>
            <Switch
              value={includeCardio}
              onValueChange={setIncludeCardio}
              trackColor={{ false: '#767577', true: '#E53935' }}
              thumbColor={includeCardio ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          {includeCardio && (
            <View style={styles.cardioOptions}>
              <Text style={styles.sectionSubtitle}>What type of cardio do you prefer?</Text>
              <View style={styles.cardioButtons}>
                {cardioTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.cardioButton,
                      cardioType === type.id && styles.selectedCardioButton,
                      { borderColor: type.color }
                    ]}
                    onPress={() => setCardioType(type.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.cardioButtonText,
                      cardioType === type.id && styles.selectedCardioButtonText
                    ]}>
                      {type.name}
                    </Text>
                    <Text style={[
                      styles.cardioButtonDescription,
                      cardioType === type.id && styles.selectedCardioButtonText
                    ]}>
                      {type.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedSplit && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={!selectedSplit}
        >
          <Text style={styles.continueButtonText}>
            {selectedSplit ? 'Update Preferences' : 'Generate Monthly Plan'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

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
  optionsContainer: {
    flexDirection: 'column',
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  selectedOptionCard: {
    backgroundColor: '#E53935',
    borderColor: '#E53935',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 12,
  },
  selectedOptionText: {
    color: '#fff',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  optionFrequency: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardioOptions: {
    marginTop: 16,
  },
  cardioButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardioButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  selectedCardioButton: {
    backgroundColor: '#E53935',
    borderColor: '#E53935',
  },
  cardioButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  selectedCardioButtonText: {
    color: '#fff',
  },
  cardioButtonDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#E53935',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
}); 