// Workout Animation Data
// Add new exercises here with their image sequences and details

export const workoutAnimations = {
  skullCrusher: {
    exerciseName: "Skull Crusher",
    images: [
      require('../assets/gifs/skullcrusher/skullcrusher_1.png'),
      require('../assets/gifs/skullcrusher/skullcrusher_2.png'),
    ],
    duration: 2500,
    muscleTarget: "Triceps, Anterior Deltoids",
    instructions: [
      "Lie flat on bench with barbell extended over chest",
      "Lower the bar slowly toward your forehead",
      "Extend arms back to starting position",
      "Keep elbows stationary throughout movement"
    ],
    tips: [
      "Keep elbows stationary - only forearms move",
      "Lower slowly and controlled (2-3 seconds)",
      "Stop 2-3 inches from your head",
      "Squeeze triceps at the top",
      "Start with lighter weight to perfect form"
    ],
    safetyNotes: [
      "Use a spotter with heavy weights",
      "Lower slowly to avoid injury",
      "Stop if you feel elbow/shoulder pain"
    ]
  },

  // Add more exercises here as you create them
  // Note: Only include exercises that have actual image files
  
  // pushUp: {
  //   exerciseName: "Push-Up",
  //   images: [
  //     require('../assets/gifs/pushup/pushup_1.jpg'),
  //     require('../assets/gifs/pushup/pushup_2.jpg'),
  //     require('../assets/gifs/pushup/pushup_3.jpg'),
  //     require('../assets/gifs/pushup/pushup_4.jpg'),
  //   ],
  //   duration: 2000,
  //   muscleTarget: "Chest, Triceps, Shoulders, Core",
  //   instructions: [
  //     "Start in a plank position with hands slightly wider than shoulders",
  //     "Lower your body until chest nearly touches the floor",
  //     "Push back up to starting position",
  //     "Keep your core tight throughout the movement"
  //   ],
  //   tips: [
  //     "Keep your body in a straight line",
  //     "Breathe out on the way up",
  //     "Start with modified push-ups if needed",
  //     "Engage your core throughout",
  //     "Don't let your hips sag or pike up"
  //   ],
  //   safetyNotes: [
  //     "Stop if you feel wrist pain",
  //     "Modify on knees if needed",
  //     "Keep proper form over quantity"
  //   ]
  // },

  // squat: {
  //   exerciseName: "Squat",
  //   images: [
  //     require('../assets/gifs/squat/squat_1.jpg'),
  //     require('../assets/gifs/squat/squat_2.jpg'),
  //     require('../assets/gifs/squat/squat_3.jpg'),
  //   ],
  //   duration: 3000,
  //   muscleTarget: "Quadriceps, Glutes, Hamstrings, Core",
  //   instructions: [
  //     "Stand with feet shoulder-width apart",
  //     "Lower your body as if sitting back into a chair",
  //     "Go down until thighs are parallel to floor",
  //     "Push through heels to return to starting position"
  //   ],
  //   tips: [
  //     "Keep your chest up and core engaged",
  //     "Knees should track over your toes",
  //     "Weight should be on your heels",
  //     "Breathe in on the way down, out on the way up",
  //     "Start with bodyweight before adding weight"
  //   ],
  //   safetyNotes: [
  //     "Don't let knees cave inward",
  //     "Stop if you feel knee pain",
  //     "Keep your back straight"
  //   ]
  // },

  // plank: {
  //   exerciseName: "Plank",
  //   images: [
  //     require('../assets/gifs/plank/plank_1.jpg'),
  //     require('../assets/gifs/plank/plank_2.jpg'),
  //   ],
  //   duration: 4000,
  //   muscleTarget: "Core, Shoulders, Glutes",
  //   instructions: [
  //     "Start in a push-up position",
  //     "Lower to your forearms",
  //     "Keep your body in a straight line",
  //     "Hold the position for the desired time"
  //   ],
  //   tips: [
  //     "Engage your core throughout",
  //     "Don't let your hips sag or pike up",
  //     "Breathe normally while holding",
  //     "Start with shorter holds and build up",
  //     "Keep your head in neutral position"
  //   ],
  //   safetyNotes: [
  //     "Stop if you feel lower back pain",
  //     "Modify on knees if needed",
  //     "Focus on form over duration"
  //   ]
  // }
};

// Helper function to get workout data
export const getWorkoutData = (exerciseKey) => {
  return workoutAnimations[exerciseKey] || null;
};

// Helper function to get all available exercises
export const getAllExercises = () => {
  return Object.keys(workoutAnimations);
};

// Helper function to get exercise names
export const getExerciseNames = () => {
  return Object.values(workoutAnimations).map(workout => workout.exerciseName);
};
