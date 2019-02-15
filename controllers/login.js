const sendUser = (res, req, knex, user) => {
  knex.select('name') // Need to query db once again to don't send password to front
  .from('users')
  .where({
    name: req.body.name,
  })
  .then(
    res.json(user[0])
  )
}

const handleLogin = (req, res, knex, bcrypt) => {
  knex.select('name', 'password')
  .from('users')
  .where({
    name: req.body.name,
  })
  .then(
    user => {
      // Checking if user and pass are correct 
      if (user.length > 0) {
        const isValid = bcrypt.compareSync(req.body.password, user[0].password);
        if (isValid) { 
          sendUser(res, req, knex, user)
        }  else {
          res.json("No User") // This one will be sent when pass is incorrect
        } 
      } else {
          res.json("No User") // This one will be sent when login is incorrent
      }
    },
    error => {
      console.log(error);
    }
  )
}

module.exports = {
  handleLogin: handleLogin
}