const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : process.env.SQL,
    database : 'chat'
  }
});

const app = express()

app.use(cors())
app.use(bodyParser.json());

app.get('/', function (req, res) {
	knex.select('*').from('users')
	.then(console.log)
  .then(res.send('hello world'))
})

app.post('/register', function (req, res) {
  const hash = bcrypt.hashSync(req.body.password);
  knex.insert({
    name: req.body.name,
    password: hash,
    isAnonymous: false
  })
  .into('users')
  .then(
    () => res.json('User Added'), 
    error => {
      console.log(error);
      if (error.code==23505) {
        res.json("Existing")
      } else {
        res.status(400).json('Error')
      }
    }
  )
})

app.post('/login', function (req, res) {
  knex.select('name', 'password')
  .from('users')
  .where({
    name: req.body.name,
  })
  .then(
    user => {
      // Checking if user and pass are correct 
      if (user.length > 0) {
        const isValid = bcrypt.compareSync(req.body.password, user[0].password);
        if (isValid) { 
          knex.select('name') // Need to query db once again to don't send password to front
          .from('users')
          .where({
            name: req.body.name,
          })
          .then(
            res.json(user[0])
          )
        }  else {
          res.json("No User") // This one will be sent when pass is incorrect
        } 
      } else {
          res.json("No User") // This one will be sent when login is incorrent
      }
    },
    error => {
      console.log(error);
    }
  )
})

console.log("test")

app.listen(8000) 