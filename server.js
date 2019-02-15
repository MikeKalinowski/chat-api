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
const login = require('./controllers/login')
const register = require('./controllers/register')
const createChannel = require('./controllers/createChannel')
const channelsList = require('./controllers/channelsList')
const app = express()

app.use(cors())
app.use(bodyParser.json());

app.get('/', function (req, res) {
	knex.select('*').from('users')
	.then(console.log)
  .then(res.send('hello world'))
})



app.post('/register', (req, res) => {register.handleRegister(req, res, knex, bcrypt)})
app.post('/login', (req, res) => {login.handleLogin(req, res, knex, bcrypt)})
app.post('/createChannel', (req, res) => {createChannel.handleCreate(req, res, knex)})
app.get('/channelsList', (req, res) => {channelsList.handleChannelsList(req, res, knex)})



app.listen(8000) 