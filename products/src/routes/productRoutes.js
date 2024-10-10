const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.get('/descripcion/:descripcion', productController.getProductByDescripcion);
router.get('/codigoPrincipal/:codigoPrincipal', productController.getProductByCodigo);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
