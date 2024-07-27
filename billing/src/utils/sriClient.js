const axios = require('axios');
const SRI_TEST_URL = 'https://api-test.sri.gob.ec';
const SRI_PROD_URL = 'https://api.sri.gob.ec';

exports.sendInvoiceToSRI = async (signedXml, isTest = false) => {
    const url = isTest ? `${SRI_TEST_URL}/send` : `${SRI_PROD_URL}/send`;
    try {
        const response = await axios.post(url, { xml: signedXml });
        return { status: 'sent', message: 'Invoice sent successfully', response: response.data };
    } catch (error) {
        console.error('Error sending invoice to SRI:', error);
        throw error;
    }
};

exports.checkInvoiceStatus = async (invoiceId, isTest = false) => {
    const url = isTest ? `${SRI_TEST_URL}/check/${invoiceId}` : `${SRI_PROD_URL}/check/${invoiceId}`;
    try {
        const response = await axios.get(url);
        return { status: response.data.status, message: response.data.message };
    } catch (error) {
        console.error('Error checking invoice status:', error);
        throw error;
    }
};
