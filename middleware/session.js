const connectSession = (req, res, next) => {
  const msgs = req.session.messages || []
  res.locals.messages = msgs
  res.locals.hasMessage = !!msgs.length
  res.locals.messages = []
  next()
}

module.exports = {
  connectSession
}