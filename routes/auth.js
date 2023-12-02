const express = require('express')
const router = express.Router()

const { login, singIn } = require('../controllers/auth')

router.get('/login', login)
router.get('/signIn', singIn)

module.exports = router