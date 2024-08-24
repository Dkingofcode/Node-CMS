const express = require("express");
const router = express.Router();




router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'home';
    next();

});

router.get('/', (req, res) => {
    res.render('Home/index');
});

router.get('/about', (req, res) => {
   res.render('Home/about');
});

router.get('/login',  (req, res) => {
    res.render('Home/login');
});

router.get('/register', (req, res) => {
    res.render('Home/register');
});


module.exports = router;