const express = require('express');
const db = require('./db');
const router = express.Router();

// add employee
router.post('/addEmployee', (req, res) => {
  const { employeeName, email, contactNo, username, password, department } = req.body;

  const insertQuery = 'INSERT INTO employees (employeeName, email, contactNo, username, password, department) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(insertQuery, [employeeName, email, contactNo, username, password, department], (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      res.status(500).json({ error: 'Error adding employee' });
    } else {
      console.log('Data inserted into MySQL');
      res.status(201).json({ message: 'Employee added successfully' });
    }
  });
});

// get all employee
// GET route to retrieve all employees
router.get('/getEmployees', (req, res) => {
  const selectQuery = 'SELECT * FROM employees';

  db.query(selectQuery, (err, result) => {
    if (err) {
      console.error('Error retrieving data from MySQL:', err);
      res.status(500).json({ error: 'Error retrieving employees' });
    } else {
      console.log('Data retrieved from MySQL');
      res.status(200).json(result);
    }
  });
});

// Add a new route to get employees by department
router.get('/getEmployeesByDepartment/:department', (req, res) => {
  const department = req.params.department;

  const selectQuery = 'SELECT * FROM employees WHERE department = ?';

  db.query(selectQuery, [department], (err, results) => {
    if (err) {
      console.error('Error retrieving data from MySQL:', err);
      res.status(500).json({ error: 'Error retrieving employees by department' });
    } else {
      console.log('Data retrieved from MySQL');

      res.status(200).json(results);
    }
  });
});

// GET request to retrieve employees by department-- working
router.get('/getEmployeeByDepartment/:department', (req, res) => {
  const department = req.params.department;

  const selectQuery =
    'SELECT employeeName, department FROM employees WHERE department = ?';

  db.query(selectQuery, [department], (err, results) => {
    if (err) {
      console.error('Error retrieving data from MySQL:', err);
      res.status(500).json({ error: 'Error retrieving employees by department' });
    } else {
      console.log('Data retrieved from MySQL');
      res.status(200).json(results);
    }
  });
});

router.get('/getAllEmployeeNames', (req, res) => {
  const selectQuery = 'SELECT employeeName FROM employees';

  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error retrieving data from MySQL:', err);
      res.status(500).json({ error: 'Error retrieving employee names' });
    } else {
      console.log('Data retrieved from MySQL');
      // Wrap employee names in an object with a label
      const employeeNames = results.map(employee => ({ label: employee.employeeName, value: employee.employeeName }));
      res.status(200).json(employeeNames);
    }
  });
});
module.exports = router;

