const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
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

console.log("test")

app.listen(8000) 