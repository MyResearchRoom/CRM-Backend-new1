const express = require('express');
const db = require('./db');

const router = express.Router();
router.post('/createMeeting', (req, res) => {
  const { arrangedBy, date, time, subject, participants } = req.body;

  // Convert the array of participants to a JSON string
  const participantsJSON = JSON.stringify(participants);

  // Insert meeting data into the database
  const insertMeetingQuery = 'INSERT INTO meetings (arranged_by, date, time, subject, participants) VALUES (?, ?, ?, ?, ?)';

  db.query(insertMeetingQuery, [arrangedBy, date, time, subject, participantsJSON], (err) => {
    if (err) {
      console.error('Error inserting meeting data:', err);
      res.status(500).json({ error: 'Error creating meeting' });
    } else {
      console.log('Meeting and participants inserted successfully');
      res.status(201).json({ message: 'Meeting created successfully' });
    }
  });
});

// Define a route to handle the GET request to retrieve all meetings
router.get('/getAllMeetings', (req, res) => {
  // Select all meeting data from the database
  const selectMeetingsQuery = 'SELECT * FROM meetings';

  // Execute the query
  db.query(selectMeetingsQuery, (err, meetings) => {
    if (err) {
      console.error('Error retrieving meetings data:', err);
      res.status(500).json({ error: 'Error retrieving meetings' });
    } else {
      console.log('Meetings data retrieved from MySQL');
      res.status(200).json(meetings);
    }
  });
});
module.exports = router;