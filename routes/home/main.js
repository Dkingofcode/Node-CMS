const express = require("express");
const router = express.Router();
const Post = require('../../models/Post');



router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'Home';
    next();
});

router.get('/', (req, res) => {
 
    req.session.user = 'User One';

    if(req.session.user){
      console.log(`We found ${req.session.user}`);
    }

    Post.find({}).then(posts => {
        
        res.render('Home/index', {posts: posts});
    })
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



router.get('/post/:id', (req, res) => {
    Post.findOne({_id: req.params.id }).then(post => {
        Category.find({}).then(categories => {
            res.render('Home/singlePost', {singlePost: post, categories: categories});
        });        
    });
});




module.exports = router;