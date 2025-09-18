import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import WorkoutGIF from './WorkoutGIF';

const { width } = Dimensions.get('window');

const WorkoutAnimation = ({ 
  exerciseName, 
  images, 
  duration = 2000,
  showInstructions = true,
  instructions = []
}) => {
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  const handleAnimationComplete = () => {
    if (instructions.length > 0) {
      setCurrentStep((prev) => (prev + 1) % instructions.length);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.animationContainer}>
        <WorkoutGIF
          images={images}
          duration={duration}
          loop={true}
          autoPlay={true}
          showControls={true}
          exerciseName={exerciseName}
          onAnimationComplete={handleAnimationComplete}
          style={styles.gifContainer}
        />
      </View>
      
      {showInstructions && instructions.length > 0 && (
        <View style={[styles.instructionsContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.instructionTitle, { color: colors.text }]}>
            {exerciseName}
          </Text>
          <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
            {instructions[currentStep]}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
  },
  animationContainer: {
    height: 250,
    width: '100%',
  },
  gifContainer: {
    width: '100%',
    height: '100%',
  },
  instructionsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default WorkoutAnimation;
