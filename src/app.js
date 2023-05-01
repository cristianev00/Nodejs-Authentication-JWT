const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const verifyToken = require('./middlewares/verifyToken')

// Create a new Express app
const app = express();

// Configure middleware

// middleware to parse request bodies as JSON
app.use(express.json());
app.use(cors());

// Define routes

//app.use('/', verifyToken, authRoutes);
app.use('/',authRoutes);


module.exports = app;
