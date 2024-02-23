const { Pool } = require("pg");

const db = new Pool({
  connectionString: process.env.DB_HOST,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = db;