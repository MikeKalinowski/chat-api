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
const app = express()
const Stream = new EventEmitter();

app.use(cors())
app.use(bodyParser.json());

app.post('/register', (req, res) => {register.handleRegister(req, res, knex, bcrypt)})
app.post('/login', (req, res) => {login.handleLogin(req, res, knex, bcrypt)})
app.post('/createChannel', (req, res) => {createChannel.handleCreate(req, res, knex)})
app.get('/channelsList', (req, res) => {channelsList.handleChannelsList(req, res, knex)})
app.post('/messagesList', (req, res) => {Stream.emit("push", {test: "yes", tt: "no"}); messagesList.handleMessagesList(req, res, knex)})
app.post('/sendMessage', (req, res) => {sendMessage.handleSendMessage(req, res, knex)})

app.get('/messagesListSSE', function(request, response){
  response.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  Stream.on("push", function(data) {
    setInterval(function() {
      response.write("data: " + JSON.stringify(data) + "\n\n");
    }, 4000);
  });
});

app.listen(8000) 