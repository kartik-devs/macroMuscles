const mongoose = require('mongoose');

const workoutHistorySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workout_type: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  calories_burned: {
    type: Number,
    default: 0
  },
  completed_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WorkoutHistory', workoutHistorySchema); 