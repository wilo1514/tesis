const Invoice = require('../models/invoice');
const { generateXML, signXML } = require('../utils/xmlGenerator');
const { sendInvoiceToSRI, checkInvoiceStatus } = require('../utils/sriClient');

exports.createInvoice = async (req, res) => {
    const invoice = new Invoice(req.body);
    try {
        const savedInvoice = await invoice.save();
        res.status(201).json(savedInvoice);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.submitInvoiceToSRI = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        const xml = generateXML(invoice);
        const signedXml = signXML(xml);

        const response = await sendInvoiceToSRI(signedXml, process.env.NODE_ENV === 'development');
        invoice.status = response.status;
        invoice.sriResponse = response.message;
        await invoice.save();

        res.json({ invoice, sriResponse: response });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
