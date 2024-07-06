const mysql = require("mysql2");

// Initialize db credentials
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to the database.");
});

// Test the database connection
function testConnection() {
  db.query("SELECT 1", (error, results) => {
    if (error) {
      console.error("Unable to connect to the database:", error);
      return;
    }
    console.log(
      "Connection to the database has been established successfully."
    );
  });
}

module.exports = { db, testConnection };
