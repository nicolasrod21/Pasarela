const { request } = require('express');
const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isNotLoggedIn} = require('../lib/auth');

router.get('/', isNotLoggedIn, async (req, res) => {
    const linksnouser = await pool.query('SELECT * FROM links');
    console.log(linksnouser)
    res.render('index', {links:linksnouser});
});

router.get('/', (req, res)=>{
    res.render('index');
});


module.exports = router;