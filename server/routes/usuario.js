const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

// Usuario mayuscula porque se usuara para crear objetos (nomenclatura)
const Usuario = require('../models/usuario');

const app = express();

// Obtener registro
app.get('/usuario', function (req, res) {
    // res.json('get Usuario LOCAL');

    // Parametros opcionales --> /usuario?parametro=valor
    // Si la pagina recibe el parametro "desde" tons lo toma, sino toma 0
    let desde = req.query.desde || 0;
    desde = Number(desde); // Converir la variable (string) a numero

    let limite = req.query.limite || 5;
    limite = Number(limite);

    // Obtener valores de la DB
    // {estado:true} -> solo me trae los valores de la condicion
    // 'nombre email campoN' -> campos que regresara la funcion
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        // .skip(5) // Que se salte los primeros 5 registros
        // .limit(5) //Solo 5 primeros registros

        .skip(desde) // Salta los primeros x numeros del parametro "desde"
        .limit(limite) // Solo los x primeros registros dado por "Limite"
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // Contar registros
            // {estado:true} -> Filtros para contar 
            Usuario.count({ estado: true }, (err, conteo) => {

                // Retoranr usuarios y cuantos
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });

        });
});

// Crear registro
app.post('/usuario', function (req, res) {

    // el req.body aparece cuando bodyParser procese los value del post
    let body = req.body;

    // Crear objeto del tipo Usuario con sus propiedades
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        // Usar hash sync para que no se carge todo el tiempo
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    // Grabar en la Base de Datos
    // err=> error | usuarioDB=> usuario grabado en DB
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // Que no se muestre la constraseña, pero el objeto sigue existiendo
        //usuarioDB.password = null;

        // Si no contiene error 
        res.json({
            ok: true,
            usuario: usuarioDB // Devuelve el usuario guardado en DB
        });
    });
});

// Actualizar 
app.put('/usuario/:id', function (req, res) {

    // req.params.id --> este id hace referencia al parametro "id" de usuario
    let id = req.params.id;
    // Obtener el cuerpo o body de la peticion
    // _.pick -> devuelve una copia del objeto con las propiedades validas 
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // Para que no se actualize los valores, se elimina la propiedades
    // a modificiar en la peticion PUT, es decir "password" y "google"
    // delete body.password;
    // delete body.google;    


    // Encontrar el id y actualizarlo, primero parametro -> id.
    // Segundo parametro -> objeto que queremos actualizar
    // Tercer paramtro -> 
    // new:true -> boolean que devuelve el valor actualizado
    // runValidator -> Ejecuta validaciones existentes en el esquema Usuario
    // Cuarto parametro -> callback de error y un usuarioDB del esquema Usuario
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        // Si existe un error 
        if (err) {
            return err.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

// Cambiar el estado de algo para que ya no este disponible
app.delete('/usuario/:id', function (req, res) {

    // Obtener el id
    let id = req.params.id;

    //     // Eliminar el registro FISICAMENTE de la DB
    //     Usuario.findByIdAndRemove(id,(err, usuarioBorrado) => {

    //         // Evaluar error
    //         if (err) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err
    //             });
    //         }

    //         // Si viene por parametro un usuarioBorrado 
    //         if (!usuarioBorrado) {
    //             return res.status(400).json({
    //                 ok: true,
    //                 err: {
    //                     message: 'Usuario no encontrado'
    //                 }
    //             });
    //         }

    //         res.json({
    //             ok: true,
    //             usuario: usuarioBorrado
    //         });
    //     });


    // Eliminar poniendo el campo "estado" en falso para desactivarlo

    // Variable que cambia el estado automaticamente
    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        // Evaluar error
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // Si viene por parametro un usuarioBorrado 
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: true,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});

// Exportar app
module.exports = app;