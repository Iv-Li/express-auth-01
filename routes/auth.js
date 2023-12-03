const express = require('express')
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local')

const { login, renderSignUp, signUp, logout } = require('../controllers/auth')
const { verify, serializeUser, deserializeUser } = require('../middleware/passportStrategy')

passport.use(new LocalStrategy(verify))
passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)

router.get('/login', login)
router.post('/login/password', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))
router.get('/signup', renderSignUp)
router.post('/signup', signUp)
router.get('/logout', logout)

module.exports = router