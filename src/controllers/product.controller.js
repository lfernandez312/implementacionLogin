const { Router } = require('express')
const productController = require('./template.controller'); // Asegúrate de tener tu controlador de productos
const Products = require('../models/products.model');

const router = Router()

router.get('/api', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === 'desc' ? -1 : 1;
    const query = req.query.query || {};

    // Realizar la búsqueda en base a la consulta
    const products = await Products.paginate(query, {
      limit,
      page,
      sort: { price: sort },
    });

    const totalPages = Math.ceil(products.total / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevLink = hasPrevPage
      ? `/?page=${page - 1}&limit=${limit}&sort=${sort}`
      : null;
    const nextLink = hasNextPage
      ? `/?page=${page + 1}&limit=${limit}&sort=${sort}`
      : null;

    const options = {
      status: 'success',
      payload: products.docs,
      totalProducts: products.totalDocs,
      limit,
      page,
      sort: { price: sort },
      totalPages,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    };

    res.json(options);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error del servidor al obtener productos' });
  }
});

router.get('/api/:category/:availability?/:limit?', async (req, res) => {
  try {
    const category = req.params.category;
    const availability = req.params.availability;
    const limit = req.params.limit || 10;
    const sort = req.query.sort;

    const result = await productController.getProductsByCategoryAndAvailability(category, availability, limit, sort);
    res.json(result);
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ status: 'error', error: 'Error del servidor al obtener productos' });
  }
});


router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const options = {
      page,
      limit,
    };
    const categories = await productController.getCategories();
    const categoryCounts = await productController.getCategoriesAndCount();
    const products = await productController.getAllProducts(options);

    res.render('products.handlebars', { products, categories, categoryCounts, estilo: 'estilos.css' });
  } catch (error) {
    console.error('Error al obtener productos de la base de datos:', error);
    res.status(500).json({ error: 'Error del servidor al obtener productos' });
  }
});

router.get('/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const products = await productController.getProductsByCategory(category);
    const categoryCounts = await productController.getCategoriesAndCount();
    res.render('categoria.handlebars', { products, category, categoryCounts, estilo: 'estilos.css' });
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    res.status(500).json({ error: 'Error del servidor al obtener productos por categoría' });
  }
});


//router.get('/products', async (req, res) => {
  //try {
    //const products = await Products.find()
    //res.json({ payload: products })
  //} catch (error) {
    //res.json({ error })
  //}
//})

router.post('/products', async (req, res) => {
  try {
    const { name, category, description, price, imageUrl } = req.body;

    const newProductInfo = {
      name,
      category,
      description,
      price,
      imageUrl,
    };

    // Crear el producto en MongoDB
    const newProduct = await Products.create(newProductInfo);

    // Crear índices si no existen
    const indexDefinitions = [
      { name: 1, category: 1 },
      // Agrega aquí otros índices que desees crear
    ];

    for (const indexDefinition of indexDefinitions) {
      const indexExists = await Products.collection.indexExists(indexDefinition);
      if (!indexExists) {
        await Products.collection.createIndex(indexDefinition);
      }
    }

    res.json({ payload: newProduct });
  } catch (error) {
    console.error('Error al crear producto en MongoDB:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});



module.exports = router
