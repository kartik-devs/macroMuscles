# MacroMuscles App with MySQL Backend

A fitness tracking application with user authentication using React Native and MySQL.

## Project Structure

```
macroMuscles/
├── src/                    # React Native app code
│   ├── api/                # API integration
│   ├── assets/             # Images and assets
│   ├── navigation/         # Navigation components
│   ├── screen/             # Screen components
│   │   ├── challenges/     # Challenge screens
│   │   ├── login/          # Authentication screens
│   │   └── workouts/       # Workout screens
│   └── style/              # Style files
└── backend/                # Node.js server
    ├── server.js           # Express server
    ├── package.json        # Backend dependencies
    ├── .env                # Environment variables
    └── db_setup.sql        # Database setup script
```

## Setup Instructions

### 1. Setting up MySQL Database

1. Install MySQL if you haven't already:
   - Windows: Download and install from [MySQL website](https://dev.mysql.com/downloads/installer/)
   - macOS: `brew install mysql`
   - Linux: `sudo apt install mysql-server`

2. Start MySQL service:
   - Windows: Through services or MySQL Workbench
   - macOS: `brew services start mysql`
   - Linux: `sudo systemctl start mysql`

3. Create the database and tables:
   ```bash
   mysql -u root -p < backend/db_setup.sql
   ```
   
   Alternatively, you can run the SQL commands directly in MySQL Workbench or MySQL CLI.

### 2. Setting up the Backend Server

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the `.env` file with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=macromuscles_db
   PORT=3000
   JWT_SECRET=your_secret_key
   ```

4. Start the server:
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

### 3. Setting up the React Native App

1. Install dependencies in the project root:
   ```bash
   npm install
   ```

2. Update the API URL in `src/api/auth.js` if needed:
   - For Android Emulator: `http://10.0.2.2:3000/api` (default)
   - For iOS Simulator: `http://localhost:3000/api`
   - For physical device: Use your computer's IP address

3. Start the React Native app:
   ```bash
   npm start
   ```

## Testing the Authentication

1. Register a new user through the app
2. Login with the registered credentials
3. You can also use the test user:
   - Email: test@example.com
   - Password: password123

## API Endpoints

- `POST /api/register` - Register a new user
  - Body: `{ "name": "User Name", "email": "user@example.com", "password": "password123" }`

- `POST /api/login` - Login a user
  - Body: `{ "email": "user@example.com", "password": "password123" }`

- `GET /api/health` - Check server status 