const { Router } = require('express')
const Users = require('../models/users.model')

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, password, role} = req.body

    const newUserInfo = {
      first_name,
      last_name,
      email,
      password,
      role,
    }

    const user = await Users.create(newUserInfo)

    res.json({ status: 'success', message: 'Usuario Creado Exitosamente!' })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ status: 'error', message: 'Internal Server Error' })
  }
})

module.exports = router