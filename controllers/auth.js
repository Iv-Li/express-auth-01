const crypto = require('crypto')
const db = require('../db/models')
const login = (req, res) => {
  res.render('login')
}

const renderSignUp = (req, res) => {
  res.render('signUp')
}

const signUp = (req, res, next) => {
  const salt = crypto.randomBytes(16)
  crypto.pbkdf2(req.body.password, salt, 31000, 32, 'sha256', function (err, hashedPassword) {
    if (err) next(err)
    db.run(
      'INSERT INTO users (username, hash_password, salt) VALUES (?, ?, ?)',
      [req.body.username, hashedPassword, salt],
      function (err) {
        if (err) next(err)
        const user = {
          id: this.lastID,
          username: req.body.username
        }

        req.login(user, function (err) {
          if (err) next(err)
          res.redirect('/')
        })
      }
      )
  })
}

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) next(err)
    res.redirect('/')
  })

}

module.exports = {
  login,
  renderSignUp,
  signUp,
  logout
}