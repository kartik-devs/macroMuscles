import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import WorkoutGIF from './WorkoutGIF';

const SkullCrusherGIF = ({ 
  showInstructions = true, 
  showTips = true,
  style 
}) => {
  const { colors } = useTheme();
  const [showDetails, setShowDetails] = useState(false);

  // Your skull crusher image sequence
  const skullCrusherImages = [
    require('../assets/gifs/skullcrusher/skullcrusher_1.png'), // Starting position
    require('../assets/gifs/skullcrusher/skullcrusher_2.png'), // Lowered position
  ];

  const instructions = [
    "Lie flat on bench with barbell extended over chest",
    "Lower the bar slowly toward your forehead",
    "Extend arms back to starting position",
    "Keep elbows stationary throughout movement"
  ];

  const tips = [
    "Keep elbows stationary - only forearms move",
    "Lower slowly and controlled (2-3 seconds)",
    "Stop 2-3 inches from your head",
    "Squeeze triceps at the top",
    "Start with lighter weight to perfect form"
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }, style]}>
      {/* Animation Section */}
      <View style={styles.animationSection}>
        <WorkoutGIF
          images={skullCrusherImages}
          duration={2500}
          loop={true}
          autoPlay={true}
          showControls={true}
          exerciseName="Skull Crusher"
          style={styles.gifContainer}
        />
      </View>

      {/* Exercise Info */}
      <View style={styles.infoSection}>
        <View style={styles.header}>
          <Text style={[styles.exerciseName, { color: colors.text }]}>
            Skull Crusher
          </Text>
          <TouchableOpacity 
            onPress={() => setShowDetails(!showDetails)}
            style={styles.detailsButton}
          >
            <Ionicons 
              name={showDetails ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={colors.primary} 
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.muscleTarget, { color: colors.textSecondary }]}>
          Target: Triceps, Anterior Deltoids
        </Text>
      </View>

      {/* Expandable Details */}
      {showDetails && (
        <View style={[styles.detailsSection, { backgroundColor: colors.background }]}>
          {showInstructions && (
            <View style={styles.instructionSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                📋 Instructions
              </Text>
              {instructions.map((instruction, index) => (
                <Text key={index} style={[styles.instructionText, { color: colors.textSecondary }]}>
                  {index + 1}. {instruction}
                </Text>
              ))}
            </View>
          )}

          {showTips && (
            <View style={styles.tipsSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                💡 Pro Tips
              </Text>
              {tips.map((tip, index) => (
                <Text key={index} style={[styles.tipText, { color: colors.textSecondary }]}>
                  • {tip}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.safetySection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              ⚠️ Safety
            </Text>
            <Text style={[styles.safetyText, { color: colors.textSecondary }]}>
              • Use a spotter with heavy weights
            </Text>
            <Text style={[styles.safetyText, { color: colors.textSecondary }]}>
              • Lower slowly to avoid injury
            </Text>
            <Text style={[styles.safetyText, { color: colors.textSecondary }]}>
              • Stop if you feel elbow/shoulder pain
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
  },
  animationSection: {
    height: 250,
  },
  gifContainer: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsButton: {
    padding: 4,
  },
  muscleTarget: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  detailsSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  instructionSection: {
    marginBottom: 16,
  },
  tipsSection: {
    marginBottom: 16,
  },
  safetySection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  tipText: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  safetyText: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
});

export default SkullCrusherGIF;
