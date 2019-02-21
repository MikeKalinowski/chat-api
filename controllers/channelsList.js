const handleChannelsList = (req, res, knex) => {
  knex.select('id', 'name', 'ownerId', 'isPrivate', 'description')
  .from('channels')
  .then(
    channels => {res.json(channels)}, // This one will be sent when pass is incorrect
    error => {console.log(error);}
  )
}

module.exports = {
  handleChannelsList: handleChannelsList
}