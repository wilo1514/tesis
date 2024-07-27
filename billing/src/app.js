// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const invoiceRoutes = require('./routes/invoiceRoutes');
const retryTasks = require('./tasks/retryTasks');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use('/api/invoices', invoiceRoutes);

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        retryTasks.start();
        app.listen(PORT, () => {
            console.log(`Billing service running on port ${PORT}`);
        });
    })
    .catch(err => console.log(err));

