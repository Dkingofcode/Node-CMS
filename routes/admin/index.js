const express = require('express');
const router = express.Router();
const User = require('../../models/Post');
const {faker} = require('@faker-js/faker');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
}); 

router.get('/', (req, res) => {
    res.render('admin/index');
});

router.post('/generate-fake-posts', (req, res) => {
    for(let i = 0; i < req.body.amount; i++){
        let post = new User();
        
         post.title = faker.music.songName();
         post.status = 'public';
         post.allowComments = faker.datatype.boolean();
         post.body = faker.lorem.sentence();      
   
          post.save().then(dummyData => { })
        
        
        }
        res.redirect('/admin/posts');
});

// admin/Dashboard
// router.get('/dashboard', (req, res) => {
//     res.render('admin/dashboard');
// })

module.exports = router;