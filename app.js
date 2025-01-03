require('dotenv').config();
//const sequelize = require('./config/db');  
const cors = require('cors');
//const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const { connectDB, sequelize } = require('./config/db');
//const { Sequelize } = require('sequelize'); // Import Sequelize here


const session = require('express-session');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

/* Import models here
//const  Student  = require('./UserService/models/studentModel')(sequelize, Sequelize.DataTypes);
const  SharedFiles  = require('./UserService/models/sharedFileModel')(sequelize, Sequelize.DataTypes);
const  FileAccess  = require('./UserService/models/fileAccess')(sequelize, Sequelize.DataTypes);
*/

// Import routes
const studentRoutes = require('./UserService/routes/studentRoutes');
const userDashboardRoutes = require('./UserService/routes/userDashboardRoutes');
const adminDashboardRoutes = require('./UserService/routes/adminDashboardRoutes');
const authRoutes = require('./UserService/routes/authRoutes');
const adminRoutes = require('./UserService/routes/adminRoutes');
const fileRoutes = require('./FileService/routes/fileRoutes');
const collabRoutes = require('./collaborationService/routes/collabRoutes');

// Socket.io service (for file service)
const socketService = require('./FileService/services/socketServices');

// Create Express app
const app = express();
const http = require('http');
const socketIO = require('socket.io');

// Setup server and socket.io
const server = http.createServer(app);
const io = socketIO(server);

// Static files
app.use(express.static(path.join(__dirname, 'UserService','public')));
app.use(express.json());

// Session configuration
app.use(session({
  secret: 'ldfsnoefnewfwenfwenfdoweddfdsfdsfsdfsslw',
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true,maxAge: 86400000 ,secure: false,}   // Adjust as needed
}));

// Middleware
app.use(bodyParser.json());
//app.use(cors());  // Allow all origins (You may restrict it later for production)
app.use(cors({
  origin: 'http://localhost:5001',  // Adjust to the frontend domain
  credentials: true,  // Allow sending cookies with cross-origin requests
}));


// Connect to PostgreSQL
connectDB();



// Sync models
sequelize.sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch((error) => console.error("Sync error:", error));

// Routes
app.use('/', studentRoutes);  // User-related routes
app.use('/', userDashboardRoutes);  // User Dashboard
app.use('/admin-dashboard', adminDashboardRoutes);  // Admin Dashboard

app.use('/', authRoutes);  // Authentication Routes
app.use('/user', authRoutes);  // This will allow the /user/profile route to work correctly

app.use('/admin', adminRoutes);  // Admin Routes
app.use('/api/files', fileRoutes);  // File Service Routes

app.use('/api/user', userDashboardRoutes); // Access routes under `/api/user`
app.use('/api/collab',collabRoutes);        // Collaboration Service Routes


const mime = require('mime-types');

// Serve files from the uploads folder
app.use('/uploads', (req, res, next) => {
  const filePath = path.join(__dirname, 'FileService', 'uploads', req.path);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If file not found, return 404
      return res.status(404).json({ error: 'File not found' });
    }
     
    // Set the appropriate MIME type based on the file extension
     const mimeType = mime.contentType(filePath) || 'application/vnd.oasis.opendocument.spreadsheet';
    // Get the MIME type of the file
    console.log(`Serving file with MIME type: ${mimeType}`);
 
    /*
     if(mimeType){
        res.setHeader('Content-Type', mimeType);
     }else{
        res.setHeader('Content-Type', 'application/octet-stream'); // Fallback for unknown types
     }
    // If the file exists, set the appropriate content-disposition header
    res.setHeader('Content-Disposition', 'inline;filename="'+ path.basename(filePath) + '"');
    */
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'no-store'); // Avoid caching to force reload

    // If the file exists, serve it to the client
    res.sendFile(filePath);
  });
});


// Your other app setup and routes
app.use('/file-service', require('./FileService/routes/fileRoutes'));

// Serve the 'uploads' directory from the 'FileService' folder
app.use('/uploads', express.static(path.join(__dirname, 'FileService', 'uploads')));


// Serve static pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'UserService','public', 'homepage.html'));
});

app.get('/signUp', (req, res) => {
  res.sendFile(path.join(__dirname,'UserService', 'public', 'signUp.html'));
});

app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname,'UserService' ,'public', 'signin.html'));
});

app.get('/userDashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'UserService','public', 'userDashboard.html'));
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname,'UserService', 'public', 'adminDashboard.html'));
});

// Proxy for file upload requests to File Service (running on port 5002)
app.use('/external-files', createProxyMiddleware({
  target: 'http://localhost:5002', // File Service port
  changeOrigin: true,
}));

// Setup Socket.io for real-time updates
socketService(io);

// Start User Service Server
const USER_SERVICE_PORT = process.env.USER_SERVICE_PORT || 5001;
server.listen(USER_SERVICE_PORT, () => {
  console.log(`User Service running on http://localhost:${USER_SERVICE_PORT}`);
});

server.setTimeout(60000);
