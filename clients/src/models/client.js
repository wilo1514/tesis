const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    phone: { type: String },
    ruc: { type: String, required: true, unique: true },
    address: { type: String, required: true },
});

module.exports = mongoose.model('Client', clientSchema);
