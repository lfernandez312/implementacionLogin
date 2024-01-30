const express = require('express');
const chatController = require('../controllers/chat.controller');

const router = express.Router();

//FileSystem
router.get('/contacto', (req, res) => {
    res.render('chat.handlebars');
  });

router.get('/contacto/cargarChat', async (req, res) => {
    try {
        const messages = await chatController.getChatMessages();
        res.json({ status: 'success', messages });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.post('/in', async (req, res) => {
    try {
        const { user, message } = req.body;
        const newUserInfo = { user, message };
        const newUser = await chatController.createChatMessage(newUserInfo);
        res.json({ payload: newUser });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ status: 'error', error: error.message });
    }
});

module.exports = router;
