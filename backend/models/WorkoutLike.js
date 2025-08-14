const mongoose = require('mongoose');

const workoutLikeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shared_workout_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SharedWorkout',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure unique likes
workoutLikeSchema.index({ user_id: 1, shared_workout_id: 1 }, { unique: true });

// Method to check if user has liked a workout
workoutLikeSchema.statics.hasLiked = async function(userId, sharedWorkoutId) {
  const like = await this.findOne({ user_id: userId, shared_workout_id: sharedWorkoutId });
  return !!like;
};

module.exports = mongoose.model('WorkoutLike', workoutLikeSchema);

