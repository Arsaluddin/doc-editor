const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import the cors middleware

const app = express();
const server = http.createServer(app);
// const io = socketIo(server);
const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:5173/",
    methods: ["GET", "POST"],
  },
})

const PORT = process.env.PORT || 3001;

// Use cors middleware
app.use(cors());

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle text changes
  socket.on('text-change', (data) => {
    io.emit('text-change', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
