// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const retentionRoutes = require('./routes/retentionRoutes');

const app = express();

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use('/api/retentions', retentionRoutes);

const port = process.env.PORT || 3008;
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});