
// 1. IMPORTACIÓN DE DEPENDENCIAS
const express = require('express'); // Framework para crear el servidor y manejar rutas
const cors = require('cors');       // Middleware para permitir peticiones desde el frontend (CORS)
const morgan = require('morgan'); // Para ver los logs de las peticiones en consola
const mongoose = require('mongoose');// Para conectar con MongoDB Atlas
const dotenv = require('dotenv');   // Para manejar variables de entorno (como la URL secreta de MongoDB)

// 2. CONFIGURACIONES INICIALES
const app = express();  // instancia de Express para crear el servidor

dotenv.config(); // dotenv para leer las variables del archivo .env secreto

const PORT = process.env.PORT || 5000;

// 3. MIDDLEWARES (Funciones intermedias)
app.use(cors()); // Permite peticiones desde otros dominios (Frontend)
app.use(morgan('dev')); // Pinta en la consola las peticiones HTTP que vayan llegando
// Esto reemplaza a body-parser. Permite que el servidor entienda formato JSON
app.use(express.json()); 

// 4. CONEXIÓN A LA BASE DE DATOS (MongoDB Atlas)
// process.env.MONGO_URI jalará la URL secreta que guardé en el archivo .env
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(' ¡Conexión exitosa a MongoDB Atlas!'))
    .catch((error) => console.error('Error al conectar a MongoDB:', error));

// 5. RUTAS DE PRUEBA
// Una ruta simple en la raíz '/' para verificar que el servidor responda
app.get('/', (req, res) => {
    res.json({ mensaje: "¡Bienvenido a la API del Mundial Rusia 2018 de Javier!" });
});

// 6. ARRANQUE DEL SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: http://localhost:${PORT}`);
});