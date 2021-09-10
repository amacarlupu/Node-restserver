// ===============================================
//  Declarar variables, contantes de manera GLOBAL
// ===============================================

// Puerto -> el PORT si existe en heroku y no el local por eso usa 3000 en local
process.env.PORT = process.env.PORT || 3000;

//::::::::::::::::::::::
//  Entorno
//:::::::::::::::::::::
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//::::::::::::::::::::::
//  Base de datos
//:::::::::::::::::::::
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://<user>:<password>@cluster0.3rpsv.mongodb.net/<db>';
}

process.env.URLDB = urlDB;

