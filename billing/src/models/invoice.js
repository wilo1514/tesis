const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    customerRuc: { type: String, required: true },
    issueDate: { type: Date, default: Date.now },
    details: [{
        description: String,
        quantity: Number,
        price: Number
    }],
    status: { type: String, default: 'pending' },
    sriResponse: { type: String }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
