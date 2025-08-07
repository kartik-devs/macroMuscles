# MacroMuscles Backend

This is the backend server for the MacroMuscles fitness app, built with Node.js, Express, and MongoDB.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/macromuscles
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
```

3. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### MongoDB Atlas Setup (Recommended)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your `.env` file:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/macromuscles
```

### API Endpoints

#### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `POST /api/forgot-password` - Request password reset

#### Workout Management
- `POST /api/workout-history` - Save workout history
- `GET /api/workout-history/:userId` - Get user's workout history

#### Challenges
- `POST /api/challenge-progress` - Save challenge progress
- `GET /api/challenge-progress/:userId/:challengeName` - Get challenge progress

#### Nutrition Tracking
- `POST /api/nutrition/daily` - Save daily nutrition
- `GET /api/nutrition/daily/:userId/:date` - Get daily nutrition
- `GET /api/nutrition/weekly/:userId` - Get weekly nutrition

#### User Goals
- `POST /api/goals` - Create/update user goal
- `GET /api/goals/:userId` - Get user's current goal

#### User Profile
- `POST /api/profile` - Update user profile
- `GET /api/profile/:userId` - Get user profile

#### Personal Bests
- `POST /api/personal-bests` - Save personal best
- `GET /api/personal-bests/:userId` - Get user's personal bests

#### Statistics & Achievements
- `GET /api/statistics/:userId` - Get user statistics
- `POST /api/statistics/update` - Update user statistics
- `GET /api/achievements/:userId` - Get user achievements

#### Social
- `GET /api/social/feed/:userId` - Get social feed

### Database Models

The application uses the following MongoDB collections:
- `users` - User accounts
- `userprofiles` - User profile information
- `workouthistories` - Workout history records
- `challengeprogresses` - Challenge progress records
- `dailynutritions` - Daily nutrition tracking
- `usergoals` - User fitness goals
- `personalbests` - Personal best records
- `userstatistics` - User statistics and streaks

### Features

- JWT-based authentication
- Password hashing with bcrypt
- MongoDB with Mongoose ODM
- RESTful API design
- Error handling and validation
- CORS enabled for frontend integration 