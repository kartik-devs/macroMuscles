const mongoose = require('mongoose');

const userGoalSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goal_type: {
    type: String,
    enum: ['decrease_weight', 'maintain_health', 'increase_muscle'],
    required: true
  },
  target_calories: {
    type: Number,
    default: 1900
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserGoal', userGoalSchema); 