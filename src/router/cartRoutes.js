const express = require('express');
const cartsController = require('../controllers/carts.controller');

const router = express.Router();

//ya se encuentra el /cart cargado en app.js

router.get('/info', async (req, res) => {
    try {
        const cartInfo = await cartsController.getCartInfo(req);

        // Verifica si cartInfo es null o undefined
        if (!cartInfo || cartInfo.products === null) {
            // El carrito está vacío o no se encontró
            return res.status(404).render('cart.handlebars', { mensaje: 'El carrito está vacío', estilo: 'estilos.css' });
        }

        // Calcular el precio total por producto redondeando a 2 decimales
        cartInfo.products.forEach(product => {
            product.totalPrice = (product.quantity * product.price).toFixed(2);
        });

        // Calcular el totalPrice del carrito redondeando a 2 decimales
        cartInfo.totalPrice = cartInfo.products.reduce((acc, product) => acc + parseFloat(product.totalPrice), 0).toFixed(2);

        // Calcular el totalPrice redondeando a 2 decimales
        const totalPrice = cartInfo.products.reduce((acc, product) => acc + parseFloat(product.price), 0).toFixed(2);

        res.render('cart.handlebars', { cartInfo, totalPrice, estilo: 'estilos.css' });
    } catch (error) {
        console.error('Error al obtener información del carrito:', error);
        res.status(500).json({ error: 'Error al obtener información del carrito' });
    }
});


router.get('/carrito', async (req, res) => {
    try {
        const carts = await cartsController.getAllCarts();
        res.json({ payload: carts });
    } catch (error) {
        res.json({ error });
    }
});

router.get('/carrito/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const populatedCart = await cartsController.getCartByIdPopulated(id);
        res.json({ payload: populatedCart });
    } catch (error) {
        console.error('Error al obtener el carrito con productos completos:', error);
        res.status(500).json({ error: 'Error del servidor al obtener el carrito con productos completos' });
    }
});

router.post('/api', async (req, res) => {
    try {
        const { user, products, total } = req.body;
        const newCartInfo = { user, products, total };
        const newCart = await cartsController.createCart(newCartInfo);
        res.json({ payload: newCart });
    } catch (error) {
        res.json({ error: error.message });
    }
});

router.put('/api/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        await cartsController.updateCart(id, body);
        res.json({ payload: 'Carrito actualizado' });
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
});

router.get('/api/:id/total', async (req, res) => {
    try {
        const { id } = req.body;
        const totalPrice = await cartsController.getCartTotalPrice(id);
        res.json({ status: 'success', totalPrice });
    } catch (error) {
        console.error('Error al obtener el precio total del carrito desde router:', error);
        res.status(500).json({ status: 'error', error: 'Error al obtener el precio total del carrito desde router' });
    }
});

router.post('/agregar', async (req, res) => {
    try {
        const productId = req.body.productId;
        const quantity = req.body.quantity; // Si no se proporciona la cantidad, se establece en 1 por defecto
        const user = req.session.user.email; // Obtengo el usuario actual

        // Lógica para agregar el producto al carrito en controlador
        await cartsController.addToCart(user, productId, quantity);

        res.json({ status: 'success', message: 'Producto agregado al carrito con éxito' });
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({ status: 'error', error: 'Error al agregar al carrito' });
    }
});

router.delete('/remove/:productId', async (req, res) => {
    try {
      const userEmail = req.session.user.email;
      console.log(userEmail)
      const productId = req.body.productId;
      console.log(userEmail)
      const result = await cartsController.removeProductFromCart(userEmail, productId);
  
      res.json(result);
    } catch (error) {
      console.error('Error en la ruta de eliminación del carrito:', error);
      res.status(500).json({ error: 'Error en la ruta de eliminación del carrito' });
    }
  });
module.exports = router;