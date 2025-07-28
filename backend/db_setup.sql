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

-- Insert sample user (password: password123)
INSERT INTO users (name, email, password) VALUES 
('Test User', 'test@example.com', '$2a$10$6Bnv6HxlNMjhxP0Nf3WU8uFLrun9XGFYQoLfBVFrWULldJHpXxx7a'); 