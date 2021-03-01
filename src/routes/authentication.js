const express = require('express');//Se requiere express
const router = express.Router();//Método de express para el manejo de rutas
const passport = require('passport');//Se requiere passport encargado de la autenticación y manejo de sesiones
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');//Se requieren los métodos creados para bloquear rutas para usuarios logeados y no logeados

// renderiza a las vistas referentes a registro de usuarios y de inicio de sesión

// vista de registro de usuarios, ruta protegida solo permite ingresar estando con un usuario logeado
router.get('/signup', isLoggedIn, (req, res) =>{
    res.render('auth/signup');
});

router.post('/signup', passport.authenticate('local.signup',{
    successRedirect: '/profile',//Registro exitoso redirecciona al perfil
    failureRedirect: '/signup', //Fallo al iniciar sesión redirecciona a la misma pestaña de registro de usuario
    failureFlash: true //si falla muestre el mensaje flash de fallo
}));

router.get('/chpass', isLoggedIn, (req, res) =>{
    res.render('auth/chpass');
});

router.post('/chpass', passport.authenticate('local.chpass', {
    successRedirect: '/profile',//Registro exitoso redirecciona al perfil
    failureRedirect: '/chpass', //Fallo al iniciar sesión redirecciona a la misma pestaña de registro de usuario
    failureFlash: true //si falla muestre el mensaje flash de fallo
}));
// vista de inicio de sesión de usuarios, ruta protegida solo permite ingresar sin haber logeado previamente
router.get('/signin', isNotLoggedIn, (req, res) =>{
    res.render('auth/signin');
});
//inicio de sesión, post a la base de datos
router.post('/signin', isNotLoggedIn, (req, res, next) =>{
    passport.authenticate('local.signin', {
        successRedirect: '/profile',//Login exitoso redirecciona al perfil
        failureRedirect: '/signin',//Fallo al iniciar sesión redirecciona a la misma pestaña de inicio de sesión
        failureFlash: true //si falla muestre el mensaje flash de fallo
    })(req, res, next);
});

//Ruta protegida solo para usuarios logeados
router.get('/profile', isLoggedIn, (req, res) =>{
    res.render('profile');//Se obtiene la ruta de perfil
});


router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut(); // metodo de passport, que permite eliminar la sesión
    res.redirect('/signin');// Redirecciona a la vista de inicio de sesión
});
//Se exportan las rutas utilizadas en authentication.js
module.exports = router;