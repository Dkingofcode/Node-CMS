const express = require('express');
const router = express.Router();
const Post = require('../../models/Post')
const select = require('../../helpers/handlebars-helpers');


router.all('/posts/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
}); 

router.get('/', (req, res) => {
    Post.find({}).then(posts => {
        res.render('admin/posts', {posts: posts});
    });
   // res.send('IT WORKS');
});

router.get('/create', (req, res) => {
   res.render('admin/posts/create');
});

router.post('/create', (req, res) => {
    console.log(req.body);

     let allowComments = true;

     if(req.body.allowComments){
        allowComments = true;
     }else {
        allowComments = false;
     }

    const newPost = new Post({
        title: req.body.title,
        status: req.body.status,
        allowComments: req.body.allowComments ? true : false,
        body: req.body.body
    });

    newPost.save().then(savedPost => {
        console.log(savedPost);
        res.redirect('/admin/posts');
    }).catch(error => {
         console.log(error);
    });

});

// router.get('/posts/edit', (req, res) => {
    
//     res.render();
// });


router.get('/edit/:id', (req, res) => {

    Post.findOne({_id: req.params.id}).then(post => {
        res.render('admin/posts/edit', {post: post});
        
    });

   // res.render('admin/posts/edit');
})


router.put('/edit/:id', (req, res) => {
   // res.send('It works');

    Post.findOne({_id: req.params.id}).then(post => {
      if(req.body.allowComments){
        allowComments = true;
      }else {
        allowComments = false;
      }  

      post.title = req.body.title;
      post.status = req.body.status;
      post.allowComments = allowComments;
      post.body = req.body.body;
    
       post.save().then(updatedPost => {
          res.redirect('/admin/posts');
       });
    
    });
});

router.delete('/:id', (req, res) => {
    Post.findByIdAndDelete({ _id: req.params.id}).then(result => {
        res.redirect('/admin/posts');

    });
});

module.exports = router;













