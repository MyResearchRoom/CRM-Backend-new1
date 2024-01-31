const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
    // Check if the user is authenticated (based on req.session.email)
    if (req.session.email) {
        // User is authenticated, so destroy the session
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                res.status(500).send('Error logging out');
            } else {
                // Redirect the user to the login page after logout
                res.redirect('/login'); // Redirect to the login page
            }
        });
    } else {
        // If the user is not authenticated, simply redirect to the home page
        res.redirect('/'); // Redirect to the home page
    }
});

module.exports = router;