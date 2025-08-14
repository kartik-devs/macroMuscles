const mongoose = require('mongoose');

const workoutCommentSchema = new mongoose.Schema({
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
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
workoutCommentSchema.index({ shared_workout_id: 1, created_at: -1 });

// Method to get comments for a workout
workoutCommentSchema.statics.getCommentsForWorkout = async function(sharedWorkoutId) {
  return await this.find({ shared_workout_id: sharedWorkoutId })
    .populate('user_id', 'name email')
    .sort({ created_at: -1 });
};

module.exports = mongoose.model('WorkoutComment', workoutCommentSchema);

