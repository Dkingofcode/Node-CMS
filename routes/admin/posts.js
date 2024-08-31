const express = require('express');
const router = express.Router();
const Post = require('../../models/Post')
const Category = require('../../models/Category');
//const select = require('../../helpers/handlebars-helpers');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
//const flash = require('connect-flash');
const fs = require('fs');
const {userAuthenticated} = require('../../helpers/authentication');


// Admin Posts Route

router.all('/*',  (req, res, next) => {

    req.app.locals.layout = 'admin';
    next();

}); 

// Get Admin Page

router.get('/', (req, res) => {
    Post.find({}).populate('category').then(posts => {
        res.render('admin/posts', {posts: posts});
    });
   // res.send('IT WORKS');
});


// Get SIngle User Posts

router.get('/my-posts', (req, res) => {

    Post.find({ _id: req.user.id }).populate('category').then(posts => {
        res.render('admin/my-posts', {posts: posts});
    });

});


// Go to Create Posts Page

router.get('/create', (req, res) => {
   res.render('admin/posts/create');
});


let filename = '';

// Create Posts

router.post('/create', (req, res) => {
 let errors = [];

 if(!req.body.title){
    errors.push({message: 'please add a title'});
 }
 
 if(!req.body.status){
    errors.push({message: 'please add a title'});
 }

 if(!req.body.body){
    errors.push({message: 'please add a description'})
 }

 if(errors.length > 0){
    res.render('admin/posts/create', {
        errors: errors
    });
 } else {


    if(!isEmpty(req.files)){
       let file = req.files.file;
        filename = Date.now() + '-' + file.name;
       
       let dirUploads = './public/uploads/';
   
       file.mv(dirUploads + filename, (err) => {
           if(err) throw err;
       });
   
       console.log('is not empty');
       }else{
           console.log('Is Empty');
       }
       
           
   
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
           body: req.body.body,
           category: req.body.category,
           file: filename
       });
   
       newPost.save().then(savedPost => {
           console.log(savedPost);
           req.flash('success_message', 'Post was Created successfully');
           res.redirect('/admin/posts');
       }).catch(error => {
            console.log(error);
       });   

 }
 
    
});

// router.get('/posts/edit', (req, res) => {
    
//     res.render();
// });




// Go to Update Posts Page

router.get('/edit/:id', (req, res) => {

    Post.findOne({_id: req.params.id}).then(post => {
      Category.find({}).then(categories => {
          
          res.render('admin/posts/edit', {post: post, categories: categories});    
       });
    });

   // res.render('admin/posts/edit');
});


// Update Posts

router.put('/edit/:id', (req, res) => {
   // res.send('It works');

    Post.findOne({_id: req.params.id}).then(post => {
      if(req.body.allowComments){
        allowComments = true;
      }else {
        allowComments = false;
      }  

      post.user = req.user.id;
      post.title = req.body.title;
      post.status = req.body.status;
      post.allowComments = allowComments;
      post.body = req.body.body;
      post.category = req.body.category;


      if(!isEmpty(req.files)){
        let file = req.files.file;
         filename = Date.now() + '-' + file.name;
         post.file = filename;
         
        let dirUploads = './public/uploads/';
    
        file.mv(dirUploads + filename, (err) => {
            if(err) throw err;
        });
            
        console.log('is not empty');
    }else{
        console.log('Is Empty');
    }
    
    
    
    post.save().then(updatedPost => {
           req.flash('success_message', 'Post was successfully deleted');
           res.redirect('/admin/my-posts');
        });
    
    });
});


// Delete Posts

router.delete('/:id', (req, res) => {
    Post.findById({ _id: req.params.id}).populate('comments').then(result => {
      
        fs.unlink(uploadDir + result.file, (err) => {
              
              if(!result.comments.length < 1){
                  result.comments.forEach(comment => {
                    comment.deleteOne();
                  });
              }
            
              result.deleteOne().then(postRemoved => {
                req.flash('success_message', 'Post was successfully deleted');
                res.redirect('/admin/my-posts');  
              });

              
             // console.log(err);  
        });      


    });
});

module.exports = router;













