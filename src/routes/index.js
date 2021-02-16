const { request } = require('express');
//Se requiere express
const express = require('express');
//Se requiere el método de exress router
const router = express.Router();

const pool = require('../database');
const {isNotLoggedIn} = require('../lib/auth');

//Se indica la ruta inicial, que en este caso es un listar que se encuentra en index.hbs, lo cual muestra los enlaces para las personas que no están logeadas
router.get('/', isNotLoggedIn, async (req, res) => {
    const linksnouser = await pool.query('SELECT * FROM links');
    console.log(linksnouser)
    res.render('index', {links:linksnouser});
});
//Se indica que la vista inicial del aplicativo es index
router.get('/', (req, res)=>{
    res.render('index');
});

//Se exporta el objeto del método
module.exports = router;