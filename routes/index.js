const express = require('express')
const router = express.Router()

const user = {
  name: 'Iv',
  username: 'Iv Li',
  email: 'iv@gmail.com'
}

router.get('/', (req, res) => {
  res.render('home')
})

router.get('/index', (req, res) => {
  res.render('index', { user })
})

module.exports = router