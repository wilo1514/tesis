const express = require('express');
const router = express.Router();
const retentionController = require('../controllers/retentionController');

router.post('/', retentionController.crearYEnviarRetencion);


// Ruta para obtener una retención por su ID
router.get('/retenciones/:id', async (req, res) => {
    try {
        const retencion = await Retencion.findById(req.params.id);
        if (!retencion) {
            return res.status(404).send({ message: 'Retención no encontrada' });
        }
        res.status(200).send(retencion);
    } catch (error) {
        console.error('Error al obtener la retención:', error);
        res.status(500).send({ message: 'Error al obtener la retención' });
    }
});

// Ruta para obtener todas las retenciones
router.get('/retenciones', async (req, res) => {
    try {
        const retenciones = await Retencion.find({});
        res.status(200).send(retenciones);
    } catch (error) {
        console.error('Error al obtener las retenciones:', error);
        res.status(500).send({ message: 'Error al obtener las retenciones' });
    }
});

// Ruta para eliminar una retención por su ID
router.delete('/retenciones/:id', async (req, res) => {
    try {
        const retencion = await Retencion.findByIdAndDelete(req.params.id);
        if (!retencion) {
            return res.status(404).send({ message: 'Retención no encontrada' });
        }
        res.status(200).send({ message: 'Retención eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la retención:', error);
        res.status(500).send({ message: 'Error al eliminar la retención' });
    }
});

// Ruta para reintentar el envío de una retención pendiente
router.post('/retenciones/:id/reintentar', async (req, res) => {
    try {
        const retencionPendiente = await RetencionPendiente.findById(req.params.id);
        if (!retencionPendiente) {
            return res.status(404).send({ message: 'Retención pendiente no encontrada' });
        }
        const resultado = await reintentarEnvio(retencionPendiente);
        res.status(200).send(resultado);
    } catch (error) {
        console.error('Error al reintentar el envío de la retención:', error);
        res.status(500).send({ message: 'Error al reintentar el envío de la retención' });
    }
});

module.exports = router;
