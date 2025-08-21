const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');

// Import models
const User = require('./models/User');
const UserProfile = require('./models/UserProfile');
const WorkoutHistory = require('./models/WorkoutHistory');
const ChallengeProgress = require('./models/ChallengeProgress');
const DailyNutrition = require('./models/DailyNutrition');
const UserGoal = require('./models/UserGoal');
const PersonalBest = require('./models/PersonalBest');
const UserStatistics = require('./models/UserStatistics');
const Friend = require('./models/Friend');
const SharedWorkout = require('./models/SharedWorkout');
const WorkoutLike = require('./models/WorkoutLike');
const WorkoutComment = require('./models/WorkoutComment');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/macromuscles';

// Debug: Log environment variables
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: "No Token Provided"
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({
      message: "Invalid Token"
    });

    req.user = user;
    next();
  });
}

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Create new user
    const user = new User({ name, email, password });
    await user.save();
    
    // Create default user profile
    const userProfile = new UserProfile({
      user_id: user._id,
      display_name: name,
      avatar_initial: name && name.length > 0 ? name[0] : null
    });
    await userProfile.save();
    
    res.status(201).json({ 
      message: 'User registered successfully',
      userId: user._id
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // Return user info (excluding password) and token
    const { password: userPassword, ...userData } = user.toObject();
    res.json({
      message: 'Login successful',
      user: userData,
      token
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Workout History Endpoints
app.post('/api/workout-history', async (req, res) => {
  try {
    const { user_id, workout_type, duration, calories_burned } = req.body;
    
    // Validate input
    if (!user_id || !workout_type || !duration) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Insert workout history
    const workoutHistory = new WorkoutHistory({
      user_id,
      workout_type,
      duration,
      calories_burned: calories_burned || 0
    });
    await workoutHistory.save();
    
    res.status(201).json({ 
      message: 'Workout history saved successfully',
      id: workoutHistory._id 
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/workout-history/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const workoutHistory = await WorkoutHistory.find({ user_id: userId })
      .sort({ completed_at: -1 });
    
    res.json(workoutHistory);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Challenge Progress Endpoints
app.post('/api/challenge-progress', async (req, res) => {
  try {
    const { user_id, challenge_name, duration, distance, speed } = req.body;
    
    // Validate input
    if (!user_id || !challenge_name || !duration) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Insert challenge progress
    const challengeProgress = new ChallengeProgress({
      user_id,
      challenge_name,
      duration,
      distance: distance || null,
      speed: speed || null
    });
    await challengeProgress.save();
    
    res.status(201).json({ 
      message: 'Challenge progress saved successfully',
      id: challengeProgress._id 
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/challenge-progress/:userId/:challengeName', async (req, res) => {
  try {
    const userId = req.params.userId;
    const challengeName = req.params.challengeName;
    
    const challengeProgress = await ChallengeProgress.find({ 
      user_id: userId, 
      challenge_name: challengeName 
    }).sort({ completed_at: -1 });
    
    res.json(challengeProgress);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Nutrition Tracking Endpoints
app.post('/api/nutrition/daily', async (req, res) => {
  try {
    const { user_id, date, target_calories, consumed_calories } = req.body;
    
    // Validate input
    if (!user_id || !date) {
      return res.status(400).json({ message: 'User ID and date are required' });
    }
    
    // Insert or update daily nutrition
    const nutritionData = await DailyNutrition.findOneAndUpdate(
      { user_id, date: new Date(date) },
      {
        user_id,
        date: new Date(date),
        target_calories: target_calories || 1900,
        consumed_calories: consumed_calories || 0
      },
      { upsert: true, new: true }
    );
    
    res.status(201).json({ 
      message: 'Daily nutrition saved successfully',
      id: nutritionData._id
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/nutrition/daily/:userId/:date', async (req, res) => {
  try {
    const userId = req.params.userId;
    const date = req.params.date;
    
    const nutritionData = await DailyNutrition.findOne({ 
      user_id: userId, 
      date: new Date(date) 
    });
    
    if (!nutritionData) {
      // Return default values if no record exists
      res.json({
        user_id: userId,
        date: date,
        target_calories: 1900,
        consumed_calories: 0
      });
    } else {
      res.json(nutritionData);
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/nutrition/weekly/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    
    const nutritionData = await DailyNutrition.find({
      user_id: userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });
    
    res.json(nutritionData);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Goals Endpoints
app.post('/api/goals', async (req, res) => {
  try {
    const { user_id, goal_type, target_calories } = req.body; 
    
    // Validate input
    if (!user_id || !goal_type) {
      return res.status(400).json({ message: 'User ID and goal type are required' });
    }
    
    // Deactivate all existing goals for this user
    await UserGoal.updateMany(
      { user_id },
      { is_active: false }
    );
    
    // Insert new goal
    const userGoal = new UserGoal({
      user_id,
      goal_type,
      target_calories: target_calories || 1900
    });
    await userGoal.save();
    
    res.status(201).json({ 
      message: 'Goal created successfully',
      id: userGoal._id 
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/goals/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const userGoal = await UserGoal.findOne({ 
      user_id: userId, 
      is_active: true 
    }).sort({ createdAt: -1 });
    
    if (!userGoal) {
      // Return default goal if none exists
      res.json({
        user_id: userId,
        goal_type: 'maintain_health',
        target_calories: 1900,
        is_active: true
      });
    } else {
      res.json(userGoal);
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot Password Endpoint
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email.' });
    }
    
    // Here you would send an email with a reset link/token
    return res.json({ message: 'A password reset link has been sent to your email.' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Temporary endpoint to add sample users for testing
app.post('/api/test/add-sample-users', async (req, res) => {
  try {
    const sampleUsers = [
      { name: 'John Doe', email: 'john@example.com', password: 'password123' },
      { name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
      { name: 'Mike Johnson', email: 'mike@example.com', password: 'password123' },
      { name: 'Sarah Wilson', email: 'sarah@example.com', password: 'password123' },
      { name: 'David Brown', email: 'david@example.com', password: 'password123' },
      { name: 'Emily Davis', email: 'emily@example.com', password: 'password123' },
      { name: 'Robert Taylor', email: 'robert@example.com', password: 'password123' },
      { name: 'Lisa Anderson', email: 'lisa@example.com', password: 'password123' }
    ];
    
    const createdUsers = [];
    for (const userData of sampleUsers) {
      try {
        const existingUser = await User.findOne({ email: userData.email });
        if (!existingUser) {
          const user = new User(userData);
          await user.save();
          createdUsers.push({ id: user._id, name: user.name, email: user.email });
        }
      } catch (error) {
        console.error(`Error creating user ${userData.email}:`, error);
      }
    }
    
    res.json({ 
      message: `Added ${createdUsers.length} sample users`,
      users: createdUsers
    });
  } catch (error) {
    console.error('Error adding sample users:', error);
    res.status(500).json({ message: 'Error adding sample users' });
  }
});


// Update user profile
app.post('/api/profile', async (req, res) => {
  try {
    const { user_id, display_name, avatar_initial, height, weight, age, workout_split, include_cardio, cardio_type } = req.body;
    if (!user_id) return res.status(400).json({ message: 'User ID required' });

    const profileData = await UserProfile.findOneAndUpdate(
      { user_id },
      {
        user_id,
        display_name,
        avatar_initial,
        height,
        weight,
        age,
        workout_split,
        include_cardio,
        cardio_type
      },
      { upsert: true, new: true }
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Get user profile by user ID
app.get('/api/profile/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await UserProfile.findOne({ user_id: userId });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Add or update personal best
app.post('/api/personal-bests', async (req, res) => {
  try {
    const { user_id, exercise_name, weight, reps, date_achieved } = req.body;
    if (!user_id || !exercise_name || !weight) return res.status(400).json({ message: 'Missing required fields' });

    const personalBest = await PersonalBest.findOneAndUpdate(
      { user_id, exercise_name },
      {
        user_id,
        exercise_name,
        weight,
        reps,
        date_achieved: date_achieved ? new Date(date_achieved) : new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ message: 'Personal best saved successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Error saving personal best' });
  }
});

// Get all personal bests for a user
app.get('/api/personal-bests/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const personalBests = await PersonalBest.find({ user_id: userId }).sort({ weight: -1 });
    res.json(personalBests);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Error fetching personal bests' });
  }
});

// Get user achievements/medals
app.get('/api/achievements/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const stats = await UserStatistics.findOne({ user_id: userId }) || {};
    
    const achievements = [];
    if (stats.current_streak >= 7) achievements.push({ type: 'streak', level: 'bronze', description: '7-day streak!' });
    if (stats.current_streak >= 30) achievements.push({ type: 'streak', level: 'silver', description: '30-day streak!' });
    if (stats.current_streak >= 100) achievements.push({ type: 'streak', level: 'gold', description: '100-day streak!' });
    if (stats.total_workouts >= 10) achievements.push({ type: 'workouts', level: 'bronze', description: '10 workouts!' });
    if (stats.total_workouts >= 50) achievements.push({ type: 'workouts', level: 'silver', description: '50 workouts!' });
    if (stats.total_workouts >= 200) achievements.push({ type: 'workouts', level: 'gold', description: '200 workouts!' });
    
    res.json(achievements);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Error fetching achievements' });
  }
});

// Get user statistics by user ID
app.get('/api/statistics/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const stats = await UserStatistics.findOne({ user_id: userId });
    
    if (!stats) {
      // Return default statistics if none exist
      return res.json({
        user_id: userId,
        total_workouts: 0,
        total_calories_burned: 0,
        total_workout_time: 0,
        longest_streak: 0,
        current_streak: 0,
        last_workout_date: null
      });
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

// Friends Routes
// Search for users
app.get('/api/users/search', authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }
    
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    }).select('name email').limit(20);
    
    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Error searching users' });
  }
});

// Send friend request
app.post('/api/friends/request', authenticateToken, async (req, res) => {
  try {
    const { user_id, friend_id } = req.body;
    
    if (!user_id || !friend_id) {
      return res.status(400).json({ message: 'User ID and friend ID are required' });
    }
    
    if (user_id === friend_id) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }
    
    // Check if users exist
    const [user, friend] = await Promise.all([
      User.findById(user_id),
      User.findById(friend_id)
    ]);
    
    if (!user || !friend) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if friendship already exists
    const existingFriendship = await Friend.findOne({
      $or: [
        { user_id, friend_id },
        { user_id: friend_id, friend_id: user_id }
      ]
    });
    
    if (existingFriendship) {
      if (existingFriendship.status === 'accepted') {
        return res.status(400).json({ message: 'You are already friends' });
      } else if (existingFriendship.status === 'pending') {
        if (existingFriendship.user_id.equals(user_id)) {
          return res.status(400).json({ message: 'Friend request already sent' });
        } else {
          return res.status(400).json({ message: 'You already have a pending request from this user' });
        }
      }
    }
    
    // Create friend request
    const friendRequest = new Friend({
      user_id,
      friend_id,
      status: 'pending'
    });
    
    await friendRequest.save();
    
    res.status(201).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: 'Error sending friend request' });
  }
});

// Get friend requests for a user
app.get('/api/friends/requests/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const requests = await Friend.getPendingRequests(userId);
    res.json(requests);
  } catch (error) {
    console.error('Error getting friend requests:', error);
    res.status(500).json({ message: 'Error getting friend requests' });
  }
});

// Respond to friend request
app.put('/api/friends/request/:requestId', authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected' });
    }
    
    const friendRequest = await Friend.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }
    
    friendRequest.status = status;
    friendRequest.updated_at = new Date();
    await friendRequest.save();
    
    res.json({ message: `Friend request ${status}` });
  } catch (error) {
    console.error('Error responding to friend request:', error);
    res.status(500).json({ message: 'Error responding to friend request' });
  }
});

// Get friends list
app.get('/api/friends/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const friends = await Friend.getFriends(userId);
    res.json(friends);
  } catch (error) {
    console.error('Error getting friends:', error);
    res.status(500).json({ message: 'Error getting friends' });
  }
});

// Social Routes
// Share a workout
app.post('/api/social/share', authenticateToken, async (req, res) => {
  try {
    const { user_id, workout_id, caption, visibility } = req.body;
    
    if (!user_id || !workout_id) {
      return res.status(400).json({ message: 'User ID and workout ID are required' });
    }
    
    // Check if workout exists
    const workout = await WorkoutHistory.findById(workout_id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    // Create shared workout
    const sharedWorkout = new SharedWorkout({
      user_id,
      workout_id,
      caption,
      visibility: visibility || 'friends'
    });
    
    await sharedWorkout.save();
    
    res.status(201).json({ 
      message: 'Workout shared successfully',
      id: sharedWorkout._id
    });
  } catch (error) {
    console.error('Error sharing workout:', error);
    res.status(500).json({ message: 'Error sharing workout' });
  }
});

// Get social feed
app.get('/api/social/feed/:userId', authenticateToken, async (req, res) => {
  try {
  const userId = req.params.userId;
  
    // Get user's friends
    const friends = await Friend.getFriends(userId);
    const friendIds = friends.map(friend => friend.id);
    
    // Get shared workouts from friends and public workouts
    const sharedWorkouts = await SharedWorkout.find({
      $or: [
        { user_id: { $in: friendIds } },
        { visibility: 'public' }
      ]
    })
    .populate('user_id', 'name email')
    .populate('workout_id')
    .sort({ created_at: -1 })
    .limit(50);
    
    // Format feed items
    const feed = await Promise.all(sharedWorkouts.map(async (shared) => {
      const workout = shared.workout_id;
      const user = shared.user_id;
      
      // Check if current user has liked this post
      const hasLiked = await WorkoutLike.hasLiked(userId, shared._id);
      
      return {
        id: shared._id,
        user_id: user._id,
        user_name: user.name,
        caption: shared.caption,
        workout_type: workout.workout_type,
        duration: workout.duration,
        calories_burned: workout.calories_burned,
        likes_count: shared.likes_count,
        comments_count: shared.comments_count,
        user_liked: hasLiked,
        created_at: shared.created_at
      };
    }));
    
    res.json(feed);
  } catch (error) {
    console.error('Error getting social feed:', error);
    res.status(500).json({ message: 'Error getting social feed' });
  }
});

// Like a workout
app.post('/api/social/like', authenticateToken, async (req, res) => {
  try {
    const { user_id, shared_workout_id } = req.body;
    
    if (!user_id || !shared_workout_id) {
      return res.status(400).json({ message: 'User ID and shared workout ID are required' });
    }
    
    // Check if already liked
    const existingLike = await WorkoutLike.findOne({ user_id, shared_workout_id });
    if (existingLike) {
      return res.status(400).json({ message: 'Already liked this workout' });
    }
    
    // Create like
    const like = new WorkoutLike({ user_id, shared_workout_id });
    await like.save();
    
    // Update like count
    await SharedWorkout.findByIdAndUpdate(shared_workout_id, {
      $inc: { likes_count: 1 }
    });
    
    res.json({ message: 'Workout liked successfully' });
  } catch (error) {
    console.error('Error liking workout:', error);
    res.status(500).json({ message: 'Error liking workout' });
  }
});

// Unlike a workout
app.delete('/api/social/like', authenticateToken, async (req, res) => {
  try {
    const { user_id, shared_workout_id } = req.body;
    
    if (!user_id || !shared_workout_id) {
      return res.status(400).json({ message: 'User ID and shared workout ID are required' });
    }
    
    // Remove like
    const deletedLike = await WorkoutLike.findOneAndDelete({ user_id, shared_workout_id });
    if (!deletedLike) {
      return res.status(400).json({ message: 'Like not found' });
    }
    
    // Update like count
    await SharedWorkout.findByIdAndUpdate(shared_workout_id, {
      $inc: { likes_count: -1 }
    });
    
    res.json({ message: 'Like removed successfully' });
  } catch (error) {
    console.error('Error removing like:', error);
    res.status(500).json({ message: 'Error removing like' });
  }
});

// Comment on a workout
app.post('/api/social/comment', authenticateToken, async (req, res) => {
  try {
    const { user_id, shared_workout_id, comment } = req.body;
    
    if (!user_id || !shared_workout_id || !comment) {
      return res.status(400).json({ message: 'User ID, shared workout ID, and comment are required' });
    }
    
    // Create comment
    const workoutComment = new WorkoutComment({
      user_id,
      shared_workout_id,
      comment
    });
    
    await workoutComment.save();
    
    // Update comment count
    await SharedWorkout.findByIdAndUpdate(shared_workout_id, {
      $inc: { comments_count: 1 }
    });
    
    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// Get comments for a workout
app.get('/api/social/comments/:sharedWorkoutId', authenticateToken, async (req, res) => {
  try {
    const { sharedWorkoutId } = req.params;
    const comments = await WorkoutComment.getCommentsForWorkout(sharedWorkoutId);
    res.json(comments);
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ message: 'Error getting comments' });
  }
});

// Update user statistics (insert or update)
app.post('/api/statistics/update', async (req, res) => {
  try {
    const { user_id, workout_duration, calories_burned } = req.body;
    if (!user_id) return res.status(400).json({ message: 'User ID required' });

    const today = new Date();
    const stats = await UserStatistics.findOne({ user_id });
    
    if (stats) {
      // Update existing statistics
      const daysSinceLastWorkout = stats.last_workout_date 
        ? Math.floor((today - new Date(stats.last_workout_date)) / (1000 * 60 * 60 * 24))
        : 0;
      
      const newStreak = daysSinceLastWorkout === 1 ? stats.current_streak + 1 : 1;
      
      stats.total_workouts += 1;
      stats.total_calories_burned += calories_burned || 0;
      stats.total_workout_time += workout_duration || 0;
      stats.current_streak = newStreak;
      stats.longest_streak = Math.max(stats.longest_streak, newStreak);
      stats.last_workout_date = today;
      
      await stats.save();
    } else {
      // Create new statistics
      const newStats = new UserStatistics({
        user_id,
        total_workouts: 1,
        total_calories_burned: calories_burned || 0,
        total_workout_time: workout_duration || 0,
        current_streak: 1,
        longest_streak: 1,
        last_workout_date: today
      });
      await newStats.save();
    }
    
    res.json({ message: 'Statistics updated successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Error updating statistics' });
  }
});

// Delete user profile and all associated data
app.delete('/api/profile/delete/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Delete all user-related data
    await Promise.all([
      User.findByIdAndDelete(userId),
      UserProfile.deleteMany({ user_id: userId }),
      WorkoutHistory.deleteMany({ user_id: userId }),
      ChallengeProgress.deleteMany({ user_id: userId }),
      DailyNutrition.deleteMany({ user_id: userId }),
      UserGoal.deleteMany({ user_id: userId }),
      PersonalBest.deleteMany({ user_id: userId }),
      UserStatistics.deleteMany({ user_id: userId }),
      Friend.deleteMany({ $or: [{ user_id: userId }, { friend_id: userId }] }),
      SharedWorkout.deleteMany({ user_id: userId }),
      WorkoutLike.deleteMany({ user_id: userId }),
      WorkoutComment.deleteMany({ user_id: userId })
    ]);
    
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ message: 'Error deleting profile' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}); 