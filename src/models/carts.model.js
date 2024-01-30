const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: String,
    unique: true,
    required: true,
  },
  products: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
  },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;