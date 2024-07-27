const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supplierSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    ruc: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Supplier', supplierSchema);
