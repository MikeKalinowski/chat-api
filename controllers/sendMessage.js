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
}

module.exports = {
  handleSendMessage: handleSendMessage
}