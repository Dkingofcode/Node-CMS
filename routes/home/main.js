const express = require("express");
const router = express.Router();
const Post = require('../../models/Post');
const User = require("../../models/User");
const bcryptjs = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Route Path

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'Home';
    next();
});

// Home route

router.get('/', (req, res) => {
 
    req.session.user = 'User One';

    if(req.session.user){
      console.log(`We found ${req.session.user}`);
    }

    Post.find({}).then(posts => {
        
        res.render('Home/index', {posts: posts});
    })
});

//  About

router.get('/about', (req, res) => {
   res.render('Home/about');
});


// Login

router.get('/login',  (req, res) => {
    res.render('Home/login');


});

passport.use(new LocalStrategy({usernameField: email}, (email, password, done) => {
    console.log(password);

    User.findOne({email: email}).then(user => {
        if(!user) return done(null, false, {message: 'No user found'});
        
        bcryptjs.compare(password, user.password, (err, matched) => {
            if(err)  return err;
            
            if(matched) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect password. '});
        }
      });
   
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


router.post('/login', (req, res, next) => {
  
    passport.authenticate('local', {

    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true

   })(req, res, next);

});


// Logout
router.get('/logout', (req, res) => {

    req.logOut();
    res.redirect('/login');

});




// Get Register Page

router.get('/register', (req, res) => {
    res.render('Home/register');
});




// Register User

router.post('/register', (req, res) => {

     let errors = [];
    console.log("Post register")

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
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,

        })
    }else {
        User.findOne({email: req.body.email}).then(user => {
             if(!user) {
                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,
                });  
        
                bcryptjs.genSalt(10, (err, salt) => {
                    bcryptjs.hash(newUser.password, salt, (err, hash) => {

                        console.log(hash);

                         newUser.password = hash;
                         
                         newUser.save().then(savedUser => {
                   
                            res.send("user data valid");
                
                        });

                    });
                });
        
                
            }else{
                 req.flash('error_message', 'The email already exists please login');
                 res.redirect('/login');
            }


        });

    }


});

// Get Single Post

router.get('/post/:id', (req, res) => {
    Post.findOne({_id: req.params.id }).then(post => {
        Category.find({}).then(categories => {
            res.render('Home/singlePost', {singlePost: post, categories: categories});
        });        
    });
});




module.exports = router;