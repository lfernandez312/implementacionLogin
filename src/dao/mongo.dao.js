const Chat = require('../models/messages.model');

async function addMessage(username, message) {
  try {
    if (!username || !message) {
      throw new Error('El cuerpo de la solicitud debe contener tanto "username" como "message".');
    }

    // Crea un nuevo documento de mensaje usando el modelo
    const newMessage = new Chat({ username, message });

    // Guarda el mensaje en la base de datos
    await newMessage.save();

    return { status: 'success', message: 'Mensaje agregado correctamente' };
  } catch (error) {
    throw { status: 'error', error: error.message };
  }
}

module.exports = { addMessage };
