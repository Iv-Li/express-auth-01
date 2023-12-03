const authUser = (req, res, next) => {
  const user = req.user
  if(!user) return res.render('home')
  next()
}

module.exports = authUser