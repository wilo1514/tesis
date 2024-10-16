const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const codeRoutes = require('./routes/codeRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3009;

app.use(cors({
    origin: 'http://localhost:8080', // Cambia este valor si es necesario, o usa '*' para permitir cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
}));


app.use(express.json());
app.use('/api/retentioncode', codeRoutes);

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
