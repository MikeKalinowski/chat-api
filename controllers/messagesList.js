const handleMessagesList = (req, res, knex) => {
  knex.select('messages.id', 'messages.content', 'messages.userId', 'messages.channelId', 'messages.date', 'users.name', 'users.avatarColor')
  .from('messages').innerJoin('users', 'messages.userId', 'users.id')
  .where({channelId: req.body.channelId})
  .orderBy('messages.id')
  .then(
    messages => {
      console.log(messages);
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