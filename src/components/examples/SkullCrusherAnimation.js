import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import WorkoutAnimation from '../WorkoutAnimation';

const SkullCrusherAnimation = () => {
  const { colors } = useTheme();

  // Your skull crusher image sequence
  const skullCrusherImages = [
    require('../../assets/gifs/skullcrusher/skullcrusher_1.png'), // Starting position (arms extended)
    require('../../assets/gifs/skullcrusher/skullcrusher_2.png'), // Lowered position (arms bent)
  ];

  const instructions = [
    "Lie on bench with barbell extended over chest",
    "Lower the bar slowly toward your forehead",
    "Extend arms back to starting position",
    "Keep elbows stationary throughout movement"
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Skull Crusher Demonstration
      </Text>
      
      <WorkoutAnimation
        exerciseName="Skull Crusher"
        images={skullCrusherImages}
        duration={2500} // Slightly slower for this exercise
        loop={true}
        autoPlay={true}
        showInstructions={true}
        instructions={instructions}
      />
      
      <View style={[styles.detailsContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          🎯 Target Muscles
        </Text>
        <Text style={[styles.detailText, { color: colors.textSecondary }]}>
          • Triceps (Primary)
        </Text>
        <Text style={[styles.detailText, { color: colors.textSecondary }]}>
          • Anterior Deltoids (Secondary)
        </Text>
        <Text style={[styles.detailText, { color: colors.textSecondary }]}>
          • Core Stabilizers
        </Text>
      </View>

      <View style={[styles.tipsContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          💡 Pro Tips
        </Text>
        <Text style={[styles.tipText, { color: colors.textSecondary }]}>
          • Keep your elbows stationary - only your forearms should move
        </Text>
        <Text style={[styles.tipText, { color: colors.textSecondary }]}>
          • Lower the bar slowly and controlled (2-3 seconds down)
        </Text>
        <Text style={[styles.tipText, { color: colors.textSecondary }]}>
          • Don't let the bar touch your head - stop 2-3 inches away
        </Text>
        <Text style={[styles.tipText, { color: colors.textSecondary }]}>
          • Squeeze your triceps at the top of the movement
        </Text>
        <Text style={[styles.tipText, { color: colors.textSecondary }]}>
          • Start with lighter weight to perfect your form
        </Text>
      </View>

      <View style={[styles.warningsContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          ⚠️ Safety Notes
        </Text>
        <Text style={[styles.warningText, { color: colors.textSecondary }]}>
          • Use a spotter when using heavy weights
        </Text>
        <Text style={[styles.warningText, { color: colors.textSecondary }]}>
          • Lower the bar slowly to avoid injury
        </Text>
        <Text style={[styles.warningText, { color: colors.textSecondary }]}>
          • Stop if you feel any pain in your elbows or shoulders
        </Text>
      </View>
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
  detailsContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
  },
  tipsContainer: {
    marginTop: 12,
    padding: 16,
    borderRadius: 8,
  },
  warningsContainer: {
    marginTop: 12,
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
  warningText: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
});

export default SkullCrusherAnimation;
