const express = require('express');
const multer = require('multer');
const router = express.Router();
const db = require('./db');

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define a route to handle the POST request
router.post('/addProfile', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), (req, res) => {
  const {
    fullName,
    dob,
    bloodGroup,
    permanentAddress,
    residentialAddress,
    email,
    mobileNo,
    emergencyContact,
  } = req.body;

  const imageFile = req.files['image'][0].buffer;
  const resumeFile = req.files['resume'][0].buffer;

  // Insert data into the database
  const insertQuery =
    'INSERT INTO profiles (full_name, dob, blood_group, permanent_address, residential_address, email, mobile_no, emergency_contact, image, resume) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(
    insertQuery,
    [
      fullName,
      dob,
      bloodGroup,
      permanentAddress,
      residentialAddress,
      email,
      mobileNo,
      emergencyContact,
      imageFile, // Assuming the column type is BLOB for image
      resumeFile, // Assuming the column type is BLOB for resume
    ],
    (err, result) => {
      if (err) {
        console.error('Error inserting data into MySQL:', err);
        res.status(500).json({ error: 'Error adding profile' });
      } else {
        console.log('Data inserted into MySQL');
        res.status(201).json({ message: 'Profile added successfully' });
      }
    }
  );
});

// Define a route to handle the GET request

router.get('/getProfile', (req, res) => {
  // Fetch data from the database
  const selectQuery = 'SELECT * FROM profiles';

  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error retrieving data from MySQL:', err);
      res.status(500).json({ error: 'Error retrieving profiles' });
    } else {
      console.log('Profiles data retrieved from MySQL');

      // Convert image buffer and resume buffer to base64 for each profile
      results.forEach(profile => {
        if (Buffer.isBuffer(profile.image)) {
          const base64Image = `data:image/png;base64,${profile.image.toString('base64')}`;
          profile.image = base64Image;
        }

        if (Buffer.isBuffer(profile.resume)) {
          const base64Resume = `data:application/pdf;base64,${profile.resume.toString('base64')}`;
          profile.resume = base64Resume;
        }
      });

      res.status(200).json(results);
    }
  });
});
module.exports = router;
