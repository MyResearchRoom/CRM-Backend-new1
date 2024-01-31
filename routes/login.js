const express = require('express');
const router = express.Router();
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!isValidEmail(email) || !isValidPassword(password)) {
    return res.status(400).send('Invalid email or password format');
  }

  // Check if the user exists in the database
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Error querying MySQL:', err);
      return res.status(500).send('Login failed');
    }

    // Check if any user matches the provided email
    if (results.length === 0) {
      return res.status(401).send('Invalid email or password');
    }

    // Compare the provided password with the stored hashed password
    const hashedPassword = results[0].password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      return res.status(401).send('Invalid email or password');
    }

    // User found, generate a JWT token
    const user = { email: results[0].email, userId: results[0].id }; // Customize the user payload as needed
    const secretKey = process.env.JWT_SECRET || 'myresearchroom'; // Replace with your secret key
    const token = jwt.sign(user, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour

    // Send the token in the response
    res.status(200).json({ message: 'Login successful', token });
  });
});

// email validation and isValidPassword functions remain the same
// email validation
function isValidEmail(email) {
  // Check if the email is a string and contains the "@" symbol
  if (typeof email !== 'string' || email.indexOf('@') === -1) {
    return false;
  }

  // Check if the email contains a "." after the "@"
  const parts = email.split('@');
  if (parts.length !== 2 || parts[1].indexOf('.') === -1) {
    return false;
  }

  return true;
}

function isValidPassword(password) {
  return password.length >= 8;
}
module.exports = router;


