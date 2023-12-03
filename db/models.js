const sqlite = require('sqlite3')
const mkdir = require('mkdirp')
const path = require('path')
const crypto = require('crypto')

mkdir.sync(path.resolve(__dirname, 'db'))

const db = new sqlite.Database(path.resolve(__dirname, 'db', 'data.db'))

db.serialize(function (){
  db.run('CREATE TABLE IF NOT EXISTS users (\
    id INTEGER PRIMARY KEY, \
    username TEXT UNIQUE, \
    hash_password BLOB, \
    salt BLOB, \
    name TEXT, \
    email TEXT UNIQUE, \
    email_verified INTEGER \
  )')

  db.run('CREATE TABLE IF NOT EXISTS federated_credentials (\
    id INTEGER PRIMARY KEY, \
    user_id INTEGER NOT NULL, \
    provider TEXT NOT NULL, \
    subject TEXT NOT NULL, \
    UNIQUE(provider, subject) \
  )')

  db.run('CREATE TABLE IF NOT EXISTS exer (\
    id INTEGER PRIMARY KEY, \
    owner_id INTEGER NOT NULL, \
    title TEXT NOT NULL, \
    completed BOOLEAN \
  )')

  const salt = crypto.randomBytes(16)
  db.run('INSERT OR IGNORE INTO users (username, hash_password, salt) VALUES (?, ?, ?)',
     ["alice", crypto.pbkdf2Sync("password", salt, 31000, 32, "sha256"), salt]
  )
})

module.exports = db