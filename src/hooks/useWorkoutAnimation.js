import { useMemo } from 'react';
import { getWorkoutData } from '../data/workoutAnimations';

// Custom hook for workout animations
export const useWorkoutAnimation = (exerciseKey, options = {}) => {
  const workoutData = useMemo(() => {
    const data = getWorkoutData(exerciseKey);
    if (!data) {
      console.warn(`Workout animation not found for: ${exerciseKey}`);
      return null;
    }
    
    // Merge with custom options
    return {
      ...data,
      ...options,
    };
  }, [exerciseKey, options]);

  return workoutData;
};

// Hook for getting all available exercises
export const useAllWorkouts = () => {
  return useMemo(() => {
    const { getAllExercises, getExerciseNames } = require('../data/workoutAnimations');
    return {
      exerciseKeys: getAllExercises(),
      exerciseNames: getExerciseNames(),
    };
  }, []);
};
