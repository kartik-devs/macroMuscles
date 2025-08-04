import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getCurrentUserId } from '../api/auth';
import { saveUserProfile, getUserProfile } from '../api/profile';
import { getRecommendedExercises } from './diets/data/exerciseData';

const Tab = createBottomTabNavigator();

// User Preferences Screen
function UserPreferencesScreen({ navigation }) {
  const [selectedDietPreference, setSelectedDietPreference] = useState('');
  const [selectedWorkoutSplit, setSelectedWorkoutSplit] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const id = await getCurrentUserId();
        setUserId(id);
        
        if (id) {
          const userProfile = await getUserProfile(id);
          if (userProfile.diet_preference) {
            setSelectedDietPreference(userProfile.diet_preference);
          }
          if (userProfile.workout_split) {
            setSelectedWorkoutSplit(userProfile.workout_split);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, []);

  const dietPreferences = [
    { id: 'weight_loss', name: 'Weight Loss', icon: 'trending-down', color: '#E53935' },
    { id: 'muscle_gain', name: 'Muscle Gain', icon: 'barbell', color: '#44bd32' },
    { id: 'maintenance', name: 'Maintenance', icon: 'fitness', color: '#0097e6' },
    { id: 'vegan', name: 'Vegan', icon: 'leaf', color: '#16a085' },
    { id: 'vegetarian', name: 'Vegetarian', icon: 'egg-outline', color: '#f39c12' },
    { id: 'keto', name: 'Keto', icon: 'flame', color: '#8e44ad' },
  ];

  const workoutSplits = [
    { id: 'push_pull_legs', name: 'Push/Pull/Legs', icon: 'body', color: '#E53935' },
    { id: 'upper_lower', name: 'Upper/Lower', icon: 'fitness', color: '#44bd32' },
    { id: 'full_body', name: 'Full Body', icon: 'body-outline', color: '#0097e6' },
    { id: 'bro_split', name: 'Bro Split', icon: 'barbell', color: '#8e44ad' },
  ];

  const handleContinue = async () => {
    if (!selectedDietPreference || !selectedWorkoutSplit) {
      Alert.alert('Missing Information', 'Please select both diet preference and workout split.');
      return;
    }

    try {
      if (userId) {
        await saveUserProfile({
          user_id: userId,
          diet_preference: selectedDietPreference,
          workout_split: selectedWorkoutSplit,
        });
      }
      
      navigation.navigate('RecommendedDietPlan', {
        dietPreference: selectedDietPreference,
        workoutSplit: selectedWorkoutSplit,
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
          <Text style={styles.headerTitle}>Personalized Recommendations</Text>
          <Text style={styles.headerSubtitle}>
            Tell us about your preferences to get personalized diet and workout recommendations
          </Text>
        </View>

        {/* Diet Preference Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Diet Preference</Text>
          <Text style={styles.sectionSubtitle}>What's your primary diet goal?</Text>
          
          <View style={styles.optionsContainer}>
            {dietPreferences.map((pref) => (
              <TouchableOpacity
                key={pref.id}
                style={[
                  styles.optionCard,
                  selectedDietPreference === pref.id && styles.selectedOptionCard,
                  { borderColor: pref.color }
                ]}
                onPress={() => setSelectedDietPreference(pref.id)}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name={pref.icon} 
                  size={24} 
                  color={selectedDietPreference === pref.id ? '#fff' : pref.color} 
                />
                <Text style={[
                  styles.optionText,
                  selectedDietPreference === pref.id && styles.selectedOptionText
                ]}>
                  {pref.name}
                </Text>
                {selectedDietPreference === pref.id && (
                  <View style={[styles.checkmark, { backgroundColor: pref.color }]}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Workout Split Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Workout Split</Text>
          <Text style={styles.sectionSubtitle}>How do you like to organize your workouts?</Text>
          
          <View style={styles.optionsContainer}>
            {workoutSplits.map((split) => (
              <TouchableOpacity
                key={split.id}
                style={[
                  styles.optionCard,
                  selectedWorkoutSplit === split.id && styles.selectedOptionCard,
                  { borderColor: split.color }
                ]}
                onPress={() => setSelectedWorkoutSplit(split.id)}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name={split.icon} 
                  size={24} 
                  color={selectedWorkoutSplit === split.id ? '#fff' : split.color} 
                />
                <Text style={[
                  styles.optionText,
                  selectedWorkoutSplit === split.id && styles.selectedOptionText
                ]}>
                  {split.name}
                </Text>
                {selectedWorkoutSplit === split.id && (
                  <View style={[styles.checkmark, { backgroundColor: split.color }]}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedDietPreference || !selectedWorkoutSplit) && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={!selectedDietPreference || !selectedWorkoutSplit}
        >
          <Text style={styles.continueButtonText}>Get Recommendations</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Bottom spacing */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Recommended Diet Plan Screen
function RecommendedDietPlanScreen({route}) {
  const { dietPreference, workoutSplit } = route.params|| {};
  const [activeTab, setActiveTab] = useState('breakfast');
  const [cheatDayUnlocked, setCheatDayUnlocked] = useState(false);

  const defaultDietPreference = dietPreference || 'maintenance';
const defaultWorkoutSplit = workoutSplit || 'push_pull_legs';

  // Diet recommendations based on preferences
  const getDietRecommendations = () => {
    const recommendations = {
      weight_loss: {
        breakfast: [
          { name: 'Oatmeal with berries', calories: 250, protein: 8, carbs: 45, fat: 5 },
          { name: 'Greek yogurt with nuts', calories: 200, protein: 15, carbs: 20, fat: 8 },
          { name: 'Egg white omelette', calories: 180, protein: 20, carbs: 5, fat: 8 },
        ],
        lunch: [
          { name: 'Grilled chicken salad', calories: 300, protein: 35, carbs: 15, fat: 12 },
          { name: 'Tuna with vegetables', calories: 280, protein: 30, carbs: 20, fat: 10 },
          { name: 'Quinoa bowl', calories: 320, protein: 12, carbs: 55, fat: 8 },
        ],
        dinner: [
          { name: 'Salmon with asparagus', calories: 350, protein: 40, carbs: 10, fat: 18 },
          { name: 'Turkey with sweet potato', calories: 380, protein: 35, carbs: 45, fat: 12 },
          { name: 'Lean beef stir-fry', calories: 320, protein: 38, carbs: 25, fat: 10 },
        ],
        snacks: [
          { name: 'Apple with almond butter', calories: 150, protein: 4, carbs: 20, fat: 8 },
          { name: 'Cottage cheese', calories: 120, protein: 14, carbs: 8, fat: 5 },
          { name: 'Carrot sticks with hummus', calories: 100, protein: 3, carbs: 15, fat: 4 },
        ],
        cheat_day: [
          { name: 'Pizza slice', calories: 285, protein: 12, carbs: 35, fat: 12 },
          { name: 'Ice cream cone', calories: 200, protein: 4, carbs: 30, fat: 8 },
          { name: 'Chocolate chip cookie', calories: 150, protein: 2, carbs: 20, fat: 7 },
        ],
      },
      muscle_gain: {
        breakfast: [
          { name: 'Protein pancakes', calories: 450, protein: 25, carbs: 60, fat: 15 },
          { name: 'Eggs with toast', calories: 380, protein: 22, carbs: 45, fat: 18 },
          { name: 'Protein smoothie bowl', calories: 420, protein: 28, carbs: 55, fat: 12 },
        ],
        lunch: [
          { name: 'Chicken rice bowl', calories: 550, protein: 45, carbs: 70, fat: 15 },
          { name: 'Turkey sandwich', calories: 480, protein: 35, carbs: 55, fat: 18 },
          { name: 'Beef stir-fry', calories: 520, protein: 42, carbs: 65, fat: 16 },
        ],
        dinner: [
          { name: 'Steak with potatoes', calories: 600, protein: 50, carbs: 55, fat: 25 },
          { name: 'Salmon with rice', calories: 580, protein: 45, carbs: 60, fat: 22 },
          { name: 'Pork chops with pasta', calories: 620, protein: 48, carbs: 70, fat: 20 },
        ],
        snacks: [
          { name: 'Protein shake', calories: 200, protein: 25, carbs: 15, fat: 5 },
          { name: 'Greek yogurt with granola', calories: 250, protein: 18, carbs: 30, fat: 8 },
          { name: 'Peanut butter sandwich', calories: 280, protein: 12, carbs: 35, fat: 12 },
        ],
        cheat_day: [
          { name: 'Burger with fries', calories: 800, protein: 35, carbs: 85, fat: 35 },
          { name: 'Milkshake', calories: 400, protein: 8, carbs: 60, fat: 15 },
          { name: 'Chocolate cake', calories: 350, protein: 6, carbs: 45, fat: 18 },
        ],
      },
      maintenance: {
        breakfast: [
          { name: 'Avocado toast', calories: 320, protein: 12, carbs: 40, fat: 16 },
          { name: 'Smoothie bowl', calories: 280, protein: 15, carbs: 45, fat: 8 },
          { name: 'Breakfast burrito', calories: 350, protein: 18, carbs: 35, fat: 18 },
        ],
        lunch: [
          { name: 'Mediterranean salad', calories: 380, protein: 20, carbs: 45, fat: 18 },
          { name: 'Soup and sandwich', calories: 420, protein: 25, carbs: 50, fat: 16 },
          { name: 'Pasta primavera', calories: 450, protein: 15, carbs: 65, fat: 14 },
        ],
        dinner: [
          { name: 'Grilled fish with quinoa', calories: 480, protein: 35, carbs: 55, fat: 18 },
          { name: 'Chicken with vegetables', calories: 420, protein: 38, carbs: 40, fat: 16 },
          { name: 'Vegetarian curry', calories: 450, protein: 18, carbs: 60, fat: 16 },
        ],
        snacks: [
          { name: 'Mixed nuts', calories: 180, protein: 6, carbs: 8, fat: 16 },
          { name: 'Fruit and yogurt', calories: 150, protein: 8, carbs: 25, fat: 4 },
          { name: 'Dark chocolate', calories: 120, protein: 2, carbs: 15, fat: 8 },
        ],
        cheat_day: [
          { name: 'Sushi roll', calories: 250, protein: 8, carbs: 45, fat: 6 },
          { name: 'Gelato', calories: 180, protein: 4, carbs: 25, fat: 8 },
          { name: 'Wine and cheese', calories: 200, protein: 6, carbs: 8, fat: 12 },
        ],
      },
    };

    return recommendations[defaultDietPreference] || recommendations.maintenance;
  };

  const dietData = getDietRecommendations();
  const workoutData = getRecommendedExercises(defaultWorkoutSplit, defaultDietPreference);

  const renderMealCard = (meal) => (
    <View style={styles.mealCard}>
      <Text style={styles.mealName}>{meal.name}</Text>
      <View style={styles.mealNutrition}>
        <Text style={styles.nutritionText}>{meal.calories} cal</Text>
        <Text style={styles.nutritionText}>{meal.protein}g protein</Text>
        <Text style={styles.nutritionText}>{meal.carbs}g carbs</Text>
        <Text style={styles.nutritionText}>{meal.fat}g fat</Text>
      </View>
    </View>
  );

  const renderExerciseCard = (exercise) => (
    <View style={styles.exerciseCard}>
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      <View style={styles.exerciseDetails}>
        <Text style={styles.exerciseDetail}>{exercise.sets} sets</Text>
        <Text style={styles.exerciseDetail}>{exercise.reps}</Text>
        <Text style={styles.exerciseDetail}>{exercise.rest} rest</Text>
      </View>
      <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exercise.difficulty) }]}>
        <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
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

  const tabs = [
    { id: 'breakfast', name: 'Breakfast', icon: 'sunny-outline' },
    { id: 'lunch', name: 'Lunch', icon: 'restaurant-outline' },
    { id: 'dinner', name: 'Dinner', icon: 'moon-outline' },
    { id: 'snacks', name: 'Snacks', icon: 'nutrition-outline' },
    { id: 'cheat_day', name: 'Cheat Day', icon: 'happy-outline' },
    { id: 'workouts', name: 'Workouts', icon: 'barbell-outline' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.planHeader}>
        <Text style={styles.planTitle}>Your Recommended Diet Plan</Text>
        <Text style={styles.planSubtitle}>
          Based on your {defaultDietPreference.replace('', ' ')} preference and {defaultWorkoutSplit.replace('', ' ')} split
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                activeTab === tab.id && styles.activeTabButton
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons 
                name={tab.icon} 
                size={20} 
                color={activeTab === tab.id ? '#fff' : '#666'} 
              />
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {activeTab === 'cheat_day' && !cheatDayUnlocked ? (
          <View style={styles.lockedContainer}>
            <Ionicons name="lock-closed" size={64} color="#ccc" />
            <Text style={styles.lockedTitle}>Cheat Day Locked</Text>
            <Text style={styles.lockedSubtitle}>
              Follow your diet consistently for at least 5 days in a row to unlock cheat day recommendations!
            </Text>
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>Progress: 0/5 days</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '0%' }]} />
              </View>
            </View>
          </View>
        ) : activeTab === 'workouts' ? (
          <View style={styles.workoutsContainer}>
            {workoutData.map((day, dayIndex) => (
              <View key={dayIndex} style={styles.workoutDayContainer}>
                <Text style={styles.workoutDayTitle}>{day.day}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {day.exercises.map((exercise, exerciseIndex) => (
                    <View key={exerciseIndex} style={styles.exerciseCardContainer}>
                      {renderExerciseCard(exercise)}
                    </View>
                  ))}
                </ScrollView>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.mealsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {dietData[activeTab]?.map((meal, index) => (
                <View key={index} style={styles.mealCardContainer}>
                  {renderMealCard(meal)}
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Popular Diet Plans Screen
function PopularDietPlansScreen({ navigation }) {
  const dietSections = [
    {
      title: 'Weight Loss',
      diets: [
        {
          name: 'Keto Diet',
          description: 'High-fat, moderate-protein, and very-low-carb diet.',
          features: ['Weight Loss', 'Healthy'],
          icon: 'flame',
          color: '#E53935',
        },
        {
          name: 'Atkins Diet',
          description: 'Low-carb diet with a focus on protein and fat.',
          features: ['Protein and fat', 'Low-carb'],
          icon: 'barbell-outline',
          color: '#8e44ad',
        },
        {
          name: 'Intermittent Fasting',
          description: 'Eat in an 8-hour window, fast for 16.',
          features: ['16:8 fasting', 'Flexible meals'],
          icon: 'time-outline',
          color: '#0097e6',
        },
      ],
    },
    {
      title: 'Muscle Gain',
      diets: [
        {
          name: 'High Protein Diet',
          description: 'Boost muscle with extra protein and calories.',
          features: ['2000-2500 kcal', 'High protein'],
          icon: 'barbell-outline',
          color: '#44bd32',
        },
      ],
    },
    {
      title: 'Lifestyle',
      diets: [
        {
          name: 'Mediterranean Diet',
          description: 'Based on traditional foods of Mediterranean countries.',
          features: ['Heart-healthy', 'Anti-inflammatory'],
          icon: 'leaf-outline',
          color: '#27ae60',
        },
        {
          name: 'Vegan Diet',
          description: 'Plant-based: no animal products.',
          features: ['Plant-based', 'Environmentally friendly'],
          icon: 'leaf',
          color: '#16a085',
        },
        {
          name: 'Vegetarian Diet',
          description: 'No meat or fish, but may include dairy and eggs.',
          features: ['Plant-focused', 'Includes dairy and eggs'],
          icon: 'egg-outline',
          color: '#f39c12',
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Diet List Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Popular Diet Plans</Text>
          {dietSections.map((section, idx) => (
            <View key={idx} style={{ marginBottom: 18 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: '#0097e6' }}>{section.title}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {section.diets.map((diet, dIdx) => (
                  <TouchableOpacity
                    key={dIdx}
                    style={[styles.dietCard, { borderColor: diet.color }]}
                    onPress={() => {
                      switch (diet.name) {
                        case 'Keto Diet':
                          navigation.navigate('KetoDiet');
                          break;
                        case 'Atkins Diet':
                          navigation.navigate('AtkinsDiet');
                          break;
                        case 'Intermittent Fasting':
                          navigation.navigate('IntermittentFastingDiet');
                          break;
                        case 'High Protein Diet':
                          navigation.navigate('HighProteinDiet');
                          break;
                        case 'Mediterranean Diet':
                          navigation.navigate('MediterraneanDiet');
                          break;
                        case 'Vegan Diet':
                          navigation.navigate('VeganDiet');
                          break;
                        case 'Vegetarian Diet':
                          navigation.navigate('VegetarianDiet');
                          break;
                        default:
                          console.log('Diet not implemented yet:', diet.name);
                      }
                    }}
                    activeOpacity={0.85}
                  >
                    <Ionicons name={diet.icon} size={28} color={diet.color} style={{ marginBottom: 6 }} />
                    <Text style={styles.dietName}>{diet.name}</Text>
                    <Text style={styles.dietDesc}>{diet.description}</Text>
                    {diet.features.map((f, i) => (
                      <View key={i} style={styles.dietFeatureRow}>
                        <Ionicons name="checkmark-circle" size={14} color={diet.color} />
                        <Text style={styles.dietFeatureText}> {f}</Text>
                      </View>
                    ))}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ))}
        </View>
        
        {/* Bottom spacing */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Main DietPage Component with Tab Navigator
export default function DietPage({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'PopularDietPlans') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Preferences') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'RecommendedDietPlan') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
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
      <Tab.Screen name="PopularDietPlans" component={PopularDietPlansScreen} />
      <Tab.Screen name="Preferences" component={UserPreferencesScreen} />
      <Tab.Screen name="RecommendedDietPlan" component={RecommendedDietPlanScreen} />
    </Tab.Navigator>
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    position: 'relative',
  },
  selectedOptionCard: {
    backgroundColor: '#E53935',
    borderColor: '#E53935',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 8,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#fff',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
  planHeader: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  planSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  tabContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: '#E53935',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 20,
    marginBottom: 12,
  },
  lockedSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E53935',
    borderRadius: 4,
  },
  mealsContainer: {
    padding: 16,
  },
  mealCardContainer: {
    marginRight: 16,
    width: 280,
  },
  mealCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  mealNutrition: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
    width: '48%',
    textAlign: 'center',
  },
  workoutsContainer: {
    padding: 16,
  },
  workoutDayContainer: {
    marginBottom: 24,
  },
  workoutDayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  exerciseCardContainer: {
    marginRight: 16,
    width: 280,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  exerciseDetail: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  dietCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    marginRight: 16,
    padding: 18,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dietName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  dietDesc: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  dietFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  dietFeatureText: {
    fontSize: 12,
    color: '#444',
  },
}); 