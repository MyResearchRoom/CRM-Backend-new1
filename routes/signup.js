const express = require('express');
const router = express.Router();
const db = require('./db');
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).send('Invalid email address');
  }
  if (!isValidPassword(password)) {
    return res.status(400).send('Invalid password must contain 8 characters');
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users(name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting data into MySQL:', err);
        return res.status(500).send('Registration failed');
      }
      console.log('Data inserted into MySQL');
      res.status(200).send('Registration successful');
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).send('Registration failed');
  }
});

// email validation
function isValidEmail(email) {
  // Check if the email contains the "@" symbol
  if (email.indexOf('@') === -1) {
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
  //return password.length >= 8;
  return password && password.length >= 8;
}

module.exports = router;

