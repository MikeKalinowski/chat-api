const handleSendMessage = (req, res, knex, Stream) => {
  knex.insert({
      content: req.body.content,
      userId: req.body.userId,
      channelId: req.body.channelId,
      date: new Date()
  })
  .into('messages')
  .then(
    () => {
      res.json('Message Sent');
    }, 
    error => {
      console.log(error);
      res.json("Error")
    }
  )
  .then((channelId) => {
    knex.select('id', 'content', 'userId', 'channelId', 'date')
    .from('messages')
    .where({channelId: req.body.channelId})
    .then(
      messages => {
        console.log("Sending messages through SSE. Port:", req.body.channelId);
        Stream.emit("push", {
          test: "test",
          messages: messages,
          channelId: channelId,
        })
      },
      error => {
        console.log(error);
      }
    )
  })
}

module.exports = {
  handleSendMessage: handleSendMessage
}