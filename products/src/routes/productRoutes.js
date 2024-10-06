const express = require('express');
const router = express.Router();
const clientController = require('../controllers/productController');

router.get('/', clientController.getClients);
router.get('/razonSocial/:razonSocial', clientController.getClientByRazonSocial);
router.get('/identificacion/:identificacion', clientController.getClientByIdentificacion);
router.get('/:id', clientController.getClient);
router.post('/', clientController.createClient);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;
