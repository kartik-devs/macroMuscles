const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
  
const app = express();
const PORT = process.env.PORT || 3000;  


// Middleware
app.use(cors());
app.use(express.json());

function authenticateToken(req, res, next){
  const authHeader  = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token){
      return res.status(401).json({
        message : "No Token Provided"
      });
  }

  jwt.verify(token, JWT_SECRET, (err,user) =>{
    if(err) return res.stats(403).json({
      message : "Invalid Token"
    })

    req.user = user;
    next();
  });
}


// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');

  // Create tables if they don't exist
  createTables();
});

// Function to create necessary tables
function createTables() {
  // Users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  // Workout history table
  const createWorkoutHistoryTable = `
    CREATE TABLE IF NOT EXISTS workout_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      workout_type VARCHAR(50) NOT NULL,
      duration INT NOT NULL,
      calories_burned INT,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;
  
  // Challenge progress table
  const createChallengeProgressTable = `
    CREATE TABLE IF NOT EXISTS challenge_progress (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      challenge_name VARCHAR(50) NOT NULL,
      duration INT NOT NULL,
      distance FLOAT,
      speed FLOAT,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;
  
  // Daily nutrition tracking table
  const createNutritionTable = `
    CREATE TABLE IF NOT EXISTS daily_nutrition (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      date DATE NOT NULL,
      target_calories INT DEFAULT 1900,
      consumed_calories INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE KEY unique_user_date (user_id, date)
    )
  `;
  
  // User goals table
  const createUserGoalsTable = `
    CREATE TABLE IF NOT EXISTS user_goals (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      goal_type ENUM('decrease_weight', 'maintain_health', 'increase_muscle') NOT NULL,
      target_calories INT DEFAULT 1900,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;
  
  // User profile table
  const createUserProfileTable = `
    CREATE TABLE IF NOT EXISTS user_profiles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      display_name VARCHAR(100),
      avatar_initial VARCHAR(1),
      height FLOAT,
      weight FLOAT,
      age INT,
      workout_split VARCHAR(50),
      include_cardio BOOLEAN DEFAULT FALSE,
      cardio_type VARCHAR(20),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE KEY unique_user_profile (user_id)
    )
  `;
  
  // Personal best records table
  const createPersonalBestsTable = `
    CREATE TABLE IF NOT EXISTS personal_bests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      exercise_name VARCHAR(100) NOT NULL,
      weight FLOAT NOT NULL,
      reps INT,
      date_achieved DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE KEY unique_user_exercise (user_id, exercise_name)
    )
  `;
  
  // User statistics table
  const createUserStatsTable = `
    CREATE TABLE IF NOT EXISTS user_statistics (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      total_workouts INT DEFAULT 0,
      total_calories_burned INT DEFAULT 0,
      total_workout_time INT DEFAULT 0,
      longest_streak INT DEFAULT 0,
      current_streak INT DEFAULT 0,
      last_workout_date DATE,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE KEY unique_user_stats (user_id)
    )
  `;
  
  db.query(createUsersTable, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('Users table ready');
      
      // Create workout history table after users table is ready
      db.query(createWorkoutHistoryTable, (err) => {
        if (err) {
          console.error('Error creating workout_history table:', err);
        } else {
          console.log('Workout history table ready');
        }
      });
      
      // Create challenge progress table after users table is ready
      db.query(createChallengeProgressTable, (err) => {
        if (err) {
          console.error('Error creating challenge_progress table:', err);
        } else {
          console.log('Challenge progress table ready');
        }
      });
      
      // Create nutrition table after users table is ready
      db.query(createNutritionTable, (err) => {
        if (err) {
          console.error('Error creating daily_nutrition table:', err);
        } else {
          console.log('Daily nutrition table ready');
        }
      });
      
      // Create user goals table after users table is ready
      db.query(createUserGoalsTable, (err) => {
        if (err) {
          console.error('Error creating user_goals table:', err);
        } else {
          console.log('User goals table ready');
        }
      });

      // Create user profile table after users table is ready
      db.query(createUserProfileTable, (err) => {
        if (err) {
          console.error('Error creating user_profiles table:', err);
        } else {
          console.log('User profiles table ready');
        }
      });

      // Create personal bests table after users table is ready
      db.query(createPersonalBestsTable, (err) => {
        if (err) {
          console.error('Error creating personal_bests table:', err);
        } else {
          console.log('Personal bests table ready');
        }
      });

      // Create user statistics table after users table is ready
      db.query(createUserStatsTable, (err) => {
        if (err) {
          console.error('Error creating user_statistics table:', err);
        } else {
          console.log('User statistics table ready');
        }
      });
    }
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
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Insert new user
      db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error('Error registering user:', err);
            return res.status(500).json({ message: 'Error registering user' });
          }
          // Automatically create a default user profile
          const userId = result.insertId;
          const displayName = name;
          const avatarInitial = name && name.length > 0 ? name[0] : null;
          db.query(
            'INSERT INTO user_profiles (user_id, display_name, avatar_initial, height, weight, age) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, displayName, avatarInitial, null, null, null],
            (profileErr) => {
              if (profileErr) {
                console.error('Error creating user profile:', profileErr);
                // Still return success for registration, but warn about profile
                return res.status(201).json({ 
                  message: 'User registered, but profile creation failed',
                  userId: userId
                });
              }
          res.status(201).json({ 
            message: 'User registered successfully',
                userId: userId
          });
            } 
          );
        }
      );
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', (req, res) => {


  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      
      const user = results[0];
     // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      // Return user info (excluding password) and token
      const { password: userPassword, ...userData } = user;
      res.json({
        message: 'Login successful',
        user: userData,
        token
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Workout History Endpoints
app.post('/api/workout-history', (req, res) => {
  try {
    const { user_id, workout_type, duration, calories_burned } = req.body;
    
    // Validate input
    if (!user_id || !workout_type || !duration) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Insert workout history
    db.query(
      'INSERT INTO workout_history (user_id, workout_type, duration, calories_burned) VALUES (?, ?, ?, ?)',
      [user_id, workout_type, duration, calories_burned || 0],
      (err, result) => {
        if (err) {
          console.error('Error saving workout history:', err);
          return res.status(500).json({ message: 'Error saving workout history' });
        }
        
        res.status(201).json({ 
          message: 'Workout history saved successfully',
          id: result.insertId 
        });
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/workout-history/:userId', (req, res) => {
  try {
    const userId = req.params.userId;
    
    db.query(
      'SELECT * FROM workout_history WHERE user_id = ? ORDER BY completed_at DESC',
      [userId],
      (err, results) => {
        if (err) {
          console.error('Error fetching workout history:', err);
          return res.status(500).json({ message: 'Error fetching workout history' });
        }
        
        res.json(results);
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Challenge Progress Endpoints
app.post('/api/challenge-progress', (req, res) => {
  try {
    const { user_id, challenge_name, duration, distance, speed } = req.body;
    
    // Validate input
    if (!user_id || !challenge_name || !duration) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Insert challenge progress
    db.query(
      'INSERT INTO challenge_progress (user_id, challenge_name, duration, distance, speed) VALUES (?, ?, ?, ?, ?)',
      [user_id, challenge_name, duration, distance || null, speed || null],
      (err, result) => {
        if (err) {
          console.error('Error saving challenge progress:', err);
          return res.status(500).json({ message: 'Error saving challenge progress' });
        }
        
        res.status(201).json({ 
          message: 'Challenge progress saved successfully',
          id: result.insertId 
        });
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/challenge-progress/:userId/:challengeName', (req, res) => {
  try {
    const userId = req.params.userId;
    const challengeName = req.params.challengeName;
    
    db.query(
      'SELECT * FROM challenge_progress WHERE user_id = ? AND challenge_name = ? ORDER BY completed_at DESC',
      [userId, challengeName],
      (err, results) => {
        if (err) {
          console.error('Error fetching challenge progress:', err);
          return res.status(500).json({ message: 'Error fetching challenge progress' });
        }
        
        res.json(results);
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Nutrition Tracking Endpoints
app.post('/api/nutrition/daily', (req, res) => {
  try {
    const { user_id, date, target_calories, consumed_calories } = req.body;
    
    // Validate input
    if (!user_id || !date) {
      return res.status(400).json({ message: 'User ID and date are required' });
    }
    
    // Insert or update daily nutrition
    db.query(
      `INSERT INTO daily_nutrition (user_id, date, target_calories, consumed_calories) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       target_calories = VALUES(target_calories), 
       consumed_calories = VALUES(consumed_calories)`,
      [user_id, date, target_calories || 1900, consumed_calories || 0],
      (err, result) => {
        if (err) {
          console.error('Error saving daily nutrition:', err);
          return res.status(500).json({ message: 'Error saving daily nutrition' });
        }
        
        res.status(201).json({ 
          message: 'Daily nutrition saved successfully',
          id: result.insertId || result.updateId
        });
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/nutrition/daily/:userId/:date', (req, res) => {
  try {
    const userId = req.params.userId;
    const date = req.params.date;
    
    db.query(
      'SELECT * FROM daily_nutrition WHERE user_id = ? AND date = ?',
      [userId, date],
      (err, results) => {
        if (err) {
          console.error('Error fetching daily nutrition:', err);
          return res.status(500).json({ message: 'Error fetching daily nutrition' });
        }
        
        if (results.length === 0) {
          // Return default values if no record exists
          res.json({
            user_id: parseInt(userId),
            date: date,
            target_calories: 1900,
            consumed_calories: 0
          });
        } else {
          res.json(results[0]);
        }
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/nutrition/weekly/:userId', (req, res) => {
  try {
    const userId = req.params.userId;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    
    db.query(
      `SELECT * FROM daily_nutrition 
       WHERE user_id = ? AND date BETWEEN ? AND ? 
       ORDER BY date ASC`,
      [userId, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]],
      (err, results) => {
        if (err) {
          console.error('Error fetching weekly nutrition:', err);
          return res.status(500).json({ message: 'Error fetching weekly nutrition' });
        }
        
        res.json(results);
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Goals Endpoints
app.post('/api/goals', (req, res) => {
  try {
    const { user_id, goal_type, target_calories } = req.body; 
    
    // Validate input
    if (!user_id || !goal_type) {
      return res.status(400).json({ message: 'User ID and goal type are required' });
    }
    
    // Deactivate all existing goals for this user
    db.query(
      'UPDATE user_goals SET is_active = FALSE WHERE user_id = ?',
      [user_id],
      (err) => {
        if (err) {
          console.error('Error updating existing goals:', err);
          return res.status(500).json({ message: 'Error updating goals' });
        }
        
        // Insert new goal
        db.query(
          'INSERT INTO user_goals (user_id, goal_type, target_calories) VALUES (?, ?, ?)',
          [user_id, goal_type, target_calories || 1900],
          (err, result) => {
            if (err) {
              console.error('Error creating new goal:', err);
              return res.status(500).json({ message: 'Error creating goal' });
            }
            
            res.status(201).json({ 
              message: 'Goal created successfully',
              id: result.insertId 
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/goals/:userId', (req, res) => {
  try {
    const userId = req.params.userId;
    
    db.query(
      'SELECT * FROM user_goals WHERE user_id = ? AND is_active = TRUE ORDER BY created_at DESC LIMIT 1',
      [userId],
      (err, results) => {
        if (err) {
          console.error('Error fetching user goals:', err);
          return res.status(500).json({ message: 'Error fetching user goals' });
        }
        
        if (results.length === 0) {
          // Return default goal if none exists
          res.json({
            user_id: parseInt(userId),
            goal_type: 'maintain_health',
            target_calories: 1900,
            is_active: true
          });
        } else {
          res.json(results[0]);
        }
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot Password Endpoint
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No account found with that email.' });
    }
    // Here you would send an email with a reset link/token
    return res.json({ message: 'A password reset link has been sent to your email.' });
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Update database schema - change password column to VARCHAR(255)
app.get('/api/update-schema', (req, res) => {
  const alterTableQuery = `ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NOT NULL`;
  
  db.query(alterTableQuery, (err) => {
    if (err) {
      console.error('Error updating schema:', err);
      return res.status(500).json({ message: 'Error updating database schema', error: err.message });
    }
    
    res.json({ message: 'Database schema updated successfully' });
  });
});

// Update user profile
app.post('/api/profile', (req, res) => {
  const { user_id, display_name, avatar_initial, height, weight, age, workout_split, include_cardio, cardio_type } = req.body;
  if (!user_id) return res.status(400).json({ message: 'User ID required' });

  db.query(
    `INSERT INTO user_profiles (user_id, display_name, avatar_initial, height, weight, age, workout_split, include_cardio, cardio_type)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE 
       display_name=?, avatar_initial=?, height=?, weight=?, age=?, 
       workout_split=?, include_cardio=?, cardio_type=?`,
    [
      user_id, display_name, avatar_initial, height, weight, age, workout_split, include_cardio, cardio_type,
      display_name, avatar_initial, height, weight, age, workout_split, include_cardio, cardio_type
    ],
    (err) => {
      if (err) return res.status(500).json({ message: 'Error updating profile' });
      res.json({ message: 'Profile updated successfully' });
    }
  );
});

// Get user profile by user ID
app.get('/api/profile/:userId', authenticateToken, (req, res) => {
  const userId = req.params.userId;
  db.query(
    'SELECT * FROM user_profiles WHERE user_id = ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching profile' });
      if (results.length === 0) {
        // Optionally, return a default profile or a 404
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.json(results[0]);
    }
  );
});

// Add or update personal best
app.post('/api/personal-bests', (req, res) => {
  const { user_id, exercise_name, weight, reps, date_achieved } = req.body;
  if (!user_id || !exercise_name || !weight) return res.status(400).json({ message: 'Missing required fields' });

  db.query(
    `INSERT INTO personal_bests (user_id, exercise_name, weight, reps, date_achieved)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE weight=?, reps=?, date_achieved=?`,
    [user_id, exercise_name, weight, reps, date_achieved, weight, reps, date_achieved],
    (err) => {
      if (err) return res.status(500).json({ message: 'Error saving personal best' });
      res.json({ message: 'Personal best saved successfully' });
    }
  );
});

// Get all personal bests for a user
app.get('/api/personal-bests/:userId', (req, res) => {
  const userId = req.params.userId;
  db.query(
    'SELECT * FROM personal_bests WHERE user_id = ? ORDER BY weight DESC',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching personal bests' });
      res.json(results);
    }
  );
});

// Get user achievements/medals
app.get('/api/achievements/:userId', (req, res) => {
  const userId = req.params.userId;
  db.query(
    `SELECT * FROM user_statistics WHERE user_id = ?`,
    [userId],
    (err, statsResults) => {
      if (err) return res.status(500).json({ message: 'Error fetching stats' });
      const stats = statsResults[0] || {};
      const achievements = [];
      if (stats.current_streak >= 7) achievements.push({ type: 'streak', level: 'bronze', description: '7-day streak!' });
      if (stats.current_streak >= 30) achievements.push({ type: 'streak', level: 'silver', description: '30-day streak!' });
      if (stats.current_streak >= 100) achievements.push({ type: 'streak', level: 'gold', description: '100-day streak!' });
      if (stats.total_workouts >= 10) achievements.push({ type: 'workouts', level: 'bronze', description: '10 workouts!' });
      if (stats.total_workouts >= 50) achievements.push({ type: 'workouts', level: 'silver', description: '50 workouts!' });
      if (stats.total_workouts >= 200) achievements.push({ type: 'workouts', level: 'gold', description: '200 workouts!' });
      res.json(achievements);
    }
  );
});

// Endpoint to create missing user_profiles for all users who do not have a profile
app.get('/api/fix-missing-profiles', (req, res) => {
  const insertMissingProfiles = `
    INSERT INTO user_profiles (user_id, display_name, avatar_initial, height, weight, age)
    SELECT u.id, u.name, LEFT(u.name, 1), NULL, NULL, NULL
    FROM users u
    WHERE u.id NOT IN (SELECT user_id FROM user_profiles)
  `;
  db.query(insertMissingProfiles, (err, result) => {
    if (err) {
      console.error('Error inserting missing profiles:', err);
      return res.status(500).json({ message: 'Error inserting missing profiles' });
    }
    res.json({ message: 'Missing profiles created', affectedRows: result.affectedRows });
  });
});

// Get user statistics by user ID
app.get('/api/statistics/:userId', (req, res) => {
  const userId = req.params.userId;
  db.query(
    'SELECT * FROM user_statistics WHERE user_id = ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching statistics' });
      if (results.length === 0) {
        // Return default statistics if none exist
        return res.json({
          user_id: parseInt(userId),
          total_workouts: 0,
          total_calories_burned: 0,
          total_workout_time: 0,
          longest_streak: 0,
          current_streak: 0,
          last_workout_date: null
        });
      }
      res.json(results[0]);
    }
  );
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
app.post('/api/statistics/update', (req, res) => {
  const { user_id, workout_duration, calories_burned } = req.body;
  if (!user_id) return res.status(400).json({ message: 'User ID required' });

  // Try to update existing statistics
  const updateQuery = `
    INSERT INTO user_statistics (user_id, total_workouts, total_calories_burned, total_workout_time, longest_streak, current_streak, last_workout_date)
    VALUES (?, 1, ?, ?, 1, 1, CURDATE())
    ON DUPLICATE KEY UPDATE
      total_workouts = total_workouts + 1,
      total_calories_burned = total_calories_burned + VALUES(total_calories_burned),
      total_workout_time = total_workout_time + VALUES(total_workout_time),
      last_workout_date = CURDATE(),
      current_streak = IF(DATEDIFF(CURDATE(), last_workout_date) = 1, current_streak + 1, 1),
      longest_streak = GREATEST(longest_streak, IF(DATEDIFF(CURDATE(), last_workout_date) = 1, current_streak + 1, 1))
  `;
  db.query(
    updateQuery,
    [user_id, calories_burned || 0, workout_duration || 0],
    (err, result) => {
      if (err) {
        console.error('Error updating statistics:', err);
        return res.status(500).json({ message: 'Error updating statistics' });
      }
      res.json({ message: 'Statistics updated successfully' });
    }
  );
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}); 