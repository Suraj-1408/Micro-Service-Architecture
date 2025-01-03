require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const { connectDB,sequelize } = require('../config/db');
const session = require('express-session');
const Admin = require('./models/adminModel');
const app = express();
const path = require('path');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


// Session configuration
app.use(session({
  secret: 'ldfsnoefnewfwenfwenfdowedlw',  //secret key
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000,httpOnly: true, secure: false }   // Set the cookie expiration as needed
}));

// Middleware
app.use(bodyParser.json());
//app.use(express.static('public'));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


// Connect to PostgreSQL
connectDB();

// Only call sync() if this is the first time or after significant model changes
sequelize.sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch((error) => console.error("Sync error:", error));


//importing and using the routes here.
const studentRoutes = require('./routes/studentRoutes');
app.use('/',studentRoutes);     // Routes

const userDashboardRoutes = require('./routes/userDashboardRoutes');
app.use('/api', userDashboardRoutes); // User dashboard

const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
app.use('/admin-dashboard', adminDashboardRoutes); // Admin dashboard

const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);



// Serve the homepage (default route)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});

// Serve the signup page
app.get('/signUp', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signUp.html'));
});

// Serve the signin page
app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signin.html'));
});

// Serve the dashboard page
app.get('/userDashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'userDashboard.html'));
});

// Admin routes

// Admin Dashboard route
app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'adminDashboard.html'));
});



//Used to communicate between different ports.
const { createProxyMiddleware } = require('http-proxy-middleware');

//Making Proxy requests for file uploads to the File Service on port 5002
app.use('/api/files', createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true }));

const PORT = process.env.PORT || 5001;
// Start the Express server
const server = app.listen(PORT, () => {
  console.log('User Service running on http://localhost:5001');
});

server.setTimeout(60000);