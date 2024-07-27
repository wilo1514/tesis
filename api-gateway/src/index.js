const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/billing', require('./routes/billingRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));

app.listen(port, () => {
    console.log(`API Gateway running on port ${port}`);
});
