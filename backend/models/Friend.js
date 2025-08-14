const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  friend_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure unique friend relationships
friendSchema.index({ user_id: 1, friend_id: 1 }, { unique: true });

// Method to check if two users are friends
friendSchema.statics.areFriends = async function(userId1, userId2) {
  const friendship = await this.findOne({
    $or: [
      { user_id: userId1, friend_id: userId2, status: 'accepted' },
      { user_id: userId2, friend_id: userId1, status: 'accepted' }
    ]
  });
  return !!friendship;
};

// Method to get all friends for a user
friendSchema.statics.getFriends = async function(userId) {
  const friendships = await this.find({
    $or: [
      { user_id: userId, status: 'accepted' },
      { friend_id: userId, status: 'accepted' }
    ]
  }).populate('user_id', 'name email').populate('friend_id', 'name email');
  
  return friendships.map(friendship => {
    const friend = friendship.user_id._id.equals(userId) ? friendship.friend_id : friendship.user_id;
    return {
      id: friend._id,
      name: friend.name,
      email: friend.email
    };
  });
};

// Method to get pending friend requests for a user
friendSchema.statics.getPendingRequests = async function(userId) {
  const requests = await this.find({
    friend_id: userId,
    status: 'pending'
  }).populate('user_id', 'name email');
  
  return requests.map(request => ({
    id: request._id,
    user_id: request.user_id._id,
    name: request.user_id.name,
    email: request.user_id.email,
    created_at: request.created_at
  }));
};

module.exports = mongoose.model('Friend', friendSchema);

