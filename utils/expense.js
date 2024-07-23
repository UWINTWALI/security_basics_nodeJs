// utils/expense.js
const db = require('../db');

// // Middleware to check if user is authenticated (assuming JWT is used)
// const authenticateJWT = (req, res, next) => {
//     const token = req.headers['authorization']?.split(' ')[1];
//     if (!token) return res.sendStatus(403);

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403);
//         req.user = user; // Save user info to request
//         next();
//     });
//  };
// This utils/expense.js file looks good and is structured well for handling expense-related operations in this Node.js application. However, there is a small issue regarding the authenticateJWT middleware. This middleware should not be defined in the utils/expense.js file if it is already defined in routes/api.js file. Instead, we should rely on the middleware that we have already set up in api.js.

// Get all expenses for the authenticated user
const getExpenses = (req, res) => {
    const userId = req.user.id; // Assuming user ID is available in req.user
    db.query('SELECT * FROM expenses WHERE user_id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
};

// Add a new expense for the authenticated user
const addExpense = (req, res) => {
    const { description, amount } = req.body;
    const userId = req.user.id; // Assuming user ID is available in req.user

    db.query('INSERT INTO expenses (user_id, description, amount) VALUES (?, ?, ?)', [userId, description, amount], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ id: results.insertId, description, amount });
    });
};

// Update an existing expense for the authenticated user
const updateExpense = (req, res) => {
    const { id } = req.params;
    const { description, amount } = req.body;
    const userId = req.user.id; // Assuming user ID is available in req.user

    db.query('UPDATE expenses SET description = ?, amount = ? WHERE id = ? AND user_id = ?', [description, amount, id, userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Expense not found' });
        res.json({ id, description, amount });
    });
};

// Delete an existing expense for the authenticated user
const deleteExpense = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Assuming user ID is available in req.user

    db.query('DELETE FROM expenses WHERE id = ? AND user_id = ?', [id, userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Expense not found' });
        res.status(204).send();
    });
};

// Calculate total expenses for the authenticated user
const calculateTotalExpense = (req, res) => {
    const userId = req.user.id; // Assuming user ID is available in req.user

    db.query('SELECT SUM(amount) AS total FROM expenses WHERE user_id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ total: results[0].total || 0 });
    });
};

module.exports = { getExpenses, addExpense, updateExpense, deleteExpense, calculateTotalExpense };