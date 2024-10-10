const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },  // Nombre de usuario
    email: { type: String, required: true, unique: true },  // Correo electrónico del usuario
    password: { type: String, required: true },  // Contraseña del usuario
});

module.exports = mongoose.model('User', userSchema);

