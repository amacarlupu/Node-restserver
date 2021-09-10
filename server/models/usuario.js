// Importat mongoose
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Definir el schema
const Schema = mongoose.Schema;

// Crear la enumeracion que contiene los tipos permitidos de roles
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true, // Necesario para usar la libreria mongoose-unique-val
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false // No es obligatoria
    },
    role: {
        type: String,
        default: 'USER_ROLE', // Si no especifico el rol
        enum: rolesValidos // El rol debe existir dentro de "enum"  
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false // Si el usuario no se crea con propiedad google es false
    }
});

// Metodo que oculta el campo contraseña del post, metodo 'toJson' es para imprimir
usuarioSchema.methods.toJSON = function () {

    // Apuntar al usuario seleccionado
    let user = this;
    let userObject = user.toObject(); // Tomar el objeto de ese usuario
    delete userObject.password; // Eliminar el campo password

    return userObject;
}

// El esquema necesita tener un campo con unique antes de usar el plugin
usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único' // PATH es el nombre del campo en DB 
});

// Exportar Usuario con la configuracion de usuarioSchema
module.exports = mongoose.model('Usuario', usuarioSchema);