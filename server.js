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
  res.cookie('jwt', 'your_jwt_token', {
    httpOnly: true, // Set httpOnly to false to allow client-side access
    secure: true, // Set the Secure flag for HTTPS
    sameSite: 'none', // Set SameSite=None for cross-site cookies
    maxAge: 3600000, // Set the cookie expiration time (1 hour)
    domain: 'back-match.onrender.com', // Set the domain for the cookie
    partitioned: true, 
  });

  res.status(200).send({ message: 'Cookie set successfully' });
});

// Read the cookie from the server
app.get('/read-cookie', (req, res) => {
  const jwtCookie = req.cookies?.jwt;
  if (jwtCookie) {
    res.status(200).send({ message: 'Cookie read successfully', cookie: jwtCookie });
  } else {
    res.status(204).send({ message: 'Cookie not found' });
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
