const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  achievement_type: {
    type: String,
    required: true,
    enum: ['workout', 'diet', 'challenge', 'master']
  },
  achievement_name: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  target: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completed_at: {
    type: Date
  }
}, {
  timestamps: true
});

achievementSchema.index({ user_id: 1, achievement_type: 1, achievement_name: 1 }, { unique: true });

module.exports = mongoose.model('Achievement', achievementSchema);