const mongoose = require('mongoose');

const userStatisticsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  total_workouts: {
    type: Number,
    default: 0
  },
  total_calories_burned: {
    type: Number,
    default: 0
  },
  total_workout_time: {
    type: Number,
    default: 0
  },
  longest_streak: {
    type: Number,
    default: 0
  },
  current_streak: {
    type: Number,
    default: 0
  },
  last_workout_date: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserStatistics', userStatisticsSchema); 