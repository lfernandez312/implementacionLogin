const Cart = require('../models/carts.model');
const Products = require('../models/products.model');
const mongoose = require('mongoose');


const cartsController = {
    getAllCarts: async () => {
        try {
            const carts = await Cart.find();
            return carts;
        } catch (error) {
            console.error('Error al obtener todos los carritos:', error);
            throw error;
        }
    },

    getCartById: async (cartId) => {
        try {
            const cart = await Cart.findById(cartId);
            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito por ID:', error);
            throw error;
        }
    },

    createCart: async (cartInfo) => {
        try {
            const newCart = await Cart.create(cartInfo);
            return newCart;
        } catch (error) {
            console.error('Error al crear un nuevo carrito:', error);
            throw error;
        }
    },

    updateCart: async (cartId, updatedInfo) => {
        try {
            const updatedCart = await Cart.findByIdAndUpdate(cartId, updatedInfo, { new: true });
            return updatedCart;
        } catch (error) {
            console.error('Error al actualizar el carrito por ID:', error);
            throw error;
        }
    },

    deleteCart: async (cartId) => {
        try {
            await Cart.findByIdAndDelete(cartId);
            return { message: 'Carrito eliminado con éxito' };
        } catch (error) {
            console.error('Error al eliminar el carrito por ID:', error);
            throw error;
        }
    },

    getCartByIdPopulated: async (cartId) => {
        try {
            const populatedCart = await Cart.findById(cartId).populate('user'); // Ajusta 'user' según tu esquema
            return populatedCart;
        } catch (error) {
            console.error('Error al obtener el carrito con usuario poblado:', error);
            throw error;
        }
    },

    addToCart: async (user, productId, quantity) => {
        try {
            // Obtén el carrito del usuario (si no existe, créalo)
            let cart = await Cart.findOne({ user });

            if (!cart) {
                cart = new Cart({ user, products: [] });
            }

            // Asegúrate de obtener los detalles del producto desde la base de datos
            const productDetails = await Products.findById(productId);

            if (!productDetails) {
                throw new Error('Producto no encontrado');
            }

            // Agrega el producto al carrito con los detalles requeridos
            cart.products.push({
                productId,
                name: productDetails.name,
                price: productDetails.price,
                quantity// Puedes ajustar la cantidad según tus necesidades
            });

            // Guarda el carrito actualizado en la base de datos
            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            throw error;
        }
    },

    getCartInfo: async (req) => {
        try {
            // Obtener información del carrito del usuario
            const userId = req.session.user.email;
            const cart = await Cart.findOne({ user: userId }).populate('products');

            return cart;
        } catch (error) {
            console.error('Error al obtener información del carrito en controller:', error);
            throw error;
        }
    },

    removeProductFromCart: async (userEmail, productId) => {
        try {
            // Obtener el carrito del usuario
            let cart = await Cart.findOne({ user: userEmail });
            console.log(cart+'cartt')
            // Verificar si el carrito existe
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            // Encontrar el índice del producto a eliminar
            const productIndex = cart.products.findIndex(product => product._id && product._id.toString() === productId.toString());
            console.log(productIndex);
            // Verificar si se encontró el producto
            if (productIndex !== -1) {
                // Eliminar el producto específico del carrito
                cart.products.splice(productIndex, 1);

                // Recalcular el precio total del carrito
                cart.totalPrice = cart.products.reduce((total, product) => total + product.totalPrice, 0);

                // Guardar los cambios en el carrito
                await cart.save();

                return { message: 'Producto eliminado del carrito correctamente' };
            } else {
                return { message: 'Producto no encontrado en el carrito' };
            }
        } catch (error) {
            console.error('Error al eliminar producto del carrito en controller:', error);
            throw error;
        }
    },


};

module.exports = cartsController;
