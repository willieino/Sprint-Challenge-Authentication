const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const { authenticate } = require('../auth/authenticate');
const db = require('../database/dbConfig');
const logger = require('morgan');
const server = express();

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function protect(req, res, next) {
  const token = req.headers.authorization;

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      res.status(401).json({ message: 'Invalid token'}); 
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

server.use(express.json());
server.use(cors());
server.use(logger('tiny'));

function register(req, res) {
 // server.post('/api/register', (req, res) => {
    const user = req.body;
    console.log("user", user)
    user.password = bcrypt.hashSync(user.password, 10);
    console.log("user password hashed:", user.password)
    db.insert(user)
    .then(ids => {
      db.findById(ids[0])
      .then(user => {
        const token = generateToken(user)
  
        res.status(201).json({id: user.id, token});
      });
    })
    .catch(err => {
      res.status(500).send(err);
    });
 // });
}


function login(req, res) {
  // implement user login
}

function getJokes(req, res) {
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
}
