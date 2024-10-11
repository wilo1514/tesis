const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/retentionController');

router.post('/', invoiceController.crearYEnviarFactura);
router.post('/reenviar-pendientes', invoiceController.reenviarFacturasPendientes);

module.exports = router;
