const mysql = require('mysql2');
require("dotenv").config();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ai_hci'
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

module.exports = db;
