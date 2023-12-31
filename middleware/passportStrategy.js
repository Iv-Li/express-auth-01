const crypto = require('crypto')
const db = require('../db/models')
const { setPassportCredentials } = require('../utils/db')

/* LOCAL STRATEGY */
function verify(username, password, done) {
  db.get('SELECT * FROM users WHERE username = ?', [username], function (err, row){
    if(err) return done(err)
    if(!row) return done(null, false, { message: 'Incorrect username or passport' })

    crypto.pbkdf2(password, row.salt, 31000, 32, 'sha256', function (err, hashPassword) {
      if (!crypto.timingSafeEqual(row.hash_password, hashPassword)) {
        return done(null, false, { message: 'Incorrect username or passport' })
      }
    })
    done(null, row);
  })
}

const serializeUser = (user, done) => {
  process.nextTick(() => {
    return done(null, { id: user.id, username: user.username, name: user.name})
  })
}

const deserializeUser = (user, done) => {
  process.nextTick(() => {
    return done(null, user)
  })
}

/* GOOGLE STRATEGY */
const googleVerify = (issuer, profile, done) =>
  setPassportCredentials({ issuer, profile, done })

const facebookVerify = (accessToken, refreshToken, profile, done) =>
  setPassportCredentials({ issuer: 'https://www.facebook.com', profile, done })

module.exports = { verify, serializeUser, deserializeUser, googleVerify, facebookVerify }

