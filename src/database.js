const mysql = require ('mysql');
const {promisify} = require('util');
const {database} = require('./keys');
const pool = mysql.createPool(database);

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