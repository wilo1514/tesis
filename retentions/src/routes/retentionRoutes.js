const express = require('express');
const router = express.Router();
const retentionController = require('../controllers/retentionController');

router.post('/', retentionController.crearYEnviarRetencion);

module.exports = router;
