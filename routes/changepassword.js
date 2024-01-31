const express = require('express');
const router = express.Router();
const db = require('./db');
const bcrypt = require('bcrypt');

router.post('/changepassword', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  // Validate email and new password
  if (!email || !oldPassword || !newPassword) {
    return res.status(400).send('Invalid request. Please provide email, oldPassword, and newPassword.');
  }

  // Check if the user exists in the database
  const userQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(userQuery, [email], async (err, results) => {
    if (err) {
      console.error('Error querying MySQL:', err);
      return res.status(500).send('Change password failed');
    }

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = results[0];

    // Validate old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).send('Invalid old password');
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const updatePasswordQuery = 'UPDATE admin SET password = ? WHERE email = ?';
    db.query(updatePasswordQuery, [hashedNewPassword, email], (updateErr) => {
      if (updateErr) {
        console.error('Error updating password in MySQL:', updateErr);
        return res.status(500).send('Change password failed');
      }

      res.status(200).send('Password changed successfully');
    });
  });
});

module.exports = router;
