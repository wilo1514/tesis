const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');

router.get('/', codeController.getCodes);
router.get('/type/:type', codeController.getCodeByType);
router.get('/:id', codeController.getCodeById);
router.post('/', codeController.createCode);
router.put('/:id', codeController.updateCode);
router.delete('/:id', codeController.deleteCode);

module.exports = router;
