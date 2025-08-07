const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  display_name: {
    type: String,
    trim: true
  },
  avatar_initial: {
    type: String,
    maxlength: 1
  },
  height: {
    type: Number
  },
  weight: {
    type: Number
  },
  age: {
    type: Number
  },
  workout_split: {
    type: String,
    enum: ['push_pull_legs', 'upper_lower', 'full_body', 'bro_split', 'custom']
  },
  include_cardio: {
    type: Boolean,
    default: false
  },
  cardio_type: {
    type: String,
    enum: ['running', 'cycling', 'swimming', 'walking', 'elliptical', 'other']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserProfile', userProfileSchema); 