require('dotenv').config()
const express = require('express')
const path = require('path')

const app = express()

const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')

const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))

app.use('/', indexRouter)
app.use('/', authRouter)

app.use(notFound)
app.use(errorHandler)

module.exports = app