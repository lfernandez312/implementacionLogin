const mongoose = require('mongoose')

const userCollection = 'users'

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  password: String,
  role: {
    type: String,
    default: 'user',
  },
})

const Users = mongoose.model(userCollection, userSchema)

module.exports = Users