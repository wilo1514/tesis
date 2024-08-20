const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

router.post('/', facturaController.crearYEnviarFactura);
router.post('/reenviar-pendientes', facturaController.reenviarFacturasPendientes);

module.exports = router;
