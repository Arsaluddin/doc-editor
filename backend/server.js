const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const jwt = require('express-jwt');
const bcrypt = require('bcrypt');
const cors = require('cors');
const User = require('./User');
const Document = require("./Document");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
mongoose.connect(process.env.URL);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// User authentication routes
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({user :newUser, message: 'Signup successful' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Signup failed' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    res.json({ user :user, message: "login"});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Socket.IO connection handling
io.on("connection", socket => {
  // Your existing Socket.IO logic for document collaboration
  socket.on("get-document", async documentId => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async data => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

// Find or create document function
async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: "Arsal" });
}

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
