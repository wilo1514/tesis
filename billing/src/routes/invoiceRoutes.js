const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

router.post('/', invoiceController.createInvoice);
router.post('/:id/submit', invoiceController.submitInvoiceToSRI);

module.exports = router;
