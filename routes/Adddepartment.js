const express = require('express');
const db = require('./db');
const router = express.Router();
const multer = require('multer');

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/addDepartment', upload.single('image'), (req, res) => {
  const { title } = req.body;
  const imageFile = req.file; // Contains the uploaded image file

  // Insert data into MySQL
  const insertQuery = 'INSERT INTO departments (title, image) VALUES (?, ?)';

  // Convert the image buffer to a Buffer object
  const imageBuffer = Buffer.from(imageFile.buffer);

  db.query(
    insertQuery,
    [
      title,
      imageBuffer, // Use the Buffer object
    ],
    (err, result) => {
      if (err) {
        console.error('Error inserting data into MySQL:', err);
        res.status(500).json({ error: 'Error adding department' });
      } else {
        console.log('Data inserted into MySQL');
        res.status(201).json({ message: 'Department added successfully' });
      }
    }
  );
});

// Define a route for handling the GET request to get all departments
router.get('/getAllDepartments', (req, res) => {
  const selectQuery = 'SELECT * FROM departments';

  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error retrieving department data from MySQL:', err);
      res.status(500).json({ error: 'Error retrieving departments' });
    } else {
      console.log('Departments data retrieved from MySQL');

      // Convert image buffer to base64 for each department
      const departmentsWithImageData = results.map(department => {
        if (Buffer.isBuffer(department.image)) {
          const base64Image = department.image.toString('base64');
          department.imageData = `data:image/png;base64,${base64Image}`;
          delete department.image; // Remove the original buffer
        }
        return department;
      });

      res.status(200).json(departmentsWithImageData);
    }
  });
});
module.exports = router;
