// Configuration for development and production environments

const config = {
  // API URLs
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'https://sby-app.onrender.com/api' // Updated with actual Render URL
    : 'http://localhost:5000/api',
  
  // MongoDB direct access URLs
  mongoDbUrl: process.env.NODE_ENV === 'production'
    ? 'https://sby-app.onrender.com/api/mongodb'
    : 'http://localhost:5000/api/mongodb',
    
  // Other app configurations
  appName: 'StrongByYoga',
  defaultCredits: 20,
};

export default config; 