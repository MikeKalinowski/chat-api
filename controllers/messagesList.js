const handleMessagesList = (req, res, knex) => {
  knex.select('id', 'content', 'userId', 'channelId', 'date')
  .from('messages')
  .where({channelId: req.body.channelId})
  .then(
    messages => {
      res.json(messages);
    },
    error => {
      console.log(error);
    }
  )
}

module.exports = {
  handleMessagesList: handleMessagesList
}