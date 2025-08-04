-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS macromuscles_db;


-- Use the database
USE macromuscles_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--!Primary Key : a column in a database that uniquely identifies each row in the table.

-- Create workout_history table
CREATE TABLE IF NOT EXISTS workout_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  workout_type VARCHAR(50) NOT NULL,
  duration INT NOT NULL, -- in minutes
  calories_burned INT,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create challenge_progress table
CREATE TABLE IF NOT EXISTS challenge_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  challenge_name VARCHAR(50) NOT NULL,
  duration INT NOT NULL, -- in seconds
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS plank_challenge_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  duration INT NOT NULL,           -- seconds held
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Profile pictures table
CREATE TABLE IF NOT EXISTS profile_pictures (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Friends table
CREATE TABLE IF NOT EXISTS friends (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  status ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (friend_id) REFERENCES users(id)
);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  privacy_mode ENUM('public', 'friends', 'private') DEFAULT 'public',
  theme ENUM('light', 'dark') DEFAULT 'light',
  units ENUM('metric', 'imperial') DEFAULT 'metric',
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- User levels and badges table
CREATE TABLE IF NOT EXISTS user_levels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  level INT DEFAULT 1,
  experience_points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  requirement_type ENUM('workouts', 'streak', 'challenge', 'social') NOT NULL,
  requirement_value INT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  badge_id INT NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (badge_id) REFERENCES badges(id)
);

-- Workout sharing table
CREATE TABLE IF NOT EXISTS shared_workouts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  workout_type VARCHAR(50) NOT NULL,
  duration INT NOT NULL,
  calories_burned INT,
  caption TEXT,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS workout_likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  shared_workout_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (shared_workout_id) REFERENCES shared_workouts(id)
);

-- Insert sample badges
INSERT INTO badges (name, description, icon, color, requirement_type, requirement_value) VALUES 
('First Workout', 'Complete your first workout', 'fitness-outline', '#44bd32', 'workouts', 1),
('Workout Warrior', 'Complete 10 workouts', 'barbell', '#E53935', 'workouts', 10),
('Streak Master', 'Maintain a 7-day workout streak', 'flame', '#f39c12', 'streak', 7),
('Challenge Champion', 'Complete 5 challenges', 'trophy', '#8e44ad', 'challenge', 5),
('Social Butterfly', 'Add 5 friends', 'people', '#0097e6', 'social', 5);

-- Insert sample user (password: password123)
INSERT INTO users (name, email, password) VALUES 
('Test User', 'test@example.com', '$2a$10$6Bnv6HxlNMjhxP0Nf3WU8uFLrun9XGFYQoLfBVFrWULldJHpXxx7a'); 