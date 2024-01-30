const mongoose = require('mongoose')

const mongoConnect = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://admin:admin@cluster0.0mdumnn.mongodb.net/ecommerce?retryWrites=true&w=majority'
    )
    console.log('db is connected')
  } catch (error) {
    console.log('db is not connected')
    console.log(error)
  }
}

module.exports = mongoConnect
