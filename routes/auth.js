const express = require('express')
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local')
const GoogleStrategy = require('passport-google-oidc')
const FacebookStrategy = require('passport-facebook')

const { login, renderSignUp, signUp, logout } = require('../controllers/auth')
const {
  verify,
  serializeUser,
  deserializeUser,
  googleVerify,
  facebookVerify
} = require('../middleware/passportStrategy')

passport.use(new LocalStrategy(verify))
passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)
const GoogleCallbackURL = '/oauth2/redirect/google'
const FacebookCallbackURL = '/oauth2/redirect/facebook'

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: GoogleCallbackURL,
    scope: ['profile']
  },
  googleVerify))

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: FacebookCallbackURL,
    state: true
  },
  facebookVerify))

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

router.get('/login/federated/facebook', passport.authenticate('facebook'))
router.get(FacebookCallbackURL, passport.authenticate('facebook', {
  scope: ['public_profile'],
  successRedirect: '/',
  failureRedirect: '/login'
}))

router.get('/signup', renderSignUp)
router.post('/signup', signUp)
router.get('/logout', logout)

module.exports = router