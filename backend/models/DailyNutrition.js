const mongoose = require('mongoose');

const dailyNutritionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  target_calories: {
    type: Number,
    default: 1900
  },
  consumed_calories: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index to ensure unique user-date combinations
dailyNutritionSchema.index({ user_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyNutrition', dailyNutritionSchema); 