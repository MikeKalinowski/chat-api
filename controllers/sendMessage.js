const handleSendMessage = (req, res, knex, sse) => {
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
    .then( // Sends updated messages to all users connected to channel
      messages => {
        console.log("Sending messages through SSE. Port:", req.body.channelId);
        sse.emit(req.body.channelId, messages)},  // req.body.channelId matches data from req.params.id to update messages only to a channel where the message was written
      error => {
        console.log(error);
      }
    )
  })
}

module.exports = {
  handleSendMessage: handleSendMessage
}