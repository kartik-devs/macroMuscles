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
import { getAchievements, getAllAchievements, getUserStatistics } from '../api/profile';

export default function AchievementsPage({ navigation }) {
  const [userId, setUserId] = useState(null);
  
  const getLevelColor = (level) => {
    switch(level) {
      case 'bronze': return '#CD7F32';
      case 'silver': return '#C0C0C0';
      case 'gold': return '#FFD700';
      case 'platinum': return '#E5E4E2';
      case 'diamond': return '#B9F2FF';
      default: return '#666';
    }
  };
  const [badges, setBadges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [allAchievements, setAllAchievements] = useState([]);
  const [userLevel, setUserLevel] = useState({ level: 1, experience_points: 0 });
  const [stats, setStats] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
      
      if (id) {
        const [badgesData, achievementsData, allAchievementsData, levelData, statsData] = await Promise.all([
          getUserBadges(id),
          getAchievements(id),
          getAllAchievements(id),
          getUserLevel(id),
          getUserStatistics(id)
        ]);
        
        setBadges(badgesData);
        setAchievements(achievementsData);
        setAllAchievements(allAchievementsData);
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

        {/* All Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Achievements</Text>
          {['workout', 'diet', 'challenge', 'master'].map(type => {
            const typeAchievements = allAchievements.filter(a => a.achievement_type === type);
            return (
              <View key={type} style={styles.achievementCategory}>
                <Text style={styles.categoryTitle}>
                  {type.charAt(0).toUpperCase() + type.slice(1)} 
                  ({typeAchievements.filter(a => a.completed).length}/{typeAchievements.length})
                </Text>
                {typeAchievements.map((achievement, index) => (
                  <View key={index} style={[styles.achievementItem, achievement.completed && styles.completedAchievement]}>
                    <View style={styles.achievementLeft}>
                      <Ionicons 
                        name={achievement.completed ? "checkmark-circle" : "radio-button-off"} 
                        size={24} 
                        color={achievement.completed ? "#44bd32" : "#666"} 
                      />
                      <View style={styles.achievementText}>
                        <Text style={[styles.achievementName, { color: achievement.completed ? '#44bd32' : '#fff' }]}>
                          {achievement.achievement_name}
                        </Text>
                        <Text style={styles.achievementDesc}>{achievement.description}</Text>
                      </View>
                    </View>
                    <View style={styles.achievementRight}>
                      <Text style={styles.progressText}>{achievement.progress}/{achievement.target}</Text>
                      <View style={[styles.levelBadge, { backgroundColor: getLevelColor(achievement.level) }]}>
                        <Text style={styles.levelBadgeText}>{achievement.level}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            );
          })}
        </View>

        {/* Recent Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements ({achievements.length})</Text>
          {achievements.length === 0 ? (
            <Text style={styles.noDataText}>Complete activities to earn achievements!</Text>
          ) : (
            achievements.slice(0, 5).map((achievement, index) => (
              <View key={index} style={styles.recentAchievementCard}>
                <Ionicons 
                  name="trophy" 
                  size={32} 
                  color={getLevelColor(achievement.level)} 
                />
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.name}</Text>
                  <Text style={styles.achievementLevel}>{achievement.level} • {achievement.type}</Text>
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
  achievementCategory: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0097e6',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  achievementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  completedAchievement: {
    backgroundColor: '#2d4a2d',
    borderLeftWidth: 4,
    borderLeftColor: '#44bd32',
  },
  achievementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  achievementText: {
    marginLeft: 12,
    flex: 1,
  },
  achievementName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  achievementDesc: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  achievementRight: {
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  levelBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
    textTransform: 'uppercase',
  },
  recentAchievementCard: {
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