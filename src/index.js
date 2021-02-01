const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const uuid = require('uuid/v4');
const exphbs = require('express-handlebars');
const path = require ('path');
const flash = require ('connect-flash');
const session = require ('express-session');
const MySQLStore = require ('express-mysql-session');
const passport = require ('passport');


const { database } = require ('./keys');


// initalizations
const app = express();
require('./lib/passport');
// settings, se le asigna un puerto por el cuál accedera, teniendo en cuenta uno fijo 4000 o usando uno establecido por el equipo
app.set('port', process.env.port || 4000);
app.set('views', path.join(__dirname, 'views'))
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middlewares, lo que entra al servidor
app.use(session({
    secret: 'OTICsession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/image/uploads'),
    filename: (req, file, cb, filename) => {
        cb(null, uuid() + path.extname(file.originalname));
    }
});
app.use(multer({ storage: storage }).single('image'));
app.use(passport.initialize());
app.use(passport.session());

// Global variables, usadas en cualquier parte de la aplicación
app.use((req,res, next)=>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next(); 
});

// Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

//starting the server
app.listen(app.get('port'), () =>{
    console.log('server on port', app.get('port'));
});
