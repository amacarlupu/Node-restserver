// Al ser el primer archivo, va a abrir y ejecutar la configuracion puesta
require('./config/config');

// Using Node.js `require()`
const express = require('express');
const mongoose = require('mongoose');
const apiUsuario = require('./routes/usuario');

const app = express();

// const bodyParser = require('body-parser');

// Para eliminar mensajes de advertencia de mongoose
mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);


// MIDDLEWERES
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

// Importar y usar rutas del usuario
app.use('/', apiUsuario);

// Conectar a la Base de Datos
async function ConectaDB() {
    await connect('mongodb://localhost/cafe', {
        useNewUrlParser: true,
        useCreateIndex: true
    }, (err, res) => {
        if (err) {
            throw err;
        } else {
            console.log('Base de datos ONLINE');
        }
    });
}

ConectaDB();

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});