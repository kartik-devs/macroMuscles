import React from 'react';
import ExerciseGIFTemplate from './ExerciseGIFTemplate';

const LateralRaiseGIF = () => (
  <ExerciseGIFTemplate
    exerciseName="Lateral Raise"
    images={[
      require('../assets/gifs/lateralRaise/lateralRaise_1.png'),
      require('../assets/gifs/lateralRaise/lateralRaise_2.png'),
    ]}
    muscleTarget="Deltoids"
    duration={2000}
    instructions={[
      "Stand tall holding dumbbells at your sides",
      "Raise both arms outward until parallel to floor",
      "Pause briefly and lower slowly"
    ]}
    tips={[
      "Avoid swinging weights",
      "Lead with elbows, not hands",
      "Control the lowering phase"
    ]}
    safetyNotes={[
      "Don’t lift too heavy",
      "Keep slight bend in elbows",
      "Avoid shrugging shoulders"
    ]}
  />
);

export default LateralRaiseGIF;
