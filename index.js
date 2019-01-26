require('dotenv').config(); // load .env variables

//const { server } = require('./api/server.js');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const logger = require('morgan');
const db = require('./database/dbConfig.js');
const server = express();
const secret = 'shhhthisissecret';
const jwtKey =  process.env.JWT_SECRET // 'add a .env file to root of project with the JWT_SECRET variable


// custom middleware
function protect(req, res, next) {
  const token = req.headers.authorization;

  jwt.verify(token, jwtKey, (err, decodedToken) => {
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
  console.log("user", user)
  user.password = bcrypt.hashSync(user.password, 10);
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
}); 

server.post('/api/login', (req, res) => {
  const creds = req.body;
  db.findByUsername(creds.username)
  .then(user => {
      // username valid   hash from client == hash from db
    if (user && bcrypt.compareSync(creds.password, user.password)) {
      const token = generateToken(user)
      console.log("successful login")
      // redirect
      res.json({ id: user.id, token });

    } else {
      // we send back info that allows the front end 
      // to display a new error message
      res.status(404).json({err: "invalid username or password"});
    }
  })
  .catch(err => {
    res.status(500).send(err);
  });
});
const port = process.env.PORT || 3300;






server.listen(port, () => {
  console.log(`\n=== Server listening on port ${port}\n`);
});
