const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const db = require("./database");

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use((req, res, next) => {
  console.log("\n---------------------------------------- " + new Date().toLocaleTimeString() + " ----------------------------------------\n");
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.listen(PORT = process.env.PORT, async () => {
  console.log(`1 - server listening on port ${PORT}`);
  try {
    await db.connect();
    console.log("2 - connection to the database was successful");
  } catch (error) {
    console.log(error);
  }
});