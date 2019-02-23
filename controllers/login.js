const handleLogin = (req, res, knex, bcrypt) => {
  knex.select('name', 'password', 'id')
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
          res.json({ 
            name: user[0].name,
            id: user[0].id
          });
        } else {
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