const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Document = require("./Document");
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const cors = require('cors');
dotenv.config();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:5173", // Update with your frontend URL
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
mongoose.connect(process.env.URL);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User model (replace with your actual User model)
const User = require('./User');

app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Passport setup
passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
      if (!user.validPassword(password)) { return done(null, false, { message: 'Incorrect password.' }); }
      return done(null, user);
    });
  }
));

app.use(passport.initialize());

// User authentication routes
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser.save();
    res.json({ message: 'Signup successful' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Signup failed' });
  }
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.status(401).json({ message: 'Authentication failed' }); }

    // Generate JWT token on successful login
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' }); // Replace 'your-secret-key' with your actual JWT secret
    res.json({ user, token });
  })(req, res, next);
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
