const express = require('express');
const http = require('http');       //used for communicating with other service
const socketIO = require('socket.io');      //for realtime update happening on file.
const fileRoutes = require('./routes/fileRoutes');
const socketService =  require('./services/socketServices');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5001', // Replace with the URL of the frontend
  methods: ['GET', 'POST']
}));


// Middleware
app.use(express.json());
app.use('/api/files', fileRoutes);

// Setup Socket.io
socketService(io);

// Start Server
const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`File Service running on port ${PORT}`);
});