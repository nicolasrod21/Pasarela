const { request } = require('express');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const Promise = require('bluebird');
const unlink = Promise.promisify(fs.unlink);
const filepath = require ('path');

const pool = require('../database');
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const { stringify } = require('uuid');


router.get('/add', isLoggedIn, (req,res)=>{
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res)=>{
    const {title, url, description} = req.body;
    const path = '/image/uploads/' + req.file.filename;
    const {filename, originalname, mimetype, size} = req.file;
    const newlink = {
        title,
        url,
        description,
        filename,
        originalname,
        mimetype,
        path,
        size
    };
    await pool.query('INSERT INTO links set ?', [newlink]);
    req.flash('success', 'Enlace almacenado correctamente');
    console.log(newlink);
    res.redirect('/links');
});

//Solicita todos los datos de los enlaces almacenados
router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links');
    console.log(links)
    res.render('links/list', {links:links});
});


router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    let image = await pool.query('SELECT * FROM links WHERE ID = ?', [id]);
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    const parseImage = JSON.parse(JSON.stringify(image)); 
    await unlink(filepath.resolve('./src/public' + parseImage[0].path));
    req.flash('success', 'Enlace removido correctamente'),
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } =req.params;
    const links = await pool.query('SELECT * FROM links WHERE ID = ?', [id]);
    console.log(links[0]);
    res.render('links/edit', {link:links [0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) =>{
    const { id } = req.params;
    let image = await pool.query('SELECT * FROM links WHERE ID = ?', [id]);
    const parseImage = JSON.parse(JSON.stringify(image));
    console.log('******', parseImage[0].path) 
    await unlink(filepath.resolve('./src/public' + parseImage[0].path));
    const {title, url, description} = req.body;
    const path = '/image/uploads/' + req.file.filename;
    const {filename, originalname, mimetype, size} = req.file;
    const newlink = {
        title,
        url,
        description,
        filename,
        originalname,
        mimetype,
        path,
        size
    };
    console.log(newlink);
    await pool.query('UPDATE links SET ? WHERE id = ?', [newlink, id]);
    req.flash('success', 'Actualizado satisfactoriamente'),
    res.redirect('/links');
});

module.exports = router;