import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import WorkoutGIF from './WorkoutGIF';

const UniversalWorkoutGIF = ({ 
  // Required props
  exerciseName,
  images,
  
  // Animation props
  duration = 2000,
  loop = true,
  autoPlay = true,
  showControls = true,
  
  // Content props
  muscleTarget = "",
  instructions = [],
  tips = [],
  safetyNotes = [],
  
  // Display props
  showInstructions = true,
  showTips = true,
  showSafety = true,
  showDetails = false,
  expandable = true,
  
  // Style props
  style,
  animationHeight = 250,
  
  // Callbacks
  onAnimationComplete,
  onPlay,
  onPause,
}) => {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(showDetails);

  const toggleExpanded = () => {
    if (expandable) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }, style]}>
      {/* Animation Section */}
      <View style={[styles.animationSection, { height: animationHeight }]}>
        <WorkoutGIF
          images={images}
          duration={duration}
          loop={loop}
          autoPlay={autoPlay}
          showControls={showControls}
          exerciseName={exerciseName}
          onAnimationComplete={onAnimationComplete}
          onPlay={onPlay}
          onPause={onPause}
          style={styles.gifContainer}
        />
      </View>

      {/* Exercise Info */}
      <View style={[styles.infoSection, { borderTopColor: colors.border }]}>
        <View style={styles.header}>
          <Text style={[styles.exerciseName, { color: colors.text }]}>
            {exerciseName}
          </Text>
          {expandable && (
            <TouchableOpacity 
              onPress={toggleExpanded}
              style={styles.detailsButton}
            >
              <Ionicons 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={colors.primary} 
              />
            </TouchableOpacity>
          )}
        </View>

        {muscleTarget && (
          <Text style={[styles.muscleTarget, { color: colors.textSecondary }]}>
            Target: {muscleTarget}
          </Text>
        )}
      </View>

      {/* Expandable Details */}
      {isExpanded && (
        <View style={[styles.detailsSection, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          {showInstructions && instructions.length > 0 && (
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

          {showTips && tips.length > 0 && (
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

          {showSafety && safetyNotes.length > 0 && (
            <View style={styles.safetySection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                ⚠️ Safety
              </Text>
              {safetyNotes.map((note, index) => (
                <Text key={index} style={[styles.safetyText, { color: colors.textSecondary }]}>
                  • {note}
                </Text>
              ))}
            </View>
          )}
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

export default UniversalWorkoutGIF;
