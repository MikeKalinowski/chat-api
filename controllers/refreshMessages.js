const refreshMessages = (req, res, knex) => {
  res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n')
    sse(req, res, knex)
  };

// Checks every 2secs if there are any updates on db for each channel where there is user connected. If there are any updates, sends them to user
function sse(req, res, knex) {
  var oldMessages = "";
  const intervalId = setInterval(() => {
  	console.log("db")
    knex.select('messages.id', 'messages.content', 'messages.userId', 'messages.channelId', 'messages.date', 'users.name', 'users.avatarColor')
    .from('messages').innerJoin('users', 'messages.userId', 'users.id')
    .where({ channelId: req.params.id })
    .orderBy('messages.id')
    .then(
      messages => {
        if (JSON.stringify(messages) !== JSON.stringify(oldMessages)) { //If there are any updates on db since the last messages send, then send to user
          oldMessages = messages.slice()
          res.write('data: ' + JSON.stringify(messages) + '\n\n');
        }
      },
      error => {
        console.log(error);
      }
    )
  }, 2000)

  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  })
}

module.exports = {
  refreshMessages: refreshMessages
}