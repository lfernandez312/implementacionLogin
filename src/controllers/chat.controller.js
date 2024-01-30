const FilesDao = require('../dao/files.dao');
const Messages = require('../models/messages.model');

const chatFile = new FilesDao('chats.json');

const chatController = {
  getChatMessages: async () => {
    try {
      const messages = await chatFile.getItems();
      return messages;
    } catch (error) {
      console.error('Error al obtener mensajes del chat:', error);
      throw error;
    }
  },

  createChatMessage: async (userInfo) => {
    try {
      const newUser = await Messages.create(userInfo);
      return newUser;
    } catch (error) {
      console.error('Error al crear mensaje en MongoDB:', error);
      throw error;
    }
  },
};


module.exports = chatController;