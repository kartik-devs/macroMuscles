import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import WorkoutAnimation from '../WorkoutAnimation';

// Example: You would place your image sequence in src/assets/gifs/pushup/
const PushUpAnimation = () => {
  const { colors } = useTheme();

  // Example image sequence - replace with your actual images
  const pushUpImages = [
    require('../../assets/gifs/pushup/pushup_1.jpg'), // Starting position
    require('../../assets/gifs/pushup/pushup_2.jpg'), // Mid position
    require('../../assets/gifs/pushup/pushup_3.jpg'), // Down position
    require('../../assets/gifs/pushup/pushup_4.jpg'), // Back up
  ];

  const instructions = [
    "Start in a plank position with hands slightly wider than shoulders",
    "Lower your body until chest nearly touches the floor",
    "Push back up to starting position",
    "Keep your core tight throughout the movement"
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Push-Up Demonstration
      </Text>
      
      <WorkoutAnimation
        exerciseName="Push-Up"
        images={pushUpImages}
        duration={2000}
        showInstructions={true}
        instructions={instructions}
      />
      
      <View style={[styles.tipsContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.tipsTitle, { color: colors.text }]}>
          💡 Pro Tips
        </Text>
        <Text style={[styles.tipText, { color: colors.textSecondary }]}>
          • Keep your body in a straight line
        </Text>
        <Text style={[styles.tipText, { color: colors.textSecondary }]}>
          • Breathe out on the way up
        </Text>
        <Text style={[styles.tipText, { color: colors.textSecondary }]}>
          • Start with modified push-ups if needed
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  tipsContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default PushUpAnimation;
