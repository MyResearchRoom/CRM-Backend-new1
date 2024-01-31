const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 10, // Adjust the limit as per your requirement
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// The pool will automatically manage connections and handle errors
pool.getConnection((err, connection) => {
  if (err) {
    console.log('Error in database connection:', err);
    if (connection) {
      connection.release(); // Release the connection in case of an error
    }
  } else {
    console.log('Database connected');
    // Use the connection for database operations
    connection.query('SELECT 1 + 1 AS solution', (error, results) => {
      if (error) {
        console.log('Error in executing query:', error);
      } else {
        console.log('The solution is: ', results[0].solution);
      }
      connection.release(); // Release the connection after query execution
    });
  }
});

// Export the pool for use in other parts of your application
module.exports = pool;
