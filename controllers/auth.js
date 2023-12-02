const login = (req, res) => {
  res.render('login')
}

const singIn = (req, res) => {
  res.render('signUp')
}

module.exports = {
  login,
  singIn
}