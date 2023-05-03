const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const verifyToken = require('./middlewares/verifyToken')
const imageRoutes = require('./routes/image.routes')

// Create a new Express app
const app = express();

// Configure middleware

// middleware to parse request bodies as JSON
app.use(express.json());
app.use(cors());

// Define routes

//app.use('/', verifyToken, authRoutes);
app.use('/',authRoutes);
app.use('/v1', imageRoutes);

module.exports = app;
