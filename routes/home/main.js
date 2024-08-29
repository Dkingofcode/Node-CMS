const express = require("express");
const router = express.Router();
const Post = require('../../models/Post');
const User = require("../../models/User");



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



router.post('/register', (req, res) => {

     let errors = [];
    

    if(!req.body.firstName){
        errors.push({message: 'please add firstName'});
    }

    
    if(!req.body.lastName){
        errors.push({message: 'please add lastName'});
    }

    
    if(!req.body.email){
        errors.push({message: 'please add your email'});
    }

    
    if(!req.body.password){
        errors.push({message: 'please add password'});
    }

    
    if(!req.body.confirmPassword){
        errors.push({message: 'please confirm password'});
    }
    
    if(req.body.password !== req.body.passwordConfirm){
        errors.push({message: "passwords don't match"});
    }

    if(errors.length > 0){
        res.render('Home/register', {
            errors: errors
        })
    }else {

        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
        });  

        newUser.save().then(savedUser => {
           
            res.send("user data valid");

        });

    }


});

router.get('/post/:id', (req, res) => {
    Post.findOne({_id: req.params.id }).then(post => {
        Category.find({}).then(categories => {
            res.render('Home/singlePost', {singlePost: post, categories: categories});
        });        
    });
});




module.exports = router;