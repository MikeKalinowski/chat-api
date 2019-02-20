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
app.post('/sendMessage', (req, res) => {sendMessage.handleSendMessage(req, res, knex, sse)})

app.get('/messagesListSSE/:id', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('\n')
  sseDemo(req, res)
});

function sseDemo(req,res) {
  var oldMessages = "";
  const intervalId = setInterval(() => {
    dbSelect(req, res);
  }, 2000)

  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  })

  dbSelect = (req, res) => { 
    knex.select('id', 'content', 'userId', 'channelId', 'date')
    .from('messages')
    .where({ channelId: req.params.id })
    .then(
      messages => {
        // if (JSON.stringify(messages) !== JSON.stringify(oldMessages)) { //Unsuccessful attempt to not send updates all the time :(
        //   oldMessages = messages.slice()
          res.write('data: ' + JSON.stringify(messages) + '\n\n');
        // }
      },
      error => {
        console.log(error);
      }
    )
  }
}



app.listen(8000) 