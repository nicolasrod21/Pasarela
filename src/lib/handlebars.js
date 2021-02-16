const {format} = require('timeago.js');

const helpers = {};

//configuración del timestamp, no se hace uso de este módulo
helpers.timeago = (timestamp) =>{
    return format(timestamp);
};

module.exports = helpers;