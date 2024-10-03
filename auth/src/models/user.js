const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },  // Nombre de usuario
    email: { type: String, required: true, unique: true },  // Correo electrónico del usuario
    password: { type: String, required: true },  // Contraseña del usuario
});

module.exports = mongoose.model('User', userSchema);


// const mongoose = require('mongoose');
// require('dotenv').config();

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.DB_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             useCreateIndex: true,
//             useFindAndModify: false
//         });
//         console.log('MongoDB connected');
//     } catch (err) {
//         console.error(err.message);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;
