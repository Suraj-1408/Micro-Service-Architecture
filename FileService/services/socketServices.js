//setup socket.io event listener for row lock/unlock notifications

module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
  
      socket.on('lock-row', (data) => {
        socket.broadcast.emit('row-locked', data);
      });
  
      socket.on('unlock-row', (data) => {
        socket.broadcast.emit('row-unlocked', data);
      });
  
      socket.on('update-row', (data) => {
        socket.broadcast.emit('row-updated', data);
      });
  
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  };