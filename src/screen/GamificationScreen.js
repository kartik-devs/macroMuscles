import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserLevel, getUserBadges } from '../api/profileEnhancements';
import { getCurrentUserId } from '../api/auth';

export default function GamificationScreen({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [userLevel, setUserLevel] = useState({ level: 1, experience_points: 0 });
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    try {
      const id = await getCurrentUserId();
      setUserId(id);
      if (id) {
        try {
          const [levelData, badgesData] = await Promise.all([
            getUserLevel(id),
            getUserBadges(id),
          ]);
          setUserLevel(levelData);
          setBadges(badgesData);
          
          // Animate progress bar
          const progress = (levelData.experience_points % 100) / 100;
          Animated.timing(progressAnim, {
            toValue: progress,
            duration: 1000,
            useNativeDriver: false,
          }).start();
        } catch (apiError) {
          console.log('API not available, using defaults');
          // Use default values if API fails
          setBadges([]);
        }
      }
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNextLevelXP = () => {
    return userLevel.level * 100;
  };

  const getCurrentLevelProgress = () => {
    return userLevel.experience_points % 100;
  };

  const BadgeCard = ({ badge }) => (
    <View style={styles.badgeCard}>
      <View style={[styles.badgeIcon, { backgroundColor: badge.color || '#0097e6' }]}>
        <Ionicons name={badge.icon || 'trophy'} size={24} color="#fff" />
      </View>
      <Text style={styles.badgeName}>{badge.name}</Text>
      <Text style={styles.badgeDescription}>{badge.description}</Text>
      <Text style={styles.badgeDate}>
        Earned {new Date(badge.earned_at).toLocaleDateString()}
      </Text>
    </View>
  );

  const LevelCard = ({ level, title, description, isUnlocked }) => (
    <View style={[styles.levelCard, !isUnlocked && styles.lockedLevelCard]}>
      <View style={[styles.levelNumber, !isUnlocked && styles.lockedLevelNumber]}>
        <Text style={[styles.levelNumberText, !isUnlocked && styles.lockedText]}>
          {level}
        </Text>
      </View>
      <View style={styles.levelInfo}>
        <Text style={[styles.levelTitle, !isUnlocked && styles.lockedText]}>
          {title}
        </Text>
        <Text style={[styles.levelDescription, !isUnlocked && styles.lockedText]}>
          {description}
        </Text>
      </View>
      {!isUnlocked && (
        <Ionicons name="lock-closed" size={20} color="#ccc" />
      )}
    </View>
  );

  const levels = [
    { level: 1, title: 'Beginner', description: 'Just getting started!' },
    { level: 5, title: 'Novice', description: 'Building good habits' },
    { level: 10, title: 'Intermediate', description: 'Making real progress' },
    { level: 20, title: 'Advanced', description: 'Fitness enthusiast' },
    { level: 30, title: 'Expert', description: 'Workout master' },
    { level: 50, title: 'Legend', description: 'Fitness legend!' },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <View style={styles.loadingContainer}>
          <Text>Loading achievements...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Current Level Section */}
        <View style={styles.currentLevelSection}>
          <View style={styles.levelDisplay}>
            <View style={styles.currentLevelCircle}>
              <Text style={styles.currentLevelText}>{userLevel.level}</Text>
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.currentLevelTitle}>Level {userLevel.level}</Text>
              <Text style={styles.experienceText}>
                {getCurrentLevelProgress()}/{getNextLevelXP()} XP
              </Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {100 - getCurrentLevelProgress()} XP to next level
            </Text>
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="trophy" size={20} color="#f39c12" /> Badges Earned ({badges.length})
          </Text>
          {badges.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="medal-outline" size={64} color="#ccc" />
              <Text style={styles.emptyStateText}>No badges yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Complete workouts and challenges to earn badges!
              </Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {badges.map((badge, index) => (
                <BadgeCard key={index} badge={badge} />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Level Progression */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="trending-up" size={20} color="#0097e6" /> Level Progression
          </Text>
          {levels.map((levelData, index) => (
            <LevelCard
              key={index}
              level={levelData.level}
              title={levelData.title}
              description={levelData.description}
              isUnlocked={userLevel.level >= levelData.level}
            />
          ))}
        </View>

        {/* XP Sources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="information-circle" size={20} color="#44bd32" /> How to Earn XP
          </Text>
          <View style={styles.xpSource}>
            <Ionicons name="fitness" size={20} color="#E53935" />
            <Text style={styles.xpSourceText}>Complete a workout: +20 XP</Text>
          </View>
          <View style={styles.xpSource}>
            <Ionicons name="trophy" size={20} color="#f39c12" />
            <Text style={styles.xpSourceText}>Finish a challenge: +50 XP</Text>
          </View>
          <View style={styles.xpSource}>
            <Ionicons name="flame" size={20} color="#E53935" />
            <Text style={styles.xpSourceText}>Daily streak: +10 XP</Text>
          </View>
          <View style={styles.xpSource}>
            <Ionicons name="people" size={20} color="#0097e6" />
            <Text style={styles.xpSourceText}>Add a friend: +15 XP</Text>
          </View>
        </View>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentLevelSection: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 20,
  },
  levelDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  currentLevelCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0097e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  currentLevelText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  currentLevelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  experienceText: {
    fontSize: 16,
    color: '#666',
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0097e6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeCard: {
    alignItems: 'center',
    marginRight: 15,
    width: 120,
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  badgeDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  badgeDate: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lockedLevelCard: {
    opacity: 0.5,
  },
  levelNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0097e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  lockedLevelNumber: {
    backgroundColor: '#ccc',
  },
  levelNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  lockedText: {
    color: '#999',
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  levelDescription: {
    fontSize: 14,
    color: '#666',
  },
  xpSource: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  xpSourceText: {
    fontSize: 14,
    marginLeft: 10,
    color: '#333',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 15,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
});