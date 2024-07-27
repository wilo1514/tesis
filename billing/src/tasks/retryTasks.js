const cron = require('node-cron');
const Invoice = require('../models/invoice');
const { generateXML, signXML } = require('../utils/xmlGenerator');
const { sendInvoiceToSRI } = require('../utils/sriClient');

const retryFailedInvoices = async () => {
    const invoices = await Invoice.find({ status: 'pending' });
    for (let invoice of invoices) {
        try {
            const signedXml = signXML(generateXML(invoice));
            const response = await sendInvoiceToSRI(signedXml, process.env.NODE_ENV === 'development');
            invoice.status = response.status;
            invoice.sriResponse = response.message;
            await invoice.save();
        } catch (error) {
            console.error('Failed to send invoice, will retry:', invoice._id);
        }
    }
};

exports.start = () => {
    cron.schedule('*/10 * * * *', retryFailedInvoices);
};
