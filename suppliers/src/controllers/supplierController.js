const Supplier = require('../models/supplier');

exports.getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createSupplier = async (req, res) => {
    const supplier = new Supplier(req.body);
    try {
        const savedSupplier = await supplier.save();
        res.status(201).json(savedSupplier);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateSupplier = async (req, res) => {
    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedSupplier);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteSupplier = async (req, res) => {
    try {
        await Supplier.findByIdAndDelete(req.params.id);
        res.json({ message: 'Supplier deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
