const refreshMessages = (req, res, knex) => {
  res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n')
    sse(req, res, knex)
  };

function sse(req, res, knex) {
  var oldMessages = "";
  const intervalId = setInterval(() => {
  	console.log("db")
    knex.select('id', 'content', 'userId', 'channelId', 'date')
    .from('messages')
    .where({ channelId: req.params.id })
    .then(
      messages => {
        if (JSON.stringify(messages) !== JSON.stringify(oldMessages)) { //If there are any updates on db, then send to user
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