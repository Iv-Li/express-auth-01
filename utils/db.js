const db = require("../db/models");


const setPassportCredentials = ({ issuer, profile, done }) => {
  const setNewUserAndCredentials = (userName, provider, subject) => {
    db.run('INSERT INTO users (name) VALUES (?)',
      [userName],
      function (err) {
        if (err) done(err)

        const id = this.lastID
        db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)',
          [id, provider, subject],
          function (err) {
            if (err) done(err)
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

module.exports = { setPassportCredentials }