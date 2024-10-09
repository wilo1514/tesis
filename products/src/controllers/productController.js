const Product = require('../models/product');

exports.createProduct = async (req, res) => {
    try {
        const products = new Product(req.body);
        await products.save();
        res.status(201).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getProductById = async (req, res) => {
    try {
        const products = await Product.findById(req.params.id);
        if (!products) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const products = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!products) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const products = await Product.findByIdAndDelete(req.params.id);
        if (!products) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Buscar productos por nombre
exports.getProductByDescripcion = async (req, res) => {
    try {
        const products = await Product.findOne({ descripcion: req.params.descripcion });
        if (!products) {
            return res.status(404).json({ error: 'Product not found with the provided descripcion' });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Buscar clientes por identificación
exports.getProductByCodigo = async (req, res) => {
    try {
        const products = await Product.findOne({ codigoPrincipal: req.params.codigoPrincipal });
        if (!products) {
            return res.status(404).json({ error: 'Product not found with the provided codigo' });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};