const Product = require('../models/product');

exports.createProduct = async (req, res) => {
    try {
        const client = new Product(req.body);
        await client.save();
        res.status(201).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const clients = await Product.find();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getProduct = async (req, res) => {
    try {
        const client = await Product.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const client = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!client) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const client = await Product.findByIdAndDelete(req.params.id);
        if (!client) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getProductByRazonSocial = async (req, res) => {
    try {
        const clients = await Product.find({ razonSocial: req.params.razonSocial });
        if (clients.length === 0) {
            return res.status(404).json({ error: 'No clients found with the provided razonSocial' });
        }
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Buscar clientes por identificación
exports.getProductByIdentificacion = async (req, res) => {
    try {
        const client = await Product.findOne({ identificacion: req.params.identificacion });
        if (!client) {
            return res.status(404).json({ error: 'Product not found with the provided identificacion' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};