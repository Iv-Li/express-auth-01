const crypto = require('crypto')
const db = require('../db/models')

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
const googleVerify = (issuer, profile, done) => {
  const setNewUserAndCredentials = (userName, provider, subject) => {
    db.run('INSERT INTO users (name) VALUES (?)',
      [userName],
      function (err) {
        if (err) done(err)

        const id = this.lastID
        db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)',
          [id, provider, subject],
          function (err) {
            if(err) done(err)
            const user = {
              id,
              name: profile.displayName
            }
            done(null, user)
          })
      })
  }

  const getExistedUser = (userId) => {
    db.get('SELECT * FROM users WHERE id = ?', userId, function (err, row) {
      if (err) done(err)
      if (!row) done(null, false)
      done(null, row)
    })
  }

  db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?',
    [issuer, profile.id],
    function (err, row) {
      if(err) done(err)
      if(!row) {
        setNewUserAndCredentials(profile.displayName, issuer, profile.id)
      } else {
        getExistedUser(row.user_id)
      }
    })
}

module.exports = { verify, serializeUser, deserializeUser, googleVerify }

