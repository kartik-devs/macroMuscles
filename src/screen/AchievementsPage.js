import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentUserId } from '../api/auth';
import { getUserBadges, getUserLevel } from '../api/profileEnhancements';
import { getAchievements, getUserStatistics } from '../api/profile';

export default function AchievementsPage({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [badges, setBadges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [userLevel, setUserLevel] = useState({ level: 1, experience_points: 0 });
  const [stats, setStats] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
      
      if (id) {
        const [badgesData, achievementsData, levelData, statsData] = await Promise.all([
          getUserBadges(id),
          getAchievements(id),
          getUserLevel(id),
          getUserStatistics(id)
        ]);
        
        setBadges(badgesData);
        setAchievements(achievementsData);
        setUserLevel(levelData);
        setStats(statsData);
      }
    };
    
    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Level Progress */}
        <View style={styles.levelSection}>
          <View style={styles.levelBadge}>
            <Ionicons name="star" size={32} color="#f39c12" />
            <Text style={styles.levelText}>Level {userLevel.level}</Text>
          </View>
          <Text style={styles.xpText}>{userLevel.experience_points} XP</Text>
          <Text style={styles.nextLevelText}>
            {1000 - (userLevel.experience_points % 1000)} XP to next level
          </Text>
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges ({badges.length})</Text>
          <View style={styles.badgesGrid}>
            {badges.map((badge, index) => (
              <View key={index} style={styles.badgeCard}>
                <View style={[styles.badgeIcon, { backgroundColor: badge.color }]}>
                  <Ionicons name={badge.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.badgeName}>{badge.name}</Text>
                <Text style={styles.badgeDescription}>{badge.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medals ({achievements.length})</Text>
          {achievements.length === 0 ? (
            <Text style={styles.noDataText}>Complete workouts to earn medals!</Text>
          ) : (
            achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementCard}>
                <Ionicons 
                  name="medal" 
                  size={32} 
                  color={achievement.level === 'gold' ? '#FFD700' : 
                         achievement.level === 'silver' ? '#C0C0C0' : '#CD7F32'} 
                />
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.description}</Text>
                  <Text style={styles.achievementLevel}>{achievement.level} medal</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Progress Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.total_workouts || 0}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.current_streak || 0}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.longest_streak || 0}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1a1a1a',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  levelSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#2a2a2a',
    marginBottom: 20,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 10,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f39c12',
    marginLeft: 8,
  },
  xpText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  nextLevelText: {
    fontSize: 14,
    color: '#888',
  },
  section: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#3a3a3a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  badgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  badgeDescription: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a3a3a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  achievementInfo: {
    marginLeft: 15,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  achievementLevel: {
    fontSize: 14,
    color: '#888',
    textTransform: 'capitalize',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#3a3a3a',
    borderRadius: 12,
    padding: 15,
    width: '30%',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0097e6',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  noDataText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    paddingVertical: 20,
  },
});