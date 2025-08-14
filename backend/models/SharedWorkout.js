const mongoose = require('mongoose');

const sharedWorkoutSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workout_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutHistory',
    required: true
  },
  caption: {
    type: String,
    trim: true,
    maxlength: 500
  },
  visibility: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'friends'
  },
  likes_count: {
    type: Number,
    default: 0
  },
  comments_count: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
sharedWorkoutSchema.index({ user_id: 1, created_at: -1 });
sharedWorkoutSchema.index({ visibility: 1, created_at: -1 });

module.exports = mongoose.model('SharedWorkout', sharedWorkoutSchema);

