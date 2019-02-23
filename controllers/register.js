const handleRegister = (req, res, knex, bcrypt) => {
  const hash = bcrypt.hashSync(req.body.password);
  knex.insert({
    name: req.body.name,
    password: hash,
    isAnonymous: false,
    avatarColor: Math.floor(Math.random()*16777215).toString(16)
  })
  .into('users')
  .returning('id')
  .then(
    (id) => res.json({ id: id[0] }), 
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
  handleRegister: handleRegister
}