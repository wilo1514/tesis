const Code = require('../models/code');

exports.createCode = async (req, res) => {
    try {
        const codes = new Code(req.body);
        await codes.save();
        res.status(201).json(codes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCodes = async (req, res) => {
    try {
        const codes = await Code.find();
        res.status(200).json(codes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCodeById = async (req, res) => {
    try {
        const codes = await Code.findById(req.params.id);
        if (!codes) {
            return res.status(404).json({ error: 'Code not found' });
        }
        res.status(200).json(codes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCode = async (req, res) => {
    try {
        const codes = await Code.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!codes) {
            return res.status(404).json({ error: 'Code not found' });
        }
        res.status(200).json(codes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCode = async (req, res) => {
    try {
        const codes = await Code.findByIdAndDelete(req.params.id);
        if (!codes) {
            return res.status(404).json({ error: 'Code not found' });
        }
        res.status(200).json({ message: 'Code deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Buscar Code por nombre
exports.getCodeByType = async (req, res) => {
    try {
        const codes = await Code.findOne({ type: req.params.type });
        if (!codes) {
            return res.status(404).json({ error: 'Code not found with the provided type' });
        }
        res.status(200).json(codes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Buscar Code por codigo
exports.getCodeByCodigo = async (req, res) => {
    try {
        const codes = await Code.findOne({ codigo: req.params.codigo });
        if (!codes) {
            return res.status(404).json({ error: 'Code not found with the provided type' });
        }
        res.status(200).json(codes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
