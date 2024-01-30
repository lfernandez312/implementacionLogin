const { Router } = require('express')
const authMiddleware = require('../middlewares/auth.middlewares')

const router = Router()

router.get('/login', (req, res) => {
  res.render('login.handlebars', {estilo: 'login.css' })
})

router.get('/signup', (req, res) => {
  res.render('signup.handlebars', {estilo: 'login.css' })
})

router.get('/profile', authMiddleware, (req, res) => {
  const { user } = req.session
  res.render('profile.handlebars', { user , estilo: 'login.css'})
})

module.exports = router