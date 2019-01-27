require('dotenv').config(); // load .env variables

//const { server } = require('./api/server.js');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const logger = require('morgan');
const db = require('./database/dbConfig.js');
const server = express();
const secret = 'shhhthisissecret';
const jwtKey = process.env.JWT_SECRET // 'add a .env file to root of project with the JWT_SECRET variable

// custom middleware
function protect(req, res, next) {
  const token = req.headers.authorization;

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      res.status(401).json({ message: 'Invalid token' });
    } else {
      next();
    }
  });
}

//************************************************** */
function generateToken(user) {
  const payload = {
    username: user.username,
  };
  const options = {
    expiresIn: '1h'
  };
  return jwt.sign(payload, secret, options);
}
//**************************************************** */
server.use(express.json());
server.use(cors());
server.use(logger('tiny'));
//********************************************** */
server.get('/', (req, res) => {
  res.send('Its Alive!');
});
//******************************************************* */
server.post('/api/register', (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);
  db.insert(user)
    .then(ids => {
      db.findById(ids[0])
        .then(user => {
          const token = generateToken(user)
          res.status(201).json({ id: user.id, token });
        });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

server.post('/api/login', (req, res) => {
  const creds = req.body;
  db.findByUsername(creds.username)
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        const token = generateToken(user)
        res.json({ id: user.id, token });
      } else {      
        res.status(404).json({ err: "invalid username or password" });
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

server.get('/api/users', protect, (req, res) => {
  db.findUsers()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).send(err);
    })
});

//*************************************************** */
server.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).send('failed to logout');
    } else {
      res.send('logout successful');
    }
  });
});

/* function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
} */

server.get('/api/jokes', (req, res) => {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };
  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
});

const port = process.env.PORT || 3300;

server.listen(port, () => {
  console.log(`\n=== Server listening on port ${port}\n`);
});
