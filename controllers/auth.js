const login = (req, res) => {
  res.render('login')
}

const singIn = (req, res) => {
  res.render('signUp')
}

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) next(err)
    res.redirect('/')
  })

}

module.exports = {
  login,
  singIn,
  logout
}