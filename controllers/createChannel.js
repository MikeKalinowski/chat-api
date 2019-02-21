const handleCreate = (req, res, knex) => {
  knex.insert({
      name: req.body.newChannelName,
      description: req.body.newChannelDescription,
      ownerId: 1,
      isPrivate: false
  })
  .into('channels')
  .then(
    () => res.json('Channel Added'), 
    error => {
      console.log(error);
      if (error.code==23505) {
        res.json("Existing")
      } else {
        res.status(400).json('Error')
      }
    }
  )
}

module.exports = {
  handleCreate: handleCreate
}