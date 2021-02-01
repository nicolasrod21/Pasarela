// metodo de proteccion de rutas
module.exports = {
    //metodo de verificación ejecute la siguiente línea, sino redireccione al inicio de sesión
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    },
//usuario logeados, metodo para evitar el acceso a rutas previas al login
    isNotLoggedIn(req, res, next){
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/profile');
    }
};