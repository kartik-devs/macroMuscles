const mongoose = require('mongoose');

const challengeProgressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challenge_name: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  distance: {
    type: Number
  },
  speed: {
    type: Number
  },
  completed_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ChallengeProgress', challengeProgressSchema); 