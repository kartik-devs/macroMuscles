import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function SprintChallenge({ navigation }) {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      clearInterval(intervalRef.current);
      setHistory([{ time: timer, date: new Date() }, ...history]);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setTimer(0);
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
        <Text style={styles.headerTitle}>Sprint Challenge</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.challengeCard}>
          <Ionicons name="speedometer" size={48} color="#03a9f4" style={{ marginBottom: 16 }} />
          <Text style={styles.challengeTitle}>Time your sprint and beat your record!</Text>
          <Animated.View style={[styles.timerContainer, { opacity: fadeAnim }]}>
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
          </Animated.View>

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
            <TouchableOpacity style={styles.actionButton} onPress={resetTimer}>
              <Ionicons name="refresh" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Sprint History</Text>
          {history.length === 0 ? (
            <Text style={styles.noHistoryText}>No sprints recorded yet.</Text>
          ) : (
            history.map((entry, idx) => (
              <View key={idx} style={styles.historyItem}>
                <Ionicons name="timer-outline" size={20} color="#03a9f4" style={{ marginRight: 10 }} />
                <Text style={styles.historyText}>{formatTime(entry.time)}</Text>
                <Text style={styles.historyDate}>{entry.date.toLocaleString()}</Text>
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
    backgroundColor: 'rgba(3,169,244,0.08)',
    alignItems: 'center',
    width: width * 0.6,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#03a9f4',
    letterSpacing: 2,
    textAlign: 'center',
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
    backgroundColor: '#03a9f4',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
  },
  historyDate: {
    color: '#bbb',
    fontSize: 12,
  },
});
