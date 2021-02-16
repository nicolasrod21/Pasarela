const { request } = require('express');
const express = require('express'); //Se requier express
const router = express.Router(); //El método de express para el manejo de rutas
const fs = require('fs'); //se requiere el módulo fs para el manejo de las imagenes almacenadas
const Promise = require('bluebird'); //Se requiere el módulo de bluebird para el tema de las promesas asíncronas
const unlink = Promise.promisify(fs.unlink); //Se requiere el método unlink de fs, utilizando bluebird para combertirlo en una promesa asíncrona
const filepath = require ('path');//Se requiere el módulo path para el manejo de directorios

const pool = require('../database');//Se requiere la base de datos
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');//Métodos de rutas protegidas
const { stringify } = require('uuid');//Se requiere uuid almacenandolo en una constante json

//Se obtiene la ruta add, donde se añaden nuevos enlaces
router.get('/add', isLoggedIn, (req,res)=>{
    res.render('links/add');
});
//Ruta add protegida solo para usuarios logeados
router.post('/add', isLoggedIn, async (req, res)=>{
    const {title, url, description} = req.body;//Se obtienen la información del enlace desde el body de la vista
    const path = '/image/uploads/' + req.file.filename;/*Se requiere el nombre del archivo pero se le concatena la 
    ruta en la cuál es almacenado para así obtener el path*/
    const {filename, originalname, mimetype, size} = req.file;//Se requieren las propiedades del archivo(imagen) por medio del req.file
    const newlink = {//Se almacenan todos los datos en una constante
        title,
        url,
        description,
        filename,
        originalname,
        mimetype,
        path,
        size
    };
    await pool.query('INSERT INTO links set ?', [newlink]);//Se inserta la constante con todos los datos almacenados a la base de datos
    req.flash('success', 'Enlace almacenado correctamente');//Mensaje flash indicando proceso realizado exitosamente
    console.log(newlink);
    res.redirect('/links');//redirección a la vista links posterior al proceso exitoso
});

//Solicita todos los datos de los enlaces almacenados, ruta protegida solo para usuarios logeados
router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links');
    console.log(links)
    res.render('links/list', {links:links});//Se listan todos los daos obenido en la vista list
});

//ruta delete, teniendo en cuenta el id de la imagen que se está eliminando, ruta protegida usuarios logeados
router.get('/delete/:id', isLoggedIn, async (req, res) => {//se indica en la ruta delete junto al id correspondiente
    const { id } = req.params;//Se le indica que desde los parametros unicamente quiere obtener el id, indicado en la vista list
    let image = await pool.query('SELECT * FROM links WHERE ID = ?', [id]);//Se almacenan los datos de este id previos a su eliminación
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);//Se hace la petición a la base de datos para eliminar todos los datos de ese id
    const parseImage = JSON.parse(JSON.stringify(image)); //Se convierte en un json los datos almacenados previamente para poder utilizarlos
    await unlink(filepath.resolve('./src/public' + parseImage[0].path));//Se llama el método unlink encargado de eliminar las imágenes en la carpeta local, por medio del path obtenido del json
    req.flash('success', 'Enlace removido correctamente'),//Proceso realizado exitosamente
    res.redirect('/links');//Redirecciona a la vista links
});
//Se obtiene la ruta ediar
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } =req.params;//Se le indica que desde los parametros unicamente quiere obtener el id, indicado en la vista list
    const links = await pool.query('SELECT * FROM links WHERE ID = ?', [id]);//Se hace la petición a la base de datos con el fin de mostrar en la vista editar los datos que ya se encuentran almacenados
    console.log(links[0]);
    res.render('links/edit', {link:links [0]});//Se redirecciona a la vista edit, enviando los datos de links, teniendo en cuenta que se retorna un arreglo con el objeto dentro, se le indica la posición 0 para enviar únicamente el objeto
});
//Ruta post, ruta protegida solo para usuarios logeados
router.post('/edit/:id', isLoggedIn, async (req, res) =>{
    const { id } = req.params;//Se requiere el id
    let image = await pool.query('SELECT * FROM links WHERE ID = ?', [id]);//Al igual que al eliminar se almacenan los datos previamente
    const parseImage = JSON.parse(JSON.stringify(image));//Se realiza la conversión a json
    console.log('******', parseImage[0].path) 
    await unlink(filepath.resolve('./src/public' + parseImage[0].path));//Se elimina la imagen previamente almacenada
    const {title, url, description} = req.body;//Al igual que en el método para añadir se requieren los datos del body
    const path = '/image/uploads/' + req.file.filename;//Se establece el path para la imagen
    const {filename, originalname, mimetype, size} = req.file;//se obtienen los datos de la imagen
    const newlink = {//Se almacena en una constante todos los datos a actualizar en la base de datos
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
    await pool.query('UPDATE links SET ? WHERE id = ?', [newlink, id]);/*Se le indica a la base de datos que se quiere actualizar los 
    datos de ese id que le estamos indicando con los datos almacenados en la constante newlink*/
    req.flash('success', 'Actualizado satisfactoriamente'),//Mensaje flash de proceso realizado exitosamente
    res.redirect('/links');//Redirecciona a la vista links posteriormente al proceso realizado
});
//Se exportan las rutas
module.exports = router;