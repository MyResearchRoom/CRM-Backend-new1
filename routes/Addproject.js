const express = require('express');
const multer = require('multer');
const db = require('./db');
const router = express.Router();

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const moment = require('moment');
router.post('/addProjects', upload.single('requirement'), (req, res) => {
  const {
    projectName,
    department,
    clientName,
    mobileNo,
    email,
    startDate,
    deadlineDate,
    requirementNotes,
    Teamlead,
    selectedMembers,
  } = req.body;

  const requirementFile = req.file;
  const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
  const formattedDeadlineDate = moment(deadlineDate).format('YYYY-MM-DD');

  // Parse selectedMembers JSON string
  const selectedMembersArray = JSON.parse(selectedMembers);

  // Extract only values
  const valuesArray = selectedMembersArray.map(item => item.member.value);
  console.log(valuesArray); // Log the valuesArray to console
  const leadValue = Teamlead.value || Teamlead;
  console.log('Requirement Notes:', requirementNotes);

  // Insert data into MySQL
  const insertQuery =
    'INSERT INTO projects(projectName, department, clientName, mobileNo, email, startDate, deadlineDate, requirement, requirementNotes, Teamlead, selectedMembers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(
    insertQuery,
    [
      projectName,
      department,
      clientName,
      mobileNo,
      email,
      formattedStartDate,
      formattedDeadlineDate,
      requirementFile ? requirementFile.buffer : null,
      requirementNotes,
      leadValue, // Use extracted lead value
     
      JSON.stringify(valuesArray), // Use valuesArray instead of selectedMembersArray
    ],
    (err, result) => {
      if (err) {
        console.error('Error inserting data into MySQL:', err);
        res.status(500).json({ error: 'Error adding project' });
      } else {
        console.log('Data inserted into MySQL');
        res.status(201).json({ message: 'Project added successfully' });
      }
    }
  );
});


router.get('/getAllProjects', (req, res) => {
  const selectQuery =
    'SELECT * FROM projects';

  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error retrieving data from MySQL:', err);
      res.status(500).json({ error: 'Error retrieving projects' });
    } else {
      console.log('Data retrieved from MySQL');
      res.status(200).json(results);
    }
  });
});
// Add this route after your existing routes
router.get('/getProjectsByDepartment/:department', (req, res) => {
  const department = req.params.department;

  const selectQuery =
    'SELECT * FROM projects WHERE department = ?';

  db.query(selectQuery, [department], (err, results) => {
    if (err) {
      console.error('Error retrieving data from MySQL:', err);
      res.status(500).json({ error: 'Error retrieving projects by department' });
    } else {
      console.log('Data retrieved from MySQL');
      res.status(200).json(results);
    }
  });
});


// Add this route after your existing routes
router.get('/getProjectsDepartment/:department', (req, res) => {
  const department = req.params.department;

  const selectQuery =
    'SELECT clientName, Teamlead FROM projects WHERE department = ?';

  db.query(selectQuery, [department], (err, results) => {
    if (err) {
      console.error('Error retrieving data from MySQL:', err);
      res.status(500).json({ error: 'Error retrieving projects by department' });
    } else {
      console.log('Data retrieved from MySQL');
      res.status(200).json(results);
    }
  });
});




router.get('/getAllProjectsClientAndTeamLead', (req, res) => {
  const selectQuery =
    'SELECT clientName, Teamlead FROM projects';

  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error retrieving data from MySQL:', err);
      res.status(500).json({ error: 'Error retrieving projects' });
    } else {
      console.log('Data retrieved from MySQL');
      res.status(200).json(results);
    }
  });
});



// get projectname and all details

router.get('/getProjectsByDepartments/:department', (req, res) => {
  const department = req.params.department;

  const selectQuery =
    'SELECT * FROM projects WHERE department = ?';

  db.query(selectQuery, [department], (err, results) => {
    if (err) {
      console.error('Error retrieving data from MySQL:', err);
      res.status(500).json({ error: 'Error retrieving projects by department' });
    } else {
      console.log('Data retrieved from MySQL');
      res.status(200).json(results);
    }
  });
});


// Add this route after your existing routes
router.get('/getProjectByClient/:clientName', (req, res) => {
  const clientName = req.params.clientName;

  const selectQuery = 'SELECT * FROM project WHERE clientName = ?';

  db.query(selectQuery, [clientName], (err, results) => {
    if (err) {
      console.error('Error retrieving data from MySQL:', err);
      res.status(500).json({ error: 'Error retrieving projects by client name' });
    } else {
      console.log('Data retrieved from MySQL');
      res.status(200).json(results);
    }
  });
});

// Export the router
module.exports = router;
