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


//------------------------------------------------------------------------------------------------------------------------------------
const jwt = require('jsonwebtoken');

// Set a cookie
app.get('/set-cookie', (req, res) => {
  const value = 'partitioned-cookie-value';
  res.setHeader('Set-Cookie', `jwt=${value}; Max-Age=3600; Path=/; HttpOnly; SameSite=None; Secure; Partitioned`);
  res.send('Cookie set successfully!');
});

// Read the cookie from the server
app.get('/read-cookie', (req, res) => {

  res.setHeader("Cache-Control", "no-store");

  const jwtCookie = req.cookies?.jwt;
  if (jwtCookie) {
    console.log({ message: 'Cookie read successfully', cookie: jwtCookie });
    res.status(200).send({ message: 'Cookie read successfully', cookie: jwtCookie });
  } else {
    console.log({ message: 'Cookie not found' });
    res.status(204).send(JSON.stringify({ message: 'Cookie not found', req }));
  }
});

//------------------------------------------------------------------------------------------------------------------------------------

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
