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
  reply_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutComment',
    default: null
  },
  likes: [{
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  }],
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
workoutCommentSchema.statics.getCommentsForWorkout = async function(sharedWorkoutId, currentUserId = null) {
  const comments = await this.find({ shared_workout_id: sharedWorkoutId })
    .populate('user_id', 'name email')
    .populate('reply_to')
    .sort({ created_at: -1 });
  
  // Format comments with like information
  return comments.map(comment => ({
    id: comment._id,
    user_id: comment.user_id._id,
    user_name: comment.user_id.name,
    comment: comment.comment,
    reply_to: comment.reply_to,
    likesCount: comment.likes.length,
    isLiked: currentUserId ? comment.likes.some(like => like.user_id.toString() === currentUserId) : false,
    created_at: comment.created_at
  }));
};

module.exports = mongoose.model('WorkoutComment', workoutCommentSchema);

