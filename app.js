require('dotenv').config()
const express = require('express')

const app = express()

const morgan = require('morgan')
const cookieParser = require('cookie-parser')

app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send('Home page')
})
app.use((err, req, res) => {
  app.send('not found')
})

module.exports = app