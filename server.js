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
const refreshMessages = require('./controllers/refreshMessages')
const app = express()
const sse = new EventEmitter();

function sendSSE(data) {
  res.write('data: ' + JSON.stringify(data) + '\n\n');
}

app.use(cors())
app.use(bodyParser.json());

app.post('/register', (req, res) => {register.handleRegister(req, res, knex, bcrypt)})
app.post('/login', (req, res) => {login.handleLogin(req, res, knex, bcrypt)})
app.post('/createChannel', (req, res) => {createChannel.handleCreate(req, res, knex)})
app.get('/channelsList', (req, res) => {channelsList.handleChannelsList(req, res, knex)})
app.post('/messagesList', (req, res) => {messagesList.handleMessagesList(req, res, knex)})
app.post('/sendMessage', (req, res) => {sendMessage.handleSendMessage(req, res, knex)})

app.get('/messagesListSSE/:id', (req, res) => {refreshMessages.refreshMessages(req, res, knex)})



app.listen(8000) 