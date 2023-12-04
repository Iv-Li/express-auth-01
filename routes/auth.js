const express = require('express')
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local')
const GoogleStrategy = require('passport-google-oidc')

const { login, renderSignUp, signUp, logout } = require('../controllers/auth')
const {
  verify,
  serializeUser,
  deserializeUser,
  googleVerify
} = require('../middleware/passportStrategy')

passport.use(new LocalStrategy(verify))
passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)
const GoogleCallbackURL = '/oauth2/redirect/google'
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: GoogleCallbackURL,
    scope: ['profile']
  },
  googleVerify))

router.get('/login', login)
router.post('/login/password', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

router.get('/login/federated/google', passport.authenticate('google'))
router.get(GoogleCallbackURL, passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}))
router.get('/signup', renderSignUp)
router.post('/signup', signUp)
router.get('/logout', logout)

module.exports = router