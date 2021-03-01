const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');
//Métodos utilizados para el login y logout de usuarios

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log(req.body);
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length>0){
        const user = rows[0];
        //se llama el método de validación de contraseñas
        const validpassword = await helpers.matchPassword(password, user.password);
        if (validpassword) {
            done(null, user, req.flash('success', 'Bienvenido ' + user.username));
        } else {
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', 'El usuario no existe'));
    }
}));

//Registro de un nuevo usuario en la base de datos
passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) =>{
    const { fullname } = req.body;
    const newUser = {
        username,
        password,
        fullname
    }
//se llama al método de encriptación de helpers para insertar la contraseña encriptada
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?' , [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.use('local.chpass', new LocalStrategy({
    passwordField: 'newPass',
    passReqToCallback: true,
}, async (newPass, done) =>{
    const newPass = {
        newPass,
    }
//se llama al método de encriptación de helpers para insertar la contraseña encriptada
    newUser.password = await helpers.encryptPassword(newPass);
    const result = await pool.query('UPDATE users SET ? WHERE id = ?' , [newPass]);
    newPass.id = result.insertId;
    return done(null, newPass);
}));
passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser( async(id, done) =>{
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});