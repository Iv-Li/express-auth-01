const express = require('express')
const router = express.Router()
const authUser = require('../middleware/authUser')
const index = require('../controllers/index')

const user = {
  name: 'Iv',
  username: 'Iv Li',
  email: 'iv@gmail.com'
}

router.get('/', authUser, index)

router.get('/index', index)

module.exports = router