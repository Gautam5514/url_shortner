const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const connectDB = require('./config/db');
const userRoutes = require('./routes/user.routes');
const urlRoutes = require('./routes/url.routes');
const { redirectToOriginalUrl } = require('./controllers/redirect.controller');
const guestUrlRoutes = require('./routes/guestUrl.routes');

const app = express();
connectDB();

// ✅ Global CORS
app.use(cors({
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow all methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
  credentials: true
}));


app.use(express.json());

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/guest', guestUrlRoutes);
app.get('/:shortCode', redirectToOriginalUrl); // Public route for redirection


app.get('/', (req, res) => {
  res.send('API is running successfully!'); // <-- This is the GET / route
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
