const bcrypt = require('bcryptjs');
const helpers = {};

//Método de encriptación de las contraseñas
helpers.encryptPassword = async (password) =>{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

//Validación de las contraseñas, con las ya almacenadas
helpers.matchPassword = async (password, savedPassword) =>{
    try{
        return await bcrypt.compare(password, savedPassword);
    } catch(e){
        console.log(e);
    }
};

module.exports = helpers;