const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const EventEmitter = require('events');
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
const messagesList = require('./controllers/messagesList')
const sendMessage = require('./controllers/sendMessage')
const messagesListSSE = require('./controllers/messagesListSSE')
const app = express()
const sse = new EventEmitter();


app.use(cors())
app.use(bodyParser.json());


app.get('/', (req, res) => {res.send("Working")})
app.post('/register', (req, res) => {register.handleRegister(req, res, knex, bcrypt)})
app.post('/login', (req, res) => {login.handleLogin(req, res, knex, bcrypt)})
app.post('/createChannel', (req, res) => {createChannel.handleCreate(req, res, knex)})
app.get('/channelsList', (req, res) => {channelsList.handleChannelsList(req, res, knex)})
app.post('/messagesList', (req, res) => {messagesList.handleMessagesList(req, res, knex)})
app.post('/sendMessage', (req, res) => {sendMessage.handleSendMessage(req, res, knex)})
app.get('/messagesListSSE/:id', (req, res) => {messagesListSSE.handleMessagesListSSE(req, res, knex)})


app.listen(process.env.PORT || 8000) 