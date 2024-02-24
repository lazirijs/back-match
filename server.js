const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const db = require("./database");

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

const routes = require("./routes");

app.get('/payed', (req, res, next) => {
  res.status(200).send(process.env.PAYED);
});

app.use(routes);

app.use((req, res, next) => res.status(404).send("404"));

app.listen(PORT = process.env.PORT, async () => {
  console.log(`1 - server listening on port ${PORT}`);
  try {
    await db.connect();
    console.log("2 - connection to the database was successful");
  } catch (error) {
    console.log(error);
  }
});