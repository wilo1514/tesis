const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const supplierRoutes = require('./routes/supplierRoutes');
require('dotenv').config();

const app = express();

connectDB();

app.use(bodyParser.json());
app.use('/api/suppliers', supplierRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Supplier service running on port ${PORT}`);
});
