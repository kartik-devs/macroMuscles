  import React, { useState, useRef, useEffect } from 'react';
  import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
    TextInput,
    Alert,
  } from 'react-native';
  import { Ionicons } from '@expo/vector-icons';
  import { saveChallengeProgress, getChallengeProgress } from '../../api/challenges';
  import { getCurrentUserId } from '../../api/auth';
          
  const { width } = Dimensions.get('window');

  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(1, '0');
    return `${h}:${m}:${s}`;
  }

  export default function CyclingChallenge({ navigation }) {
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [distance, setDistance] = useState('0.0');
    const [speed, setSpeed] = useState('0.0');
    const [history, setHistory] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const intervalRef = useRef(null);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    // Get user ID and load history on component mount
    useEffect(() => {
      const loadUserAndHistory = async () => {
        try {
          const id = await getCurrentUserId();
          setUserId(id);
          
          if (id) {
            const progressHistory = await getChallengeProgress(id, 'Cycle Challenge');
            
            // Transform backend data to match local format
            const formattedHistory = progressHistory.map(item => ({
              time: item.duration,
              distance: item.distance || 0,
              speed: item.speed || 0,
              date: new Date(item.completed_at)
            }));
            
            setHistory(formattedHistory);
          }
        } catch (error) {
          console.error('Error loading cycling history:', error);
        } finally {
          setLoading(false);
        }
      };
      
      loadUserAndHistory();
    }, []);

    const startTimer = () => {
      if (!isRunning) {
        setIsRunning(true);
        intervalRef.current = setInterval(() => {
          setTimer(prev => prev + 1);
        }, 1000);
      }
    };

    const stopTimer = async () => {
      if (isRunning) {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        
        // Calculate average speed (km/h)
        const distanceValue = parseFloat(distance) || 0;
        const timeHours = timer / 3600;
        const avgSpeed = timeHours > 0 ? (distanceValue / timeHours).toFixed(1) : 0;
        
        // Add to local history
        const newSession = { 
          time: timer, 
          distance: distanceValue, 
          speed: avgSpeed,
          date: new Date() 
        };
        
        setHistory([newSession, ...history]);
        
        // Save to backend if user is logged in
        if (userId) {
          try {
            await saveChallengeProgress({
              user_id: userId,
              challenge_name: 'Cycle Challenge',
              duration: timer,
              distance: distanceValue,
              speed: avgSpeed
            });
          } catch (error) {
            console.error('Error saving cycling progress:', error);
            Alert.alert('Error', 'Failed to save your progress to the server.');
          }
        } else {
          Alert.alert('Not Logged In', 'Log in to save your progress to the server.');
        }
      }
    };

    const resetTimer = () => {
      setIsRunning(false);
      clearInterval(intervalRef.current);
      setTimer(0);
      setDistance('0.0');
      setSpeed('0.0');
    };

    // Calculate current speed based on distance and time
    const updateSpeed = (newDistance) => {
      setDistance(newDistance);
      const distanceValue = parseFloat(newDistance) || 0;
      const timeHours = timer / 3600;
      if (timeHours > 0 && distanceValue > 0) {
        setSpeed((distanceValue / timeHours).toFixed(1));
      }
    };

    React.useEffect(() => {
      return () => clearInterval(intervalRef.current);
    }, []);

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cycling Challenge</Text>
          <View style={{ width: 32 }} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <View style={styles.challengeCard}>
            <Ionicons name="bicycle" size={48} color="#44bd32" style={{ marginBottom: 16 }} />
            <Text style={styles.challengeTitle}>Track your cycling progress!</Text>
            
            <Animated.View style={[styles.timerContainer, { opacity: fadeAnim }]}> 
              <Text style={styles.timerText}>{formatTime(timer)}</Text>
            </Animated.View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Distance (km)</Text>
                <TextInput
                  style={styles.statInput}
                  value={distance}
                  onChangeText={updateSpeed}
                  keyboardType="numeric"
                  editable={isRunning}
                  placeholder="0.0"
                  placeholderTextColor="#888"
                />
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Speed (km/h)</Text>
                <Text style={styles.statValue}>{speed}</Text>
              </View>
            </View>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, isRunning && styles.actionButtonActive]}
                onPress={startTimer}
                disabled={isRunning}
              >
                <Ionicons name="play" size={24} color={isRunning ? '#bbb' : '#fff'} />
                <Text style={styles.actionButtonText}>Start</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, !isRunning && timer === 0 && styles.actionButtonDisabled]}
                onPress={stopTimer}
                disabled={!isRunning && timer === 0}
              >
                <Ionicons name="pause" size={24} color={!isRunning && timer === 0 ? '#bbb' : '#fff'} />
                <Text style={styles.actionButtonText}>Stop</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={resetTimer}
              >
                <Ionicons name="refresh" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>History</Text>
            {loading ? (
              <Text style={styles.noHistoryText}>Loading history...</Text>
            ) : history.length === 0 ? (
              <Text style={styles.noHistoryText}>No cycling sessions yet.</Text>
            ) : (
              history.map((entry, idx) => (
                <View key={idx} style={styles.historyItem}>
                  <View style={styles.historyHeader}>
                    <Ionicons name="bicycle" size={20} color="#44bd32" style={{ marginRight: 10 }} />
                    <Text style={styles.historyDate}>{entry.date.toLocaleString()}</Text>
                  </View>
                  <View style={styles.historyDetails}>
                    <View style={styles.historyDetail}>
                      <Ionicons name="time-outline" size={16} color="#bbb" />
                      <Text style={styles.historyDetailText}>{formatTime(entry.time)}</Text>
                    </View>
                    <View style={styles.historyDetail}>
                      <Ionicons name="map-outline" size={16} color="#bbb" />
                      <Text style={styles.historyDetailText}>{entry.distance} km</Text>
                    </View>
                    <View style={styles.historyDetail}>
                      <Ionicons name="speedometer-outline" size={16} color="#bbb" />
                      <Text style={styles.historyDetailText}>{entry.speed} km/h</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
          <View style={{ height: 80 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  challengeCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    margin: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  challengeTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  timerContainer: {
    marginVertical: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(68,189,50,0.08)',
    alignItems: 'center',
    width: width * 0.6,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#44bd32',
    letterSpacing: 2,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(68,189,50,0.08)',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  statLabel: {
    color: '#bbb',
    fontSize: 14,
    marginBottom: 5,
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statInput: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#44bd32',
    marginHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 8,
    opacity: 1,
  },
  actionButtonActive: {
    backgroundColor: '#bbb',
  },
  actionButtonDisabled: {
    backgroundColor: '#333',
    opacity: 0.7,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  historySection: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#181818',
    borderRadius: 12,
    padding: 16,
  },
  historyTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  noHistoryText: {
    color: '#bbb',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
  },
  historyItem: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDate: {
    color: '#bbb',
    fontSize: 12,
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDetailText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
}); 