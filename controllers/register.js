const handleRegister = (req, res, knex, bcrypt) => {
  const hash = bcrypt.hashSync(req.body.password);
  knex.insert({
    name: req.body.name,
    password: hash,
    isAnonymous: false
  })
  .into('users')
  .then(
    () => res.json('User Added'), 
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