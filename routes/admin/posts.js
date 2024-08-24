const express = require('express');
const router = express.Router();

router.all('/*', (req, res, next) => {
     req.app.locals.layout = 'admin';
     next();
}); 

router.get('/', (req, res) => {
    res.send('IT WORKS');
});

router.get('/create', (req, res) => {
   res.render('admin/posts/create');
});

router.post('/create', (req, res) => {
    
     let allowComments = true;

     if(req.body.allowComments){
        allowComments = true;
     }else {
        allowComments = false;
     }

    const newPost = new Post({
        title: req.body.title,
        status: req.body.status,
        allowComments: req.body.allowComments,
        body: req.body.body
    });

    newPost.save().then(savedPost => {
        res.redirect('/admin/posts');
    })

    


});


module.exports = router;













