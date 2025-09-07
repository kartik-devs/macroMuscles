// Use local server for development, production server for deployment
export const API_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://macromuscles.onrender.com/api';