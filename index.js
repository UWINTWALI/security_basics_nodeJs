// index.js
require('./db');
require('dotenv').config();
const express = require('express');
const path = require('path');
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken');
const apiRoutes = require('./routes/api');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use('/api', apiRoutes);
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json('Internal server error');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});