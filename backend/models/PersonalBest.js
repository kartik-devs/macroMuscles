const mongoose = require('mongoose');

const personalBestSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exercise_name: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  reps: {
    type: Number
  },
  date_achieved: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure unique user-exercise combinations
personalBestSchema.index({ user_id: 1, exercise_name: 1 }, { unique: true });

module.exports = mongoose.model('PersonalBest', personalBestSchema); 