//SE REQUIERE EL MÓDULO DE EXPRESS
const express = require('express');
//SE REQUIERE EL MÓDULO MORGAN QUE PERMITE CREAR LOGS DE LAS PETICIONES REALIZADAS AL SERVIDOR
const morgan = require('morgan');
//SE REQUIERE EL MODULO MULTER PARA SUBIDA DE IMAGENES
const multer = require('multer');
//SE REQUIERE EL MÓDULO UUID, ENCARGADO DE DAR UN NOMBRE ÚNICO A CADA IMAGEN SUBIDA
const uuid = require('uuid/v4');
//REQUIERE EL MOTOR DE PLANTILLAS HANDLEBARS Y SE ALMACENA EN LA CONSTANTE EXPHBS
const exphbs = require('express-handlebars');
//SE REQUIERE EL MÓDULO PATH QUE TRAE CONSIGO MÉTODOS PARA EL MANEJO DE DIRECTORIOS
const path = require ('path');
//REQUIERE EL MÓDULO FLASH ENCARGADO DE MOSTRAR LOS MENSAJES ENTRE VISTAS CUANDO SE REALIZA UN PROCEDIMIENTO EXITOSO Y TAMBIÉN EN CASO DE FALLOS
const flash = require ('connect-flash');
//SE REQUIERE EL MÓDULO DE SESIÓN DE EXPRESS PARA CONTROLAR LAS SESIONES REALIZADAS EN LA APP
const session = require ('express-session');
//SE REQUIERE EL MÓDULO ENCARGADO DE ALMACENAR LA SESIÓN DE LA BASE DE DATOS EN LUGAR DEL SERVIDOR, IDEAL PARA LA PUESTA EN PRODUCCIÓN DE LA APP
const MySQLStore = require ('express-mysql-session');
//SE REQUIERE EL MIDDLEWARE PARA EL MANEJO DE LA AUTENTICACIÓN Y EL PROCESO DE LOGIN DEL USUARIO
const passport = require ('passport');

//
const { database } = require ('./keys');


// initalizations
const app = express();
require('./lib/passport');
// settings, se le asigna un puerto por el cuál accedera, teniendo en cuenta uno fijo 4000 o usando uno establecido por el equipo
app.set('port', process.env.port || 4000);
//Se le indica al aplicativo donde se encuentra la carpeta views
app.set('views', path.join(__dirname, 'views'))//se utiliza la constante de node dirname, que se encarga de devolver la dirección de la carpeta donde se está ejecutando en este caso src
//Se hace la configuración de la extensión de las vistas, con el fin de evitar escribir todo el nombre del motor
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),//Se llama el método join de path, encargado de unir directorios
    partialsDir: path.join(app.get('views'), 'partials'),//Al igual que anteriormente se establece donde está ubicada la carpeta usando join para unir los directorios
//Se establece .hbs como extensión utilizada para cada una de las vistas
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middlewares, lo que entra al servidor
//Sesiones utilizadas cuando se logea un usuario, almacenando estás en la base de datos
app.use(session({
    secret: 'OTICsession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
//SE UTILIZA CONNECT-FLASH
app.use(flash());
//SE UTILIZA MORGAN, PARA MOSTRAR LOS MENSAJES POR CONSOLA DE LAS PETICIONES
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
//Configuración del módulo multer//
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/image/uploads'),//Se le indica el directorio donde se almacenarán las imágenes
    filename: (req, file, cb, filename) => {//Se le indica el nombre con el cual se guardará en la carpeta, teniendo en cuenta la extension de la propiedad originalname del archivo
        cb(null, uuid() + path.extname(file.originalname));//Se usa el módulo uuid encargado de dar nombres únicos a cada imagen subida
    }
});
app.use(multer({ storage: storage }).single('image'));
//SE LLAMA PASSPORT PARA LA AUTENTICACIÓN DE LA SESIÓN Y DE LA INICIALIZACIÓN
app.use(passport.initialize());
app.use(passport.session());

// Global variables, usadas en cualquier parte de la aplicación
app.use((req,res, next)=>{
//MENSAJES FLASH SE PROCESOS EXITOSOS Y ERRORES
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next(); 
});

// Routes
app.use(require('./routes')); //Se le indica la ruta index
app.use(require('./routes/authentication'));//Se indica la ruta de autenticación, donde se trabaja todo lo referente a las vistas de usuario login y singup
app.use('/links',require('./routes/links'));//Se indica la ruta links, donde se trabaja todo lo referente a los enlaces

// Public
app.use(express.static(path.join(__dirname, 'public')));

//starting the server, se utiliza el puerto establecido en settings, para que el servidor escuche en este
app.listen(app.get('port'), () =>{
    //Se indica por consola el puerto al correr el servidor
    console.log('server on port', app.get('port'));
});
