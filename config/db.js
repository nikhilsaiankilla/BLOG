const mysql = require("mysql2");

// Initialize db credentials
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Nikhil@0146",
  database: process.env.DB_NAME || "blog",
  port: process.env.DB_PORT,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  checkAndCreateTables();
  console.log("Connected to the database.");
});

const checkAndCreateTables = () => {
  const tables = [
    {
      name: "users",
      schema: `CREATE TABLE \`${process.env.DB_NAME || "blog"}\`.\`users\` (
          \`id\` INT NOT NULL AUTO_INCREMENT,
          \`username\` VARCHAR(45) NOT NULL,
          \`email\` VARCHAR(255) NOT NULL,
          \`userImg\` VARCHAR(255) NULL,
          \`question\` VARCHAR(45) NOT NULL,
          \`password\` VARCHAR(255) NOT NULL,
          PRIMARY KEY (\`id\`),
          UNIQUE INDEX \`email_UNIQUE\` (\`email\` ASC) VISIBLE
        )`,
    },
    {
      name: "posts",
      schema: `CREATE TABLE \`${process.env.DB_NAME || "blog"}\`.\`posts\` (
          \`id\` INT NOT NULL AUTO_INCREMENT,
          \`title\` VARCHAR(255) NOT NULL,
          \`desc\` LONGTEXT NOT NULL,
          \`image\` VARCHAR(255) NOT NULL,
          \`category\` VARCHAR(45) NOT NULL,
          \`date\` DATETIME NOT NULL,
          \`uid\` INT NOT NULL,
          PRIMARY KEY (\`id\`),
          INDEX \`id_idx\` (\`uid\` ASC) VISIBLE,
          CONSTRAINT \`id\`
            FOREIGN KEY (\`uid\`)
            REFERENCES \`${process.env.DB_NAME || "blog"}\`.\`users\` (\`id\`)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        )`,
    },
  ];

  tables.forEach((table) => {
    db.query(`SHOW TABLES LIKE '${table.name}'`, (err, results) => {
      if (err) {
        console.error(`Error checking table ${table.name}:`, err);
        return;
      }

      if (results.length === 0) {
        // Table does not exist, create it
        db.query(table.schema, (err) => {
          if (err) {
            console.error(`Error creating table ${table.name}:`, err);
          } else {
            console.log(`Table ${table.name} created successfully`);
          }
        });
      } else {
        console.log(`Table ${table.name} already exists`);
      }
    });
  });
};
module.exports = { db };
