// routes/api.js
const express = require('express');
const jwt = require('jsonwebtoken')
const { login, register } = require('../utils/auth');
const { getExpenses, addExpense, updateExpense, deleteExpense, calculateTotalExpense } = require('../utils/expense');

const router = express.Router();

// Middleware to authenticate JWT
// The authenticateJWT middleware checks for the____
// presence of a JWT in the Authorization header.
// It verifies the token using the secret stored in process.env.JWT_SECRET.
// If the token is valid, the user information is attached to the___
// req object for use in subsequent route handlers.


// User Authentication Routes:
// You have routes for user login and registration.
// Expense Management Routes:
// Routes for getting, adding, updating, and deleting expenses are protected by the authenticateJWT middleware.

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        console.log('No token provided');
        return res.sendStatus(403);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                console.log('Token has expired. Please log in again.');
            }
            return res.sendStatus(403);
        }
        req.user = user; // Save user info to request
        console.log('Token verified, user:', user); // Log user info
        next();
    });
};



// User Authentication Routes
router.post('/auth/login', login);
router.post('/auth/register', register);

// Expense Management Routes
router.get('/expenses', authenticateJWT, getExpenses);
router.post('/expenses', authenticateJWT, addExpense);
router.put('/expenses/:id', authenticateJWT, updateExpense);
router.delete('/expenses/:id', authenticateJWT, deleteExpense);

// Expense Calculation Route
router.get('/expense', authenticateJWT, calculateTotalExpense);

module.exports = router;



