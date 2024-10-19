const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const savebillingRoutes = require('./routes/savebillingRoutes');

const app = express();

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use('/api/savebilling', savebillingRoutes);

const port = process.env.PORT || 3011;
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});