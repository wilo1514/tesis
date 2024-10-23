const express = require('express');
const router = express.Router();
const savebillingController = require('../controllers/savebillingController');

// Ruta para guardar una factura
router.post('/', savebillingController.saveBilling);
router.get('/', savebillingController.getBillings);
router.get('/numeroComprobante/:numeroComprobante', savebillingController.getBillingByNumeroComprobante);
router.get('/numeroAutorizacion/:numeroAutorizacion', savebillingController.getBillingByNumeroAutorizacion);
router.get('/ruc/:ruc', savebillingController.getBillingByRUC);
router.get('/:id', savebillingController.getBillingById);
router.delete('/:id', savebillingController.deleteBilling);
router.get('/detalles/:numeroComprobante', savebillingController.getDetailsByNumeroComprobante);

module.exports = router;
