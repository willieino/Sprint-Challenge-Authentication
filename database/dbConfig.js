const knex = require('knex');

const knexConfig = require('../knexfile.js');

//module.exports = knex(knexConfig.development);
const db = knex(knexConfig.development);

module.exports = {

    insert: (user) => {
      return db('users').insert(user);
    },
  
    findByUsername: (username) => {
      return db('users').where('username', username).first();
    },
  
    findById: (id) => {
      return db('users').where('id', id).first();
    },
  
    findUsers: () => {
      return db('users').select('id', 'username', 'department');
    },
    
    find: () => {
      return db('users').select('id', 'username');
    }
    
  };
  