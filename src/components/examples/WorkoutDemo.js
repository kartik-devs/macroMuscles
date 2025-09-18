import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import UniversalWorkoutGIF from '../UniversalWorkoutGIF';
import { getWorkoutData } from '../../data/workoutAnimations';

const WorkoutDemo = () => {
  const { colors } = useTheme();

  // Get workout data for skull crusher
  const skullCrusherData = getWorkoutData('skullCrusher');

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Workout Demonstrations
      </Text>
      
      {/* Skull Crusher Demo */}
      {skullCrusherData && (
        <UniversalWorkoutGIF
          {...skullCrusherData}
          showInstructions={true}
          showTips={true}
          showSafety={true}
          expandable={true}
          animationHeight={250}
        />
      )}

      {/* You can easily add more exercises like this: */}
      {/* 
      {getWorkoutData('pushUp') && (
        <UniversalWorkoutGIF
          {...getWorkoutData('pushUp')}
          showInstructions={true}
          showTips={true}
          showSafety={true}
          expandable={true}
          animationHeight={250}
        />
      )}
      */}
    </ScrollView>
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
});

export default WorkoutDemo;
