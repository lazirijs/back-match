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

// Generate a JWT token
const token = jwt.sign({ userId: '123' }, 'your_secret_key', { expiresIn: '1h' });

// Set the JWT as a cookie
app.get('/loginJWT', (req, res) => {
  res.cookie('jwt', token, {
    httpOnly: true, // Set the HttpOnly flag
    secure: true, // Set the Secure flag for HTTPS
    sameSite: 'lax', // Set the SameSite attribute
    maxAge: 3600000 // Set the cookie expiration time (1 hour)
  });

  res.send('Login successful!');
});

// Verify the JWT cookie on subsequent requests
app.use((req, res, next) => {
  const token = req.cookies?.jwt;
  console.log('Invalid token', req.cookies, token)
  if (token) {
    jwt.verify(token, 'your_secret_key', (err, decoded) => {
      if (err) {
        // Invalid token
        return res.status(203).send({ message: 'Invalid token' });
      }

      // Set the decoded user data on the request object
      req.user = decoded;
      next();
    });
  } else {
    // No token provided
    return res.status(201).send({ message: 'No token provided', ...req });
  }
});

// Protected route
app.get('/protected', (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
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
