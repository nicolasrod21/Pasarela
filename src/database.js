//SE REQUIERE EL MÓDULO DE CONEXIÓN DE LA BASE DE DATOS
const mysql = require ('mysql');
const {promisify} = require('util');
//SE REQUIEREN LAS KEYS DE LA BASE DE DATOS PARA REALIZAR LA CONEXIÓN
const {database} = require('./keys');
const pool = mysql.createPool(database);

// CONEXIÓN A LA BASE DE DATOS, MENSAJES DE ERROR PARA CADA CASO DE FALLO
pool.getConnection((err, connection) =>{
    if(err){
        if (err.code == 'PROTOCOL_CONECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if (error.code == 'ER_CON:COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if (error.code == 'ENCONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }
    if (connection) connection.release();
    console.log('DB IS CONNECTED');
    return;
});
//promisify pool querys
pool.query = promisify(pool.query);

module.exports = pool;