const { Router } = require('express');
const Users = require('../models/users.model');

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Compara la contraseña en texto plano (no recomendado para producción)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Información del usuario a incluir en la respuesta
    const userInfo = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    };

    // Almacena la información del usuario en la sesión
    req.session.user = userInfo;

    console.log(userInfo)
    res.status(200).json({ ...userInfo, redirect: '/profile' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
