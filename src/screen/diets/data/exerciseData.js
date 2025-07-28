// Exercise database organized by workout splits and muscle groups

export const exerciseDatabase = {
  push_pull_legs: {
    push: {
      chest: [
        { name: 'Bench Press', sets: 4, reps: '8-12', rest: '2-3 min', difficulty: 'intermediate' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '2 min', difficulty: 'intermediate' },
        { name: 'Decline Push-ups', sets: 3, reps: '12-15', rest: '1-2 min', difficulty: 'beginner' },
        { name: 'Cable Flyes', sets: 3, reps: '12-15', rest: '1-2 min', difficulty: 'beginner' },
        { name: 'Dumbbell Pullovers', sets: 3, reps: '10-12', rest: '1-2 min', difficulty: 'intermediate' },
      ],
      shoulders: [
        { name: 'Overhead Press', sets: 4, reps: '8-12', rest: '2-3 min', difficulty: 'intermediate' },
        { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: '1-2 min', difficulty: 'beginner' },
        { name: 'Rear Delt Flyes', sets: 3, reps: '12-15', rest: '1-2 min', difficulty: 'beginner' },
        { name: 'Upright Rows', sets: 3, reps: '10-12', rest: '1-2 min', difficulty: 'intermediate' },
        { name: 'Arnold Press', sets: 3, reps: '10-12', rest: '2 min', difficulty: 'intermediate' },
      ],
      triceps: [
        { name: 'Close-Grip Bench Press', sets: 3, reps: '8-12', rest: '2 min', difficulty: 'intermediate' },
        { name: 'Tricep Dips', sets: 3, reps: '10-15', rest: '1-2 min', difficulty: 'beginner' },
        { name: 'Skull Crushers', sets: 3, reps: '10-12', rest: '1-2 min', difficulty: 'intermediate' },
        { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', rest: '1 min', difficulty: 'beginner' },
        { name: 'Overhead Tricep Extension', sets: 3, reps: '10-12', rest: '1-2 min', difficulty: 'beginner' },
      ],
    },
    pull: {
      back: [
        { name: 'Deadlifts', sets: 4, reps: '6-8', rest: '3-4 min', difficulty: 'advanced' },
        { name: 'Pull-ups', sets: 3, reps: '8-12', rest: '2-3 min', difficulty: 'intermediate' },
        { name: 'Barbell Rows', sets: 4, reps: '8-12', rest: '2-3 min', difficulty: 'intermediate' },
        { name: 'Lat Pulldowns', sets: 3, reps: '10-12', rest: '1-2 min', difficulty: 'beginner' },
        { name: 'T-Bar Rows', sets: 3, reps: '10-12', rest: '2 min', difficulty: 'intermediate' },
      ],
      biceps: [
        { name: 'Barbell Curls', sets: 3, reps: '10-12', rest: '1-2 min', difficulty: 'beginner' },
        { name: 'Hammer Curls', sets: 3, reps: '10-12', rest: '1-2 min', difficulty: 'beginner' },
        { name: 'Preacher Curls', sets: 3, reps: '10-12', rest: '1-2 min', difficulty: 'intermediate' },
        { name: 'Concentration Curls', sets: 3, reps: '12-15', rest: '1 min', difficulty: 'beginner' },
        { name: 'Incline Dumbbell Curls', sets: 3, reps: '10-12', rest: '1-2 min', difficulty: 'intermediate' },
      ],
      rear_delts: [
        { name: 'Face Pulls', sets: 3, reps: '12-15', rest: '1 min', difficulty: 'beginner' },
        { name: 'Reverse Flyes', sets: 3, reps: '12-15', rest: '1 min', difficulty: 'beginner' },
        { name: 'Cable Rear Delt Flyes', sets: 3, reps: '12-15', rest: '1 min', difficulty: 'beginner' },
      ],
    },
    legs: {
      quads: [
        { name: 'Squats', sets: 4, reps: '8-12', rest: '3-4 min', difficulty: 'intermediate' },
        { name: 'Leg Press', sets: 3, reps: '10-12', rest: '2-3 min', difficulty: 'beginner' },
        { name: 'Leg Extensions', sets: 3, reps: '12-15', rest: '1-2 min', difficulty: 'beginner' },
        { name: 'Walking Lunges', sets: 3, reps: '12-15 each leg', rest: '2 min', difficulty: 'intermediate' },
        { name: 'Bulgarian Split Squats', sets: 3, reps: '10-12 each leg', rest: '2 min', difficulty: 'intermediate' },
      ],
      hamstrings: [
        { name: 'Romanian Deadlifts', sets: 3, reps: '8-12', rest: '2-3 min', difficulty: 'intermediate' },
        { name: 'Leg Curls', sets: 3, reps: '12-15', rest: '1-2 min', difficulty: 'beginner' },
        { name: 'Good Mornings', sets: 3, reps: '10-12', rest: '2 min', difficulty: 'intermediate' },
        { name: 'Glute Ham Raises', sets: 3, reps: '8-12', rest: '2 min', difficulty: 'advanced' },
      ],
      calves: [
        { name: 'Standing Calf Raises', sets: 4, reps: '15-20', rest: '1 min', difficulty: 'beginner' },
        { name: 'Seated Calf Raises', sets: 3, reps: '15-20', rest: '1 min', difficulty: 'beginner' },
        { name: 'Donkey Calf Raises', sets: 3, reps: '15-20', rest: '1 min', difficulty: 'intermediate' },
      ],
    },
  },
  
  upper_lower: {
    upper: {
      chest: [
        { name: 'Bench Press', sets: 4, reps: '8-12', rest: '2-3 min', difficulty: 'intermediate' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '2 min', difficulty: 'intermediate' },
        { name: 'Push-ups', sets: 3, reps: '12-15', rest: '1-2 min', difficulty: 'beginner' },
        { name: 'Cable Flyes', sets: 3, reps: '12-15', rest: '1-2 min', difficulty: 'beginner' },
      ],
      back: [
        { name: 'Pull-ups', sets: 3, reps: '8-12', rest: '2-3 min', difficulty: 'intermediate' },
        { name: 'Barbell Rows', sets: 4, reps: '8-12', rest: '2-3 min', difficulty: 'intermediate' },
        { name: 'Lat Pulldowns', sets: 3, reps: '10-12', rest: '1-2 min', difficulty: 'beginner' },
        { name: 'Face Pulls', sets: 3, reps: '12-15', rest: '1 min', difficulty: 'beginner' },
      ],
      shoulders: [
        { name: 'Overhead Press', sets: 4, reps: '8-12', rest: '2-3 min', difficulty: 'intermediate' },
        { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: '1-2 min', difficulty: 'beginner' },
        { name: 'Rear Delt Flyes', sets: 3, reps: '12-15', rest: '1-2 min', difficulty: 'beginner' },
      ],
      arms: [
        { name: 'Barbell Curls', sets: 3, reps: '10-12', rest: '1-2 min', difficulty: 'beginner' },
        { name: 'Tricep Dips', sets: 3, reps: '10-15', rest: '1-2 min', difficulty: 'beginner' },
        { name: 'Hammer Curls', sets: 3, reps: '10-12', rest: '1-2 min', difficulty: 'beginner' },
        { name: 'Skull Crushers', sets: 3, reps: '10-12', rest: '1-2 min', difficulty: 'intermediate' },
      ],
    },
    lower: {
      quads: [
        { name: 'Squats', sets: 4, reps: '8-12', rest: '3-4 min', difficulty: 'intermediate' },
        { name: 'Leg Press', sets: 3, reps: '10-12', rest: '2-3 min', difficulty: 'beginner' },
        { name: 'Leg Extensions', sets: 3, reps: '12-15', rest: '1-2 min', difficulty: 'beginner' },
        { name: 'Walking Lunges', sets: 3, reps: '12-15 each leg', rest: '2 min', difficulty: 'intermediate' },
      ],
      hamstrings: [
        { name: 'Romanian Deadlifts', sets: 3, reps: '8-12', rest: '2-3 min', difficulty: 'intermediate' },
        { name: 'Leg Curls', sets: 3, reps: '12-15', rest: '1-2 min', difficulty: 'beginner' },
        { name: 'Good Mornings', sets: 3, reps: '10-12', rest: '2 min', difficulty: 'intermediate' },
      ],
      calves: [
        { name: 'Standing Calf Raises', sets: 4, reps: '15-20', rest: '1 min', difficulty: 'beginner' },
        { name: 'Seated Calf Raises', sets: 3, reps: '15-20', rest: '1 min', difficulty: 'beginner' },
      ],
    },
  },
  
  full_body: {
    compound: [
      { name: 'Squats', sets: 3, reps: '8-12', rest: '3-4 min', difficulty: 'intermediate', muscle: 'legs' },
      { name: 'Deadlifts', sets: 3, reps: '6-8', rest: '3-4 min', difficulty: 'advanced', muscle: 'back' },
      { name: 'Bench Press', sets: 3, reps: '8-12', rest: '2-3 min', difficulty: 'intermediate', muscle: 'chest' },
      { name: 'Overhead Press', sets: 3, reps: '8-12', rest: '2-3 min', difficulty: 'intermediate', muscle: 'shoulders' },
      { name: 'Pull-ups', sets: 3, reps: '8-12', rest: '2-3 min', difficulty: 'intermediate', muscle: 'back' },
      { name: 'Barbell Rows', sets: 3, reps: '8-12', rest: '2-3 min', difficulty: 'intermediate', muscle: 'back' },
    ],
    isolation: [
      { name: 'Lateral Raises', sets: 2, reps: '12-15', rest: '1-2 min', difficulty: 'beginner', muscle: 'shoulders' },
      { name: 'Barbell Curls', sets: 2, reps: '10-12', rest: '1-2 min', difficulty: 'beginner', muscle: 'biceps' },
      { name: 'Tricep Dips', sets: 2, reps: '10-15', rest: '1-2 min', difficulty: 'beginner', muscle: 'triceps' },
      { name: 'Leg Extensions', sets: 2, reps: '12-15', rest: '1-2 min', difficulty: 'beginner', muscle: 'quads' },
      { name: 'Leg Curls', sets: 2, reps: '12-15', rest: '1-2 min', difficulty: 'beginner', muscle: 'hamstrings' },
      { name: 'Calf Raises', sets: 2, reps: '15-20', rest: '1 min', difficulty: 'beginner', muscle: 'calves' },
    ],
  },
  
  bro_split: {
    chest: [
      { name: 'Bench Press', sets: 4, reps: '8-12', rest: '2-3 min', difficulty: 'intermediate' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '2 min', difficulty: 'intermediate' },
      { name: 'Decline Push-ups', sets: 3, reps: '12-15', rest: '1-2 min', difficulty: 'beginner' },
      { name: 'Cable Flyes', sets: 3, reps: '12-15', rest: '1-2 min', difficulty: 'beginner' },
      { name: 'Dumbbell Pullovers', sets: 3, reps: '10-12', rest: '1-2 min', difficulty: 'intermediate' },
    ],
    back: [
      { name: 'Deadlifts', sets: 4, reps: '6-8', rest: '3-4 min', difficulty: 'advanced' },
      { name: 'Pull-ups', sets: 3, reps: '8-12', rest: '2-3 min', difficulty: 'intermediate' },
      { name: 'Barbell Rows', sets: 4, reps: '8-12', rest: '2-3 min', difficulty: 'intermediate' },
      { name: 'Lat Pulldowns', sets: 3, reps: '10-12', rest: '1-2 min', difficulty: 'beginner' },
      { name: 'T-Bar Rows', sets: 3, reps: '10-12', rest: '2 min', difficulty: 'intermediate' },
      { name: 'Face Pulls', sets: 3, reps: '12-15', rest: '1 min', difficulty: 'beginner' },
    ],
    shoulders: [
      { name: 'Overhead Press', sets: 4, reps: '8-12', rest: '2-3 min', difficulty: 'intermediate' },
      { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: '1-2 min', difficulty: 'beginner' },
      { name: 'Rear Delt Flyes', sets: 3, reps: '12-15', rest: '1-2 min', difficulty: 'beginner' },
      { name: 'Upright Rows', sets: 3, reps: '10-12', rest: '1-2 min', difficulty: 'intermediate' },
      { name: 'Arnold Press', sets: 3, reps: '10-12', rest: '2 min', difficulty: 'intermediate' },
    ],
    arms: [
      { name: 'Barbell Curls', sets: 3, reps: '10-12', rest: '1-2 min', difficulty: 'beginner' },
      { name: 'Hammer Curls', sets: 3, reps: '10-12', rest: '1-2 min', difficulty: 'beginner' },
      { name: 'Preacher Curls', sets: 3, reps: '10-12', rest: '1-2 min', difficulty: 'intermediate' },
      { name: 'Close-Grip Bench Press', sets: 3, reps: '8-12', rest: '2 min', difficulty: 'intermediate' },
      { name: 'Tricep Dips', sets: 3, reps: '10-15', rest: '1-2 min', difficulty: 'beginner' },
      { name: 'Skull Crushers', sets: 3, reps: '10-12', rest: '1-2 min', difficulty: 'intermediate' },
    ],
    legs: [
      { name: 'Squats', sets: 4, reps: '8-12', rest: '3-4 min', difficulty: 'intermediate' },
      { name: 'Leg Press', sets: 3, reps: '10-12', rest: '2-3 min', difficulty: 'beginner' },
      { name: 'Romanian Deadlifts', sets: 3, reps: '8-12', rest: '2-3 min', difficulty: 'intermediate' },
      { name: 'Leg Extensions', sets: 3, reps: '12-15', rest: '1-2 min', difficulty: 'beginner' },
      { name: 'Leg Curls', sets: 3, reps: '12-15', rest: '1-2 min', difficulty: 'beginner' },
      { name: 'Walking Lunges', sets: 3, reps: '12-15 each leg', rest: '2 min', difficulty: 'intermediate' },
      { name: 'Calf Raises', sets: 4, reps: '15-20', rest: '1 min', difficulty: 'beginner' },
    ],
  },
};

// Get recommended exercises based on workout split and diet preference
export const getRecommendedExercises = (workoutSplit, dietPreference) => {
  const exercises = exerciseDatabase[workoutSplit];
  
  if (!exercises) {
    return [];
  }
  
  // Adjust exercise recommendations based on diet preference
  let recommendedExercises = [];
  
  switch (workoutSplit) {
    case 'push_pull_legs':
      recommendedExercises = [
        { day: 'Push Day', exercises: [
          ...exercises.push.chest.slice(0, 3),
          ...exercises.push.shoulders.slice(0, 2),
          ...exercises.push.triceps.slice(0, 2),
        ]},
        { day: 'Pull Day', exercises: [
          ...exercises.pull.back.slice(0, 3),
          ...exercises.pull.biceps.slice(0, 2),
          ...exercises.pull.rear_delts.slice(0, 1),
        ]},
        { day: 'Legs Day', exercises: [
          ...exercises.legs.quads.slice(0, 3),
          ...exercises.legs.hamstrings.slice(0, 2),
          ...exercises.legs.calves.slice(0, 1),
        ]},
      ];
      break;
      
    case 'upper_lower':
      recommendedExercises = [
        { day: 'Upper Day', exercises: [
          ...exercises.upper.chest.slice(0, 2),
          ...exercises.upper.back.slice(0, 2),
          ...exercises.upper.shoulders.slice(0, 2),
          ...exercises.upper.arms.slice(0, 2),
        ]},
        { day: 'Lower Day', exercises: [
          ...exercises.lower.quads.slice(0, 3),
          ...exercises.lower.hamstrings.slice(0, 2),
          ...exercises.lower.calves.slice(0, 1),
        ]},
      ];
      break;
      
    case 'full_body':
      recommendedExercises = [
        { day: 'Full Body', exercises: [
          ...exercises.compound.slice(0, 4),
          ...exercises.isolation.slice(0, 3),
        ]},
      ];
      break;
      
    case 'bro_split':
      recommendedExercises = [
        { day: 'Chest Day', exercises: exercises.chest.slice(0, 4) },
        { day: 'Back Day', exercises: exercises.back.slice(0, 4) },
        { day: 'Shoulders Day', exercises: exercises.shoulders.slice(0, 4) },
        { day: 'Arms Day', exercises: exercises.arms.slice(0, 4) },
        { day: 'Legs Day', exercises: exercises.legs.slice(0, 4) },
      ];
      break;
  }
  
  // Adjust based on diet preference
  if (dietPreference === 'weight_loss') {
    // Add more cardio-focused exercises
    recommendedExercises.forEach(day => {
      day.exercises.push({
        name: 'Cardio (HIIT or LISS)',
        sets: 1,
        reps: '20-30 min',
        rest: 'N/A',
        difficulty: 'beginner',
        cardio: true
      });
    });
  } else if (dietPreference === 'muscle_gain') {
    // Increase sets and focus on compound movements
    recommendedExercises.forEach(day => {
      day.exercises.forEach(exercise => {
        if (!exercise.cardio) {
          exercise.sets = Math.min(exercise.sets + 1, 5);
        }
      });
    });
  }
  
  return recommendedExercises;
}; 