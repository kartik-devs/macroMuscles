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

// Social feed endpoint
app.get('/api/social/feed/:userId', (req, res) => {
  const userId = req.params.userId;
  
  // For now, return a mock social feed
  const mockFeed = [
    {
      id: 1,
      user_id: 2,
      user_name: 'John Doe',
      content: 'Just completed an amazing chest workout! 💪',
      likes: 15,
      comments: 3,
      timestamp: new Date().toISOString(),
      workout_type: 'Chest',
      duration: 45,
      calories_burned: 320
    },
    {
      id: 2,
      user_id: 3,
      user_name: 'Sarah Smith',
      content: 'New personal best on deadlifts today! 🏋️‍♀️',
      likes: 23,
      comments: 7,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      workout_type: 'Back',
      duration: 60,
      calories_burned: 450
    },
    {
      id: 3,
      user_id: 4,
      user_name: 'Mike Johnson',
      content: 'Leg day is the best day! 🔥',
      likes: 18,
      comments: 5,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      workout_type: 'Legs',
      duration: 55,
      calories_burned: 380
    }
  ];
  
  res.json(mockFeed);
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

// Profile picture endpoints
app.post('/api/profile/picture', async (req, res) => {
  try {
    const { user_id, image_url } = req.body;
    if (!user_id || !image_url) return res.status(400).json({ message: 'User ID and image URL required' });

    const profile = await UserProfile.findOneAndUpdate(
      { user_id },
      { profile_picture_url: image_url },
      { upsert: true, new: true }
    );

    res.json({ message: 'Profile picture updated successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Error updating profile picture' });
  }
});

app.get('/api/profile/picture/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await UserProfile.findOne({ user_id: userId });
    
    if (!profile || !profile.profile_picture_url) {
      return res.status(404).json({ message: 'Profile picture not found' });
    }
    
    res.json({ profile_picture: { image_url: profile.profile_picture_url } });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Error fetching profile picture' });
  }
});

// User level and experience endpoints
app.get('/api/profile/level/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const stats = await UserStatistics.findOne({ user_id: userId });
    
    if (!stats) {
      return res.json({ level: 1, experience_points: 0 });
    }
    
    // Calculate level based on total workouts (simple formula)
    const level = Math.floor(stats.total_workouts / 10) + 1;
    const experience_points = stats.total_workouts * 10 + stats.total_calories_burned;
    
    res.json({ level, experience_points });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Error fetching user level' });
  }
});

// User badges endpoint
app.get('/api/profile/badges/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const stats = await UserStatistics.findOne({ user_id: userId }) || {};
    const personalBests = await PersonalBest.find({ user_id: userId });
    
    const badges = [];
    
    // Workout count badges
    if (stats.total_workouts >= 1) badges.push({ name: 'First Steps', icon: 'fitness', color: '#44bd32' });
    if (stats.total_workouts >= 10) badges.push({ name: 'Dedicated', icon: 'trophy', color: '#f39c12' });
    if (stats.total_workouts >= 50) badges.push({ name: 'Committed', icon: 'medal', color: '#e74c3c' });
    if (stats.total_workouts >= 100) badges.push({ name: 'Elite', icon: 'star', color: '#9b59b6' });
    
    // Streak badges
    if (stats.current_streak >= 3) badges.push({ name: 'On Fire', icon: 'flame', color: '#e67e22' });
    if (stats.current_streak >= 7) badges.push({ name: 'Week Warrior', icon: 'calendar', color: '#3498db' });
    if (stats.current_streak >= 30) badges.push({ name: 'Month Master', icon: 'time', color: '#2ecc71' });
    
    // Personal best badges
    if (personalBests.length >= 1) badges.push({ name: 'Strong Start', icon: 'barbell', color: '#34495e' });
    if (personalBests.length >= 5) badges.push({ name: 'Power Lifter', icon: 'fitness', color: '#e74c3c' });
    
    res.json({ badges });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Error fetching badges' });
  }
});

// Body measurements endpoints
app.post('/api/body-measurements', async (req, res) => {
  try {
    const { user_id, weight, body_fat_percentage, muscle_mass, date } = req.body;
    if (!user_id) return res.status(400).json({ message: 'User ID required' });

    // Update profile with latest measurements
    await UserProfile.findOneAndUpdate(
      { user_id },
      {
        weight: weight || null,
        body_fat_percentage: body_fat_percentage || null,
        muscle_mass: muscle_mass || null,
        last_measurement_date: date ? new Date(date) : new Date()
      },
      { upsert: true }
    );

    res.json({ message: 'Body measurements saved successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Error saving body measurements' });
  }
});

app.get('/api/body-measurements/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await UserProfile.findOne({ user_id: userId });
    
    if (!profile) {
      return res.json({ weight: null, body_fat_percentage: null, muscle_mass: null });
    }
    
    res.json({
      weight: profile.weight,
      body_fat_percentage: profile.body_fat_percentage,
      muscle_mass: profile.muscle_mass,
      last_measurement_date: profile.last_measurement_date
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Error fetching body measurements' });
  }
});

// Weekly progress endpoint
app.get('/api/progress/weekly/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    
    const workouts = await WorkoutHistory.find({
      user_id: userId,
      completed_at: { $gte: startDate, $lte: endDate }
    });
    
    const stats = await UserStatistics.findOne({ user_id: userId }) || {};
    const goals = await UserGoal.findOne({ user_id: userId, is_active: true }) || {};
    
    // Calculate weekly progress
    const weeklyWorkouts = workouts.length;
    const weeklyGoal = 5; // Default weekly workout goal
    const workoutProgress = Math.min((weeklyWorkouts / weeklyGoal) * 100, 100);
    
    res.json({
      workout_progress: Math.round(workoutProgress),
      current_streak: stats.current_streak || 0,
      weekly_workouts: weeklyWorkouts,
      weekly_goal: weeklyGoal
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Error fetching weekly progress' });
  }
});

// Recent activity endpoint
app.get('/api/activity/recent/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const limit = parseInt(req.query.limit) || 10;
    
    const workouts = await WorkoutHistory.find({ user_id: userId })
      .sort({ completed_at: -1 })
      .limit(limit);
    
    const personalBests = await PersonalBest.find({ user_id: userId })
      .sort({ date_achieved: -1 })
      .limit(3);
    
    const activities = [];
    
    // Add workout activities
    workouts.forEach(workout => {
      activities.push({
        type: 'workout',
        title: `${workout.workout_type} Workout`,
        time: workout.completed_at,
        duration: workout.duration,
        calories: workout.calories_burned,
        icon: 'fitness'
      });
    });
    
    // Add personal best activities
    personalBests.forEach(pb => {
      activities.push({
        type: 'achievement',
        title: `New PR: ${pb.exercise_name}`,
        time: pb.date_achieved,
        weight: pb.weight,
        icon: 'trophy'
      });
    });
    
    // Sort by time and limit
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    res.json(activities.slice(0, limit));
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Error fetching recent activity' });
  }
});

// Workout calendar endpoint
app.get('/api/calendar/weekly/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6); // Last 7 days
    
    const workouts = await WorkoutHistory.find({
      user_id: userId,
      completed_at: { $gte: startDate, $lte: endDate }
    });
    
    // Create array for each day of the week
    const weekData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayWorkouts = workouts.filter(w => {
        const workoutDate = new Date(w.completed_at);
        return workoutDate.toDateString() === date.toDateString();
      });
      
      weekData.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        hasWorkout: dayWorkouts.length > 0,
        workoutCount: dayWorkouts.length,
        isToday: date.toDateString() === new Date().toDateString()
      });
    }
    
    res.json(weekData);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Error fetching calendar data' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}); 