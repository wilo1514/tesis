const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3006;

app.use(express.json());
app.use('/api/products', productRoutes);

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});
