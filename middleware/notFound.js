const createError = require('http-errors')
const notFound = (req, res, next) => {
  next(createError(404))
}

module.exports = notFound