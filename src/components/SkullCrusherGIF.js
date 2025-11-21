import React from 'react';
import ExerciseGIFTemplate from './ExerciseGIFTemplate';

const SkullCrusherGIF = () => (
  <ExerciseGIFTemplate
    exerciseName="Skull Crusher"
    images={[
      require('../assets/gifs/skullcrusher/skullcrusher_1.png'),
      require('../assets/gifs/skullcrusher/skullcrusher_2.png'),
    ]}
    muscleTarget="Triceps, Anterior Deltoids"
    duration={2500}
    instructions={[
      "Lie flat on bench with barbell extended over chest",
      "Lower the bar slowly toward your forehead",
      "Extend arms back to starting position",
      "Keep elbows stationary throughout movement"
    ]}
    tips={[
      "Keep elbows stationary - only forearms move",
      "Lower slowly and controlled (2-3 seconds)",
      "Stop 2-3 inches from your head",
      "Squeeze triceps at the top",
      "Start with lighter weight to perfect form"
    ]}
    safetyNotes={[
      "Use a spotter with heavy weights",
      "Lower slowly to avoid injury",
      "Stop if you feel elbow/shoulder pain"
    ]}
  />
);

export default SkullCrusherGIF;
